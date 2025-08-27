import { Module } from '@nestjs/common';
import { WealthController } from './wealth.controller';
import { WealthService } from './wealth.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WealthController],
  providers: [WealthService],
  exports: [WealthService],
})
export class WealthModule {}