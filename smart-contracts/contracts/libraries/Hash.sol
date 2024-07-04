// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

import {Data} from "./Data.sol";

library Hash {
    bytes32 internal constant LEAF_DOMAIN_SEPARATOR =
        0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE000000000000000000000000;

    function newIdentifier(
        uint64 nonce,
        address sender,
        Data.TimePayload memory timePayload
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    nonce,
                    sender,
                    LEAF_DOMAIN_SEPARATOR,
                    timePayload.iSchedule,
                    timePayload.iMinutes,
                    timePayload.iHours
                )
            );
    }
}
