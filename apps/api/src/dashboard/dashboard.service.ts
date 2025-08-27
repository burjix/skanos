import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { DashboardData } from '@skanos/shared';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData(userId: string): Promise<DashboardData> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayEvents, quickStats, recentInsights, pillars] = await Promise.all([
      // Today's events
      this.prisma.event.findMany({
        where: {
          userId,
          status: 'active',
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          type: true,
          title: true,
          description: true,
          createdAt: true,
        },
      }),

      // Quick stats
      Promise.all([
        this.prisma.event.count({ where: { userId, status: 'active' } }),
        this.prisma.entity.count({ where: { userId } }),
        this.prisma.memory.count({ where: { userId } }),
        this.prisma.insight.count({ where: { userId } }),
      ]).then(([totalEvents, entitiesCount, memoriesCount, insightsCount]) => ({
        totalEvents,
        entitiesCount,
        memoriesCount,
        insightsCount,
      })),

      // Recent insights
      this.prisma.insight.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          content: true,
          confidence: true,
          createdAt: true,
        },
      }),

      // User pillars
      this.prisma.pillar.findMany({
        where: { userId, isActive: true },
        orderBy: { order: 'asc' },
        select: {
          id: true,
          name: true,
          color: true,
          icon: true,
        },
      }),
    ]);

    return {
      todayEvents: todayEvents.map(event => ({
        ...event,
        description: event.description || undefined,
        createdAt: event.createdAt.toISOString(),
      })),
      quickStats,
      recentInsights: recentInsights.map(insight => ({
        ...insight,
        createdAt: insight.createdAt.toISOString(),
      })),
      pillars: pillars.map(pillar => ({
        ...pillar,
        icon: pillar.icon || undefined,
      })),
    };
  }

  async getQuickCapture(userId: string) {
    return this.prisma.quickNote.findMany({
      where: {
        userId,
        processed: false,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async createQuickCapture(userId: string, content: string) {
    const quickNote = await this.prisma.quickNote.create({
      data: {
        content,
        userId,
      },
    });

    // Create an event for this capture
    await this.prisma.event.create({
      data: {
        type: 'quick_capture',
        title: 'Quick Capture',
        description: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
        data: { originalContent: content },
        source: 'web',
        userId,
      },
    });

    return quickNote;
  }
}