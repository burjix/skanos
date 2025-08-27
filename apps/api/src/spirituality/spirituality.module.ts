import { Module } from '@nestjs/common';
import { SpiritualityController } from './spirituality.controller';
import { SpiritualityService } from './spirituality.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SpiritualityController],
  providers: [SpiritualityService],
  exports: [SpiritualityService],
})
export class SpiritualityModule {}