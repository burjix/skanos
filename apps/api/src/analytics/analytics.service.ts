import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subDays, format } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAnalytics(userId: string, params?: { period?: string; pillar?: string }) {
    const period = params?.period || '7d';
    const pillar = params?.pillar;
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 7;

    // Get user's events for the specified period
    const events = await this.prisma.event.findMany({
      where: {
        userId,
        status: 'active',
        createdAt: {
          gte: subDays(new Date(), days)
        },
        ...(pillar && {
          type: {
            in: this.getPillarEventTypes(pillar)
          }
        })
      },
      orderBy: { createdAt: 'desc' }
    });

    // Process events to create activity data
    const activityData = Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - 1 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Count events for this day
      const dayEvents = events.filter(event => 
        format(new Date(event.createdAt), 'yyyy-MM-dd') === dateStr
      );

      return {
        name: days <= 7 ? format(date, 'EEE') : format(date, 'MMM d'),
        value: dayEvents.length,
        date: dateStr
      };
    });

    // Calculate activity by pillar
    const pillarActivity = {
      health: this.countEventsByPillar(events, 'health'),
      wealth: this.countEventsByPillar(events, 'wealth'),
      spirituality: this.countEventsByPillar(events, 'spirituality'),
      knowledge: this.countEventsByPillar(events, 'knowledge'),
    };

    // Calculate trends
    const currentPeriodEvents = events.length;
    const previousPeriodEvents = await this.getPreviousPeriodEventCount(userId, days, pillar);
    
    let weeklyTrend = '0%';
    let monthlyTrend = '0%';
    let trendDirection: 'up' | 'down' | 'neutral' = 'neutral';

    if (previousPeriodEvents > 0) {
      const changePercent = ((currentPeriodEvents - previousPeriodEvents) / previousPeriodEvents) * 100;
      const trendText = `${changePercent >= 0 ? '+' : ''}${Math.round(changePercent)}%`;
      
      if (period === '7d') {
        weeklyTrend = trendText;
      } else {
        monthlyTrend = trendText;
      }
      
      trendDirection = changePercent > 5 ? 'up' : changePercent < -5 ? 'down' : 'neutral';
    }

    const totalEvents = Object.values(pillarActivity).reduce((a, b) => a + b, 0);
    const averageDaily = activityData.length > 0 ? 
      Math.floor(activityData.reduce((sum, day) => sum + day.value, 0) / activityData.length) : 0;

    return {
      activityData,
      pillarActivity,
      totalEvents,
      averageDaily,
      trends: {
        weekly: weeklyTrend,
        monthly: monthlyTrend,
        direction: trendDirection
      },
      hasData: events.length > 0,
      lastUpdated: new Date().toISOString()
    };
  }

  private getPillarEventTypes(pillar: string): string[] {
    const pillarEventTypes: Record<string, string[]> = {
      health: ['health_metric', 'workout', 'sleep', 'nutrition'],
      wealth: ['financial_transaction', 'investment', 'income', 'expense', 'net_worth_update'],
      spirituality: ['meditation', 'gratitude', 'journaling', 'prayer', 'mindfulness', 'mood_check'],
      knowledge: ['learning', 'reading', 'course', 'skill_practice']
    };
    
    return pillarEventTypes[pillar] || [];
  }

  private countEventsByPillar(events: any[], pillar: string): number {
    const pillarTypes = this.getPillarEventTypes(pillar);
    return events.filter(event => pillarTypes.includes(event.type)).length;
  }

  private async getPreviousPeriodEventCount(userId: string, days: number, pillar?: string): Promise<number> {
    const startDate = subDays(new Date(), days * 2);
    const endDate = subDays(new Date(), days);

    const previousEvents = await this.prisma.event.count({
      where: {
        userId,
        status: 'active',
        createdAt: {
          gte: startDate,
          lt: endDate
        },
        ...(pillar && {
          type: {
            in: this.getPillarEventTypes(pillar)
          }
        })
      }
    });

    return previousEvents;
  }
}