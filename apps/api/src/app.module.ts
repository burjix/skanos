import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { EntitiesModule } from './entities/entities.module';
import { MemoriesModule } from './memories/memories.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HealthModule } from './health/health.module';
import { WealthModule } from './wealth/wealth.module';
import { SpiritualityModule } from './spirituality/spirituality.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    PrismaModule,
    AuthModule,
    EventsModule,
    EntitiesModule,
    MemoriesModule,
    DashboardModule,
    HealthModule,
    WealthModule,
    SpiritualityModule,
    AnalyticsModule,
  ],
})
export class AppModule {}