/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TimePayloadEventStatus } from 'src/types';

export type TimePayloadEventDocument = HydratedDocument<TimePayloadEvent>;

@Schema()
export class TimePayloadEvent {
    @Prop({ required: true })
    identifier: string;

    @Prop({ required: true })
    timestamp: number;

    @Prop({ required: false })
    hash?: string;

    @Prop({ required: true })
    status: TimePayloadEventStatus;
}

export const TimePayloadEventSchema = SchemaFactory.createForClass(TimePayloadEvent);