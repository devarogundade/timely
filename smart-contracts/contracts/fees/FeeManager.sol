// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

import {Data} from "../libraries/Data.sol";
import {IFeeManager} from "../interfaces/IFeeManager.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract FeeManager is IFeeManager, AccessControl {
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    uint256 private _baseFee;

    constructor(uint256 baseFee) {
        _grantRole(MANAGER_ROLE, _msgSender());
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());

        _baseFee = baseFee;
    }

    function estimateFee(
        uint256 count
    ) external view override returns (uint256) {
        return (_baseFee * count);
    }

    function updateBaseFee(uint256 newBaseFee) external override {
        require(hasRole(MANAGER_ROLE, _msgSender()), "Caller is not a manager");

        _baseFee = newBaseFee;

        emit UpdatedBaseFee(newBaseFee);
    }
}
