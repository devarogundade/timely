/* eslint-disable prettier/prettier */

import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bullmq';
import { Model } from 'mongoose';
import { TimelyContract } from 'src/contracts/timelycontract';
import { TimePayload } from 'src/database/timepayload';
import { TimePayloadEvent } from 'src/database/timepayloadevent';
import { Middleware, TimePayloadEventStatus, TimePayloadIn, TimePayloadStatus } from 'src/types';

@Processor('TimePayloadWorker')
export class TimePayloadWorker extends WorkerHost {
    private timelyContract: TimelyContract;

    constructor(
        @InjectModel(TimePayload.name) private timePayloadModel: Model<TimePayload>,
        @InjectModel(TimePayloadEvent.name) private timePayloadEventModel: Model<TimePayloadEvent>,
    ) {
        super();

        this.timelyContract = new TimelyContract();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        try {
            const { identifier } = job.data;

            const timePayload = await this.timePayloadModel.findOne({ identifier }).exec();

            if (!timePayload || timePayload.status == TimePayloadStatus.CANCELLED) {
                job.discard();
                return;
            }

            // check middleware
            if (timePayload.middleware == Middleware.EXISTS) {
                const isExecutable = await this.timelyContract.readTimelyMiddleware(
                    timePayload.sender,
                    timePayload.identifier
                );

                if (!isExecutable) return;
            }

            const eventsIndex = (timePayload.eventsIndex || 0) + 1;

            const timePayloadIn: TimePayloadIn = {
                identifier: timePayload.identifier,
                index: eventsIndex
            };


            const transactionHash = await this.timelyContract.postTimelyCallback(
                timePayload.sender, timePayloadIn
            );

            if (transactionHash) {
                const timePayloadEvent: TimePayloadEvent = {
                    hash: transactionHash,
                    identifier: timePayload.identifier,
                    status: TimePayloadEventStatus.SUCCESSFUL,
                    timestamp: Date.now()
                };

                await this.timePayloadEventModel.create(timePayloadEvent);

                await this.timePayloadModel.updateOne(
                    { identifier }, { eventsIndex }
                ).exec();
            } else {
                await this.timePayloadEventModel.create({
                    identifier: timePayload.identifier,
                    status: TimePayloadEventStatus.FAILED,
                    timestamp: Date.now()
                });
            }
        } catch (error) {
            console.log(error);
            if (job.attemptsMade < 2) {
                job.retry('failed');
            }
        }
    }

    @OnWorkerEvent('completed')
    onCompleted() { }
}