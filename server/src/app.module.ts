/* eslint-disable prettier/prettier */

import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { MongooseModule } from '@nestjs/mongoose';
import { TimePayload, TimePayloadSchema } from './database/timepayload';
import { TimePayloadEvent, TimePayloadEventSchema } from './database/timepayloadevent';
import { TimePayloadEventService } from './events/timepayload';
import { TimePayloadWorker } from './worker';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      }
    }),
    BullModule.registerQueue({ name: 'TimePayloadWorker' }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([
      { name: TimePayload.name, schema: TimePayloadSchema },
      { name: TimePayloadEvent.name, schema: TimePayloadEventSchema },
    ])
  ],
  controllers: [AppController],
  providers: [AppService, TimePayloadEventService, TimePayloadWorker],
})

export class AppModule { }
