import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subDays, format } from 'date-fns';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealthMetrics(userId: string) {
    // For now, return sample data
    // In the future, this would integrate with health tracking APIs
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return {
        name: format(date, 'EEE'),
        sleep: Math.floor(Math.random() * 3) + 6, // 6-9 hours
        steps: Math.floor(Math.random() * 5000) + 5000, // 5k-10k steps
        energy: Math.floor(Math.random() * 4) + 6, // 6-10 energy level
        workout: Math.random() > 0.3 ? Math.floor(Math.random() * 60) + 30 : 0, // 30-90 min or 0
        date: format(date, 'yyyy-MM-dd')
      };
    });

    return {
      weeklyData: last7Days,
      todaySleep: 7.5,
      sleepGoal: 8,
      todaySteps: 8432,
      stepGoal: 10000,
      currentWeight: 75.2,
      targetWeight: 73,
      workoutStreak: 5,
      energyLevel: 8,
      heartRate: 68,
      bodyFat: 12.3,
      waterIntake: 2.1,
      waterGoal: 3.0,
      // Add integration point for real health data
      dataSource: 'sample', // Will change to 'fitbit', 'apple_health', etc.
      lastSync: new Date().toISOString()
    };
  }
}