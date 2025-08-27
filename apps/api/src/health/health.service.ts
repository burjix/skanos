import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subDays, format } from 'date-fns';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealthMetrics(userId: string) {
    // Get user's health goals
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { 
        healthGoals: true,
        onboardingCompleted: true 
      }
    });

    // Get health-related events from the database
    const healthEvents = await this.prisma.event.findMany({
      where: {
        userId,
        type: { in: ['health_metric', 'workout', 'sleep', 'nutrition'] },
        status: 'active',
        createdAt: {
          gte: subDays(new Date(), 7)
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Process events to create weekly data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Find events for this day
      const dayEvents = healthEvents.filter(event => 
        format(new Date(event.createdAt), 'yyyy-MM-dd') === dateStr
      );

      return {
        name: format(date, 'EEE'),
        sleep: this.extractMetricFromEvents(dayEvents, 'sleep', 0),
        steps: this.extractMetricFromEvents(dayEvents, 'steps', 0),
        energy: this.extractMetricFromEvents(dayEvents, 'energy', 0),
        workout: this.extractMetricFromEvents(dayEvents, 'workout_duration', 0),
        date: dateStr
      };
    });

    // Get today's data
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayEvents = healthEvents.filter(event => 
      format(new Date(event.createdAt), 'yyyy-MM-dd') === today
    );

    const healthGoals = (user?.healthGoals as any) || {};
    
    return {
      weeklyData: last7Days,
      todaySleep: this.extractMetricFromEvents(todayEvents, 'sleep', 0),
      sleepGoal: healthGoals.sleepGoal || 8,
      todaySteps: this.extractMetricFromEvents(todayEvents, 'steps', 0),
      stepGoal: healthGoals.stepGoal || 10000,
      currentWeight: this.extractMetricFromEvents(todayEvents, 'weight', 0),
      targetWeight: healthGoals.targetWeight || 0,
      workoutStreak: await this.calculateWorkoutStreak(userId),
      energyLevel: this.extractMetricFromEvents(todayEvents, 'energy', 0),
      heartRate: this.extractMetricFromEvents(todayEvents, 'heart_rate', 0),
      bodyFat: this.extractMetricFromEvents(todayEvents, 'body_fat', 0),
      waterIntake: this.extractMetricFromEvents(todayEvents, 'water_intake', 0),
      waterGoal: healthGoals.waterGoal || 3.0,
      hasData: healthEvents.length > 0,
      isOnboarded: user?.onboardingCompleted || false,
      dataSource: 'events', // Data from user events
      lastSync: new Date().toISOString()
    };
  }

  private extractMetricFromEvents(events: any[], metricType: string, defaultValue: number): number {
    const event = events.find(e => (e.data as any)?.[metricType] !== undefined);
    return event ? (event.data as any)[metricType] : defaultValue;
  }

  private async calculateWorkoutStreak(userId: string): Promise<number> {
    const workoutEvents = await this.prisma.event.findMany({
      where: {
        userId,
        type: 'workout',
        status: 'active'
      },
      orderBy: { createdAt: 'desc' },
      take: 30 // Check last 30 days
    });

    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = subDays(today, i);
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      
      const hasWorkout = workoutEvents.some(event =>
        format(new Date(event.createdAt), 'yyyy-MM-dd') === dateStr
      );
      
      if (hasWorkout) {
        streak++;
      } else if (i === 0) {
        // If no workout today, streak is 0
        break;
      } else {
        // If no workout on a previous day, stop counting
        break;
      }
    }

    return streak;
  }

  async createHealthEvent(userId: string, eventData: {
    type: 'sleep' | 'workout' | 'nutrition' | 'health_metric';
    data: Record<string, any>;
    title?: string;
  }) {
    return this.prisma.event.create({
      data: {
        userId,
        type: eventData.type,
        title: eventData.title || `Health ${eventData.type}`,
        data: eventData.data,
        source: 'web'
      }
    });
  }

  async updateHealthGoals(userId: string, goals: Record<string, any>) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        healthGoals: goals
      }
    });
  }
}