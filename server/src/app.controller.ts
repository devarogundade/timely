/* eslint-disable prettier/prettier */

import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { TimePayload } from './database/timepayload';
import { TimePayloadEvent } from './database/timepayloadevent';
import { Paged } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("/latestblock")
  async latestBlock(): Promise<number | null> {
    return this.appService.latestBlock();
  }

  @Get("/timepayloads/all")
  async allTimePayloads(
    @Query('page') page: number = 1,
    @Query('sender') sender?: string
  ): Promise<Paged<TimePayload[]> | null> {
    return this.appService.allTimePayloads(page, sender);
  }

  @Get("/timepayloadevents/all")
  async allTimePayloadEvents(
    @Query('page') page: number = 1,
    @Query('identifier') identifier?: string
  ): Promise<Paged<TimePayloadEvent[]> | null> {
    return this.appService.allTimePayloadEvents(page, identifier);
  }
}
