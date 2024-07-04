// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract Airdrop is AccessControl, Pausable {
    using SafeERC20 for IERC20;

    IERC20 private _timelyToken;
    uint256 private _claimAllocation;

    mapping(address => uint256) private _claims;

    event ClaimTokens(address claimer, uint256 claimAllocation);
    event UpdateClaimAllocation(uint256 newAllocation);

    constructor(address timelyToken, uint256 newClaimAllocation) {
        _timelyToken = IERC20(timelyToken);
        _claimAllocation = newClaimAllocation;

        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function claimTokens() external whenNotPaused {
        address claimer = _msgSender();

        require(_claimAllocation > 0, "No claim allocations");
        require(_claims[claimer] == 0, "Already claimed tokens");

        _timelyToken.safeTransfer(claimer, _claimAllocation);
        _claims[claimer] = _claimAllocation;

        emit ClaimTokens(claimer, _claimAllocation);
    }

    function updateClaimAllocation(
        uint256 newAllocation
    ) external whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {
        _claimAllocation = newAllocation;

        emit UpdateClaimAllocation(newAllocation);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unPause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
