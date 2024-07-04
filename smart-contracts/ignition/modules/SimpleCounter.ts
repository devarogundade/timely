import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import "@nomicfoundation/hardhat-ignition-ethers";
import TimelyModule from "./Timely";

const SimpleCounterModule = buildModule("SimpleCounterModule", (m) => {
    const { timely } = m.useModule(TimelyModule);

    const simpleCounter = m.contract("SimpleCounter", [timely]);

    return { simpleCounter };
});

export default SimpleCounterModule;