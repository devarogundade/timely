import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import "@nomicfoundation/hardhat-ignition-ethers";
import { ethers } from "hardhat";
import TimelyTokenModule from "./TimelyToken";

const AirdropModule = buildModule("AirdropModule", (m) => {
    const claimAllocation = ethers.parseEther("5");

    const { timelyToken } = m.useModule(TimelyTokenModule);

    const airdrop = m.contract("Airdrop", [timelyToken, claimAllocation]);

    return { airdrop };
});

export default AirdropModule;