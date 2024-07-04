/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import * as fs from 'fs';
import { JobsOptions, Queue } from 'bullmq';
import Web3 from "web3";
import Timely from "../abis/Timely.json";
import { RPC, TIMELY_CONTRACT } from 'src/config/constants';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as path from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TimePayload } from 'src/database/timepayload';
import { Minutes, Schedule, TimePayloadStatus } from 'src/types';
import { HoursToMilliseconds, MinutesToMilliseconds } from 'src/utils/timeconverter';
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class TimePayloadEventService {
    private filePath: string;

    constructor(
        @InjectModel(TimePayload.name) private timePayloadModel: Model<TimePayload>,
        @InjectQueue('TimePayloadWorker') private timePayloadQueue: Queue
    ) {
        this.filePath = path.join(__dirname, `timepaylaod/events`);

        fs.mkdirSync(this.filePath, { recursive: true });

        this.updateBlock(null);
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    private async handleCron() {
        try {
            const json = fs.readFileSync(path.join(this.filePath, `block_number.json`), "utf-8");

            const blockObject = JSON.parse(json);

            const web3 = new Web3(RPC);
            const timely = new web3.eth.Contract(Timely.abi as any, TIMELY_CONTRACT);

            const latestBlock = await web3.eth.getBlockNumber();

            const fromBlock: number | null = blockObject.fromBlock;

            if (fromBlock == latestBlock) return;

            if (!fromBlock) {
                this.updateBlock(latestBlock);
                return;
            }

            timely.getPastEvents('Published', { fromBlock, toBlock: 'latest' }, (error: Error, events: any[]) => {
                this.onPublishedEvents(error, events, this.timePayloadModel, this.timePayloadQueue);
            });

            timely.getPastEvents('Cancelled', { fromBlock, toBlock: 'latest' }, (error: Error, events: any[]) => {
                this.onCancelledEvents(error, events, this.timePayloadModel, this.timePayloadQueue);
            });

            this.updateBlock(latestBlock);
        } catch (error) {
            Logger.error(error);
        }
    }

    private async onPublishedEvents(
        error: Error,
        events: any[],
        timePayloadModel: Model<TimePayload>,
        timePayloadQueue: Queue
    ) {
        if (error) {
            Logger.error(error);
            return;
        }

        if (events.length == 0) {
            return;
        }

        for (let index = 0; index < events.length; index++) {
            const event = events[index];

            const timePayload: TimePayload = {
                nonce: event.returnValues.nonce,
                identifier: event.returnValues.identifier,
                sender: event.returnValues.sender,
                delay: event.returnValues.delay,
                schedule: event.returnValues.iSchedule,
                minutes: event.returnValues.iMinutes,
                hours: event.returnValues.iHours,
                middleware: event.returnValues.middleware,
                status: TimePayloadStatus.ACTIVE,
                eventsIndex: 0
            };

            try {
                await timePayloadModel.create(timePayload);

                const delayInMills = timePayload.delay * 1000;
                const minutesInMills = MinutesToMilliseconds[timePayload.minutes];
                const hoursInMills = HoursToMilliseconds[timePayload.hours];

                const intervalMillis = minutesInMills + hoursInMills;
                const everyMillis = intervalMillis > 0 ? intervalMillis : MinutesToMilliseconds[Minutes.ONE_MINUTES];

                const jobOptions: JobsOptions = {
                    delay: delayInMills,
                    repeat: timePayload.schedule == Schedule.REPEAT ? {
                        every: everyMillis,
                    } : undefined,
                    removeOnComplete: true,
                    removeOnFail: true,
                    jobId: timePayload.identifier,
                };

                await timePayloadQueue.add(timePayload.identifier,
                    { identifier: timePayload.identifier },
                    jobOptions
                );
            } catch (error) {
                Logger.debug(error);
            }
        }
    }

    private async onCancelledEvents(
        error: Error,
        events: any[],
        timePayloadModel: Model<TimePayload>,
        timePayloadQueue: Queue
    ) {
        if (error) {
            Logger.debug(error);
            return;
        }

        if (events.length == 0) {
            return;
        }

        for (let index = 0; index < events.length; index++) {
            const event = events[index];

            const identifier = event.returnValues.identifier;

            try {
                await timePayloadModel.updateOne({ identifier }, {
                    status: TimePayloadStatus.CANCELLED
                }).exec();

                const job = await timePayloadQueue.getJob(identifier);
                job.discard();
            } catch (error) {
                Logger.debug(error);
            }
        }
    }

    private updateBlock(block: number | null) {
        fs.writeFileSync(path.join(this.filePath, `block_number.json`),
            `{ "fromBlock": ${block} }`
        );
    }
}