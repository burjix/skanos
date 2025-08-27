import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subDays, format } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAnalytics(userId: string, params?: { period?: string; pillar?: string }) {
    const period = params?.period || '7d';
    const pillar = params?.pillar;

    // For now, return sample activity data
    // In the future, this would analyze real events and generate insights
    
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 7;
    
    const activityData = Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - 1 - i);
      return {
        name: days <= 7 ? format(date, 'EEE') : format(date, 'MMM d'),
        value: Math.floor(Math.random() * 100) + 50,
        date: format(date, 'yyyy-MM-dd')
      };
    });

    // Activity by pillar
    const pillarActivity = {
      health: Math.floor(Math.random() * 50) + 30,
      wealth: Math.floor(Math.random() * 50) + 25,
      spirituality: Math.floor(Math.random() * 50) + 20,
      knowledge: Math.floor(Math.random() * 50) + 35,
    };

    return {
      activityData: pillar ? activityData.filter(() => Math.random() > 0.3) : activityData,
      pillarActivity,
      totalEvents: Object.values(pillarActivity).reduce((a, b) => a + b, 0),
      averageDaily: Math.floor(activityData.reduce((sum, day) => sum + day.value, 0) / activityData.length),
      trends: {
        weekly: '+12%',
        monthly: '+8%',
        direction: 'up'
      },
      lastUpdated: new Date().toISOString()
    };
  }
}