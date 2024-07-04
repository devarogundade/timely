/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prettier/prettier */

import Web3 from "web3";
import { Account } from "web3-core";
import { TIMELY_CONTRACT, RPC } from "src/config/constants";

// eslint-disable-next-line @typescript-eslint/no-var-requires
// @ts-ignore
import Timely from "../abis/Timely.json";
import { TimePayloadIn } from "src/types";

// Timely Contract Client.
export class TimelyContract {
    web3: Web3;
    timely: any; // Timely instance.
    signer: Account;

    constructor() {
        this.web3 = new Web3(RPC);
        this.timely = new this.web3.eth.Contract(Timely.abi as any, TIMELY_CONTRACT);

        this.signer = this.web3.eth.accounts.privateKeyToAccount(
            process.env.PRIVATE_KEY
        );

        // Add signer to web3.
        this.web3.eth.accounts.wallet.add(this.signer);
    }

    // Function to estimate message fee.
    async estimateFee(count: number): Promise<number | null> {
        try {
            return await this.timely.methods.estimateFee(
                count
            ).call();
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // Function to post timePayload.
    async postTimelyCallback(receiver: string, timePayloadIn: TimePayloadIn): Promise<string | null> {
        try {
            const gas = await this.timely.methods.postTimelyCallback(
                receiver, timePayloadIn
            ).estimateGas({ from: this.signer.address });

            const gasPrice = await this.web3.eth.getGasPrice();

            const receipt = await this.timely.methods.postTimelyCallback(
                receiver, timePayloadIn
            ).send({
                from: this.signer.address,
                gasPrice: gasPrice,
                gas: gas
            });

            return receipt.transactionHash;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // Function to read middleware.
    async readTimelyMiddleware(receiver: string, identifier: string): Promise<boolean> {
        try {
            const isExecutable = await this.timely.methods.readTimelyMiddleware(
                receiver, identifier
            ).call();

            return isExecutable;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}