/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Hours, Middleware, Minutes, Schedule, TimePayloadStatus } from 'src/types';

export type TimePayloadDocument = HydratedDocument<TimePayload>;

@Schema()
export class TimePayload {
    @Prop({ required: true, unique: true })
    nonce: number;

    @Prop({ required: true, unique: true })
    identifier: string;

    @Prop({ required: true })
    sender: string;

    @Prop({ required: true })
    delay: number;

    @Prop({ required: true })
    schedule: Schedule;

    @Prop({ required: true })
    minutes: Minutes;

    @Prop({ required: true })
    hours: Hours;

    @Prop({ required: true })
    middleware: Middleware;

    @Prop({ required: false, default: 0 })
    eventsIndex?: number;

    @Prop({ required: true })
    status: TimePayloadStatus;
}

export const TimePayloadSchema = SchemaFactory.createForClass(TimePayload);