// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

import {Data} from "../libraries/Data.sol";

interface IFeeManager {
    event UpdatedBaseFee(uint256 newBaseFee);

    function estimateFee(uint256 count) external view returns (uint256);

    function updateBaseFee(uint256 newBaseFee) external;
}
