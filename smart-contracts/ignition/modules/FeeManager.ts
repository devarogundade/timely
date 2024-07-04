import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import "@nomicfoundation/hardhat-ignition-ethers";
import { ethers } from "hardhat";

const FeeManagerModule = buildModule("FeeManagerModule", (m) => {
    const BASE_FEE = ethers.parseEther("0.01");

    const feeManager = m.contract("FeeManager", [BASE_FEE]);

    return { feeManager };
});

export default FeeManagerModule;