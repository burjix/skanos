import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Processor('events')
export class EventProcessor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  @Process('process-event')
  async processEvent(job: Job<{ eventId: string; userId: string }>) {
    const { eventId, userId } = job.data;

    try {
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
      });

      if (!event) return;

      // Here you would integrate with OpenAI for:
      // 1. Entity extraction from event content
      // 2. Sentiment analysis
      // 3. Pattern recognition
      // 4. Insight generation

      console.log(`Processing event ${eventId} for user ${userId}`);

      // For now, just mark as processed
      await this.prisma.event.update({
        where: { id: eventId },
        data: {
          data: {
            ...(event.data as Record<string, any>),
            processed: true,
            processedAt: new Date().toISOString(),
          },
        },
      });

    } catch (error) {
      console.error(`Error processing event ${eventId}:`, error);
      throw error;
    }
  }
}