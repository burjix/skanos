import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateEventRequest } from '@skanos/shared';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('events') private eventsQueue: Queue,
  ) {}

  async createEvent(userId: string, eventData: CreateEventRequest) {
    const event = await this.prisma.event.create({
      data: {
        ...eventData,
        userId,
      },
    });

    // Queue event for processing (AI analysis, entity extraction, etc.)
    await this.eventsQueue.add('process-event', {
      eventId: event.id,
      userId,
    });

    return event;
  }

  async getEvents(userId: string, filters?: {
    type?: string;
    limit?: number;
    page?: number;
  }) {
    const { type, limit = 50, page = 1 } = filters || {};
    
    const where = {
      userId,
      status: 'active',
      ...(type && { type }),
    };

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
        include: {
          entityEvents: {
            include: {
              entity: true,
            },
          },
        },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data: events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getTodayEvents(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.prisma.event.findMany({
      where: {
        userId,
        status: 'active',
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async getEvent(userId: string, eventId: string) {
    return this.prisma.event.findFirst({
      where: {
        id: eventId,
        userId,
      },
      include: {
        entityEvents: {
          include: {
            entity: true,
          },
        },
        insights: true,
      },
    });
  }

  async updateEvent(userId: string, eventId: string, updates: Partial<CreateEventRequest>) {
    return this.prisma.event.updateMany({
      where: {
        id: eventId,
        userId,
      },
      data: updates,
    });
  }

  async deleteEvent(userId: string, eventId: string) {
    return this.prisma.event.updateMany({
      where: {
        id: eventId,
        userId,
      },
      data: {
        status: 'deleted',
      },
    });
  }
}