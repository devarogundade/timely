// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

import {Hash} from "./libraries/Hash.sol";
import {Data} from "./libraries/Data.sol";

import {ITimely} from "./interfaces/ITimely.sol";
import {IFeeManager} from "./interfaces/IFeeManager.sol";
import {ITimelyReceiver} from "./interfaces/ITimelyReceiver.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract Timely is Pausable, ITimely, AccessControl {
    using SafeERC20 for IERC20;

    event Executed(bytes32 identifier, uint64 index);

    bytes32 public constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");

    IERC20 private _timelyToken;
    IFeeManager private _feeManager;

    // Maps identifier indexes to whether is has been executed or not.
    mapping(bytes32 => mapping(uint64 => bool)) private _executedIndexes;

    // Maps dapps with their timely balances.
    mapping(address => uint256) private _balances;

    // Maps identifier with their dapps.
    mapping(bytes32 => address) private _identifierOwners;

    mapping(bytes32 => bool) private _cancelledIdentifiers;

    uint64 private _nonce;

    constructor(address feeManager, address timelyToken) {
        _grantRole(EXECUTOR_ROLE, _msgSender());
        _grantRole(WITHDRAWER_ROLE, _msgSender());
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());

        _timelyToken = IERC20(timelyToken);
        _feeManager = IFeeManager(feeManager);
    }

    function publish(
        Data.TimePayload calldata timePayload
    ) external override whenNotPaused returns (bytes32) {
        address sender = _msgSender();

        bytes32 identifier = Hash.newIdentifier(_nonce, sender, timePayload);

        _identifierOwners[identifier] = sender;

        emit Published(
            _nonce,
            identifier,
            sender,
            timePayload.delay,
            timePayload.iSchedule,
            timePayload.iMinutes,
            timePayload.iHours,
            timePayload.middleware
        );

        _nonce++;

        return identifier;
    }

    function cancel(bytes32 identifier) external override whenNotPaused {
        address sender = _msgSender();

        if (_identifierOwners[identifier] != sender) {
            revert UnAuthorize();
        }

        _cancelledIdentifiers[identifier] = true;

        emit Cancelled(identifier);
    }

    function deposit(uint256 amount) external override whenNotPaused {
        address sender = _msgSender();

        _timelyToken.safeTransferFrom(sender, address(this), amount);

        _balances[sender] += amount;

        emit Deposited(sender, amount);
    }

    function withdraw(uint256 amount) external override whenNotPaused {
        address sender = _msgSender();

        uint256 balance = _balances[sender];

        if (balance < amount) {
            revert InsufficientAmount(balance);
        }

        _timelyToken.safeTransfer(sender, amount);

        _balances[sender] -= amount;

        emit Withdrawn(sender, amount);
    }

    function balanceOf(
        address sender
    ) external view override returns (uint256) {
        return _balances[sender];
    }

    function getTimelyToken() external view returns (address) {
        return address(_timelyToken);
    }

    function claimTokens(address tokenId, uint256 amount) external override {
        require(
            hasRole(WITHDRAWER_ROLE, _msgSender()),
            "Caller is not a withdrawer"
        );

        IERC20 token = IERC20(tokenId);
        token.safeTransfer(_msgSender(), amount);

        emit ClaimedTokens(tokenId, amount);
    }

    function estimateFee(
        uint256 indexCount
    ) external view override returns (uint256) {
        return _feeManager.estimateFee(indexCount);
    }

    function isExecuted(
        bytes32 identifier,
        uint64 index
    ) external view override returns (bool) {
        return _executedIndexes[identifier][index];
    }

    function postTimelyCallback(
        address receiver,
        Data.TimePayloadIn memory timePayload
    ) external {
        require(
            hasRole(EXECUTOR_ROLE, _msgSender()),
            "Caller is not a executor"
        );

        // Check if identifier was cancelled.
        if (_cancelledIdentifiers[timePayload.identifier]) {
            revert IdentifierAlreadyCancelled();
        }

        // Check if this message was executed before.
        if (_executedIndexes[timePayload.identifier][timePayload.index]) {
            revert IndexAlreadyExecuted(
                timePayload.identifier,
                timePayload.index
            );
        }

        // Get dapp balance.
        uint256 balance = _balances[receiver];

        // Get fee for single delivery.
        uint256 SINGLE = 1;
        uint256 fee = _feeManager.estimateFee(SINGLE);

        if (balance < fee) {
            revert InsufficientFee();
        }

        // Deduct fee from dapp balance.
        _balances[receiver] -= fee;

        // Create the receiver contract from interface.
        ITimelyReceiver timelyReceiver = ITimelyReceiver(receiver);

        // This function may revert, depending on the underlying implementation.
        timelyReceiver.timelyCallback(timePayload);

        // Mark message as executed can not be re-executed ever.
        _executedIndexes[timePayload.identifier][timePayload.index] = true;

        emit Executed(timePayload.identifier, timePayload.index);
    }

    function readTimelyMiddleware(
        address receiver,
        bytes32 identifier
    ) external view returns (bool) {
        return ITimelyReceiver(receiver).timelyMiddleware(identifier);
    }

    function pause() external {
        require(
            hasRole(EXECUTOR_ROLE, _msgSender()),
            "Caller is not a executor"
        );

        _pause();
    }

    function unPause() external {
        require(
            hasRole(EXECUTOR_ROLE, _msgSender()),
            "Caller is not a executor"
        );

        _unpause();
    }
}
