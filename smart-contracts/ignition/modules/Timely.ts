import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import "@nomicfoundation/hardhat-ignition-ethers";
import TimelyTokenModule from "./TimelyToken";
import FeeManagerModule from "./FeeManager";

const TimelyModule = buildModule("TimelyModule", (m) => {
    const { feeManager } = m.useModule(FeeManagerModule);
    const { timelyToken } = m.useModule(TimelyTokenModule);

    const timely = m.contract("Timely", [feeManager, timelyToken]);

    return { timely };
});

export default TimelyModule;