// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

import {Data} from "../libraries/Data.sol";

import {ITimely} from "../interfaces/ITimely.sol";

import {TimelyReceiver} from "../TimelyReceiver.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimpleCounter is TimelyReceiver {
    ITimely private _timely;

    uint256 private _count;
    bytes32 private _identifier;

    constructor(address timely) TimelyReceiver(timely) {
        _timely = ITimely(getTimely());
    }

    function start() external {
        // Check if function was called.
        require(_identifier == bytes32(0), "Counter alrady started.");

        // Initial pay for 10 iterations.
        uint256 indexCount = 10;

        uint256 estimatedFee = _timely.estimateFee(indexCount);

        IERC20(_timely.getTimelyToken()).approve(getTimely(), estimatedFee);

        _timely.deposit(estimatedFee);

        // Create the time function param.
        Data.TimePayload memory timePayload = Data.TimePayload({
            delay: 0,
            iSchedule: Data.Schedule.REPEAT,
            iMinutes: Data.Minutes.FIFTEEN_MINUTES,
            iHours: Data.Hours.ZERO_HOUR,
            middleware: Data.Middleware.INGORE
        });

        // Publish the time function to timely network.
        // And update the identifier.
        _identifier = _timely.publish(timePayload);
    }

    function getCount() external view returns (uint256) {
        return _count;
    }

    function _timelyCallback(
        Data.TimePayloadIn calldata timePayload
    ) internal virtual override {
        require(_identifier == timePayload.identifier, "Invalid identifier.");

        uint256 estimatedFee = _timely.estimateFee(1);

        // Check if deposited amount will be enough for next iteration.
        // Otherwise cancel the time function.
        if (_timely.balanceOf(address(this)) < estimatedFee) {
            _timely.cancel(_identifier);
        }

        _count += 1;
    }

    function _timelyMiddleware(
        bytes32 // identifier
    ) internal view virtual override returns (bool) {
        return true;
    }
}
