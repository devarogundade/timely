// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TimelyToken is ERC20 {
    uint256 private constant INITIAL_SUPPLY = 10_000_000_000; // Ten Billion Units

    constructor(address MINTER) ERC20("Timely", "TML") {
        _mint(MINTER, INITIAL_SUPPLY * 10 ** decimals());
    }
}
