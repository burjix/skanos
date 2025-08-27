import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventProcessor } from './events.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'events',
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService, EventProcessor],
  exports: [EventsService],
})
export class EventsModule {}