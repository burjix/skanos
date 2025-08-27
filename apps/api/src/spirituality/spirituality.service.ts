import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subDays, format } from 'date-fns';

@Injectable()
export class SpiritualityService {
  constructor(private readonly prisma: PrismaService) {}

  async getSpiritualityMetrics(userId: string) {
    // For now, return sample data
    // In the future, this would integrate with meditation apps and track user's spiritual practices
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return {
        name: format(date, 'EEE'),
        meditation: Math.floor(Math.random() * 45) + 15, // 15-60 minutes
        gratitude: Math.random() > 0.2 ? 1 : 0, // 80% chance
        journaling: Math.random() > 0.4 ? Math.floor(Math.random() * 20) + 10 : 0, // 10-30 min or 0
        mindfulness: Math.floor(Math.random() * 8) + 3, // 3-10 rating
        date: format(date, 'yyyy-MM-dd')
      };
    });

    return {
      weeklyData: last7Days,
      todayMeditation: 25,
      meditationGoal: 30,
      currentStreak: 12,
      longestStreak: 45,
      totalSessions: 156,
      averageSession: 22,
      mindfulnessScore: 7.8,
      gratitudeEntries: 18,
      journalEntries: 12,
      // Spiritual practices
      practices: [
        { name: 'Meditation', frequency: 'Daily', lastDone: 'Today', streak: 12 },
        { name: 'Gratitude Journal', frequency: 'Daily', lastDone: 'Today', streak: 8 },
        { name: 'Prayer', frequency: 'Morning', lastDone: 'Today', streak: 5 },
        { name: 'Reading', frequency: 'Weekly', lastDone: '2 days ago', streak: 3 }
      ],
      // Mood tracking
      moodData: [
        { day: 'Mon', mood: 7, energy: 6 },
        { day: 'Tue', mood: 8, energy: 7 },
        { day: 'Wed', mood: 6, energy: 5 },
        { day: 'Thu', mood: 9, energy: 8 },
        { day: 'Fri', mood: 8, energy: 7 },
        { day: 'Sat', mood: 9, energy: 8 },
        { day: 'Sun', mood: 8, energy: 8 }
      ],
      // Add integration point for real spirituality data
      dataSource: 'sample', // Will change to 'headspace', 'calm', 'insight_timer', etc.
      lastSync: new Date().toISOString()
    };
  }
}