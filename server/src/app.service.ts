/* eslint-disable prettier/prettier */

import * as fs from 'fs';
import * as path from 'path';
import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { TimePayload } from './database/timepayload';
import { InjectModel } from '@nestjs/mongoose';
import { TimePayloadEvent } from './database/timepayloadevent';
import { Paged } from './types';
import { TimelyContract } from './contracts/timelycontract';

const TAKE_SIZE: number = 15;

@Injectable()
export class AppService {
  constructor(
    @InjectModel(TimePayload.name) private timePayloadModel: Model<TimePayload>,
    @InjectModel(TimePayloadEvent.name) private timePayloadEventModel: Model<TimePayloadEvent>,
  ) { }

  async latestBlock(): Promise<number | null> {
    try {
      const filePath = path.join(__dirname, `events/timepaylaod/events`);
      const json = fs.readFileSync(path.join(filePath, `block_number.json`), "utf-8");
      const blockObject = JSON.parse(json);
      const fromBlock: number | null = blockObject.fromBlock;
      return fromBlock;
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

  async estimateFee(indexCount: number): Promise<number | null> {
    try {
      const timelyContract = new TimelyContract();
      const fee = await timelyContract.estimateFee(indexCount);
      return fee;
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

  async allTimePayloads(page: number, sender?: string): Promise<Paged<TimePayload[]> | null> {
    try {
      const filter = (sender != 'undefined') ? { sender } : {};

      const total = await this.timePayloadModel.countDocuments(filter);

      const data = await this.timePayloadModel.find(filter)
        .limit(TAKE_SIZE * 1)
        .skip((page - 1) * TAKE_SIZE)
        .sort({ nonce: 'desc' })
        .exec();

      const lastPage = Math.ceil(total / TAKE_SIZE);

      return { total, lastPage, data };
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

  async allTimePayloadEvents(page: number, identifier?: string): Promise<Paged<TimePayloadEvent[]> | null> {
    try {
      const filter = (identifier != 'undefined') ? { identifier } : {};

      const timePayload = await this.timePayloadModel.findOne({ identifier });
      const total = await this.timePayloadEventModel.countDocuments(filter);

      const data = await this.timePayloadEventModel.find(filter)
        .limit(TAKE_SIZE * 1)
        .skip((page - 1) * TAKE_SIZE)
        .sort({ timestamp: 'desc' })
        .exec();

      const lastPage = Math.ceil(total / TAKE_SIZE);

      return { total, lastPage, data, extra: JSON.stringify(timePayload) };
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }
}
