import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import "@nomicfoundation/hardhat-ignition-ethers";

const TimelyTokenModule = buildModule("TimelyTokenModule", (m) => {
    const timelyToken = m.contract("TimelyToken", [m.getAccount(0)]);

    return { timelyToken };
});

export default TimelyTokenModule;