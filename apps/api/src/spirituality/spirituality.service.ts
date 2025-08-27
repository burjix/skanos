import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subDays, format } from 'date-fns';

@Injectable()
export class SpiritualityService {
  constructor(private readonly prisma: PrismaService) {}

  async getSpiritualityMetrics(userId: string) {
    // Get user's spirituality goals
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { 
        spiritualityGoals: true,
        onboardingCompleted: true 
      }
    });

    // Get spirituality-related events from the database
    const spiritualityEvents = await this.prisma.event.findMany({
      where: {
        userId,
        type: { in: ['meditation', 'gratitude', 'journaling', 'prayer', 'mindfulness', 'mood_check'] },
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
      const dayEvents = spiritualityEvents.filter(event => 
        format(new Date(event.createdAt), 'yyyy-MM-dd') === dateStr
      );

      return {
        name: format(date, 'EEE'),
        meditation: this.extractMetricFromEvents(dayEvents, 'duration', 0, 'meditation'),
        gratitude: this.extractMetricFromEvents(dayEvents, 'entries', 0, 'gratitude'),
        journaling: this.extractMetricFromEvents(dayEvents, 'duration', 0, 'journaling'),
        mindfulness: this.extractMetricFromEvents(dayEvents, 'score', 0, 'mindfulness'),
        date: dateStr
      };
    });

    // Get today's data
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayEvents = spiritualityEvents.filter(event => 
      format(new Date(event.createdAt), 'yyyy-MM-dd') === today
    );

    // Calculate streaks and totals
    const meditationStreak = await this.calculatePracticeStreak(userId, 'meditation');
    const allMeditationEvents = await this.prisma.event.findMany({
      where: {
        userId,
        type: 'meditation',
        status: 'active'
      }
    });

    // Get spiritual practices from user's data
    const spiritualityGoals = (user?.spiritualityGoals as any) || {};
    const practices = spiritualityGoals.practices || [];

    // Calculate mood data
    const moodEvents = spiritualityEvents.filter(e => e.type === 'mood_check');
    const moodData = last7Days.map(day => {
      const dayMoodEvents = moodEvents.filter(event => 
        format(new Date(event.createdAt), 'yyyy-MM-dd') === day.date
      );
      
      return {
        day: day.name,
        mood: dayMoodEvents.length > 0 ? (dayMoodEvents[0].data as any)?.mood || 0 : 0,
        energy: dayMoodEvents.length > 0 ? (dayMoodEvents[0].data as any)?.energy || 0 : 0
      };
    });

    const totalSessions = allMeditationEvents.length;
    const totalMinutes = allMeditationEvents.reduce((sum, event) => 
      sum + ((event.data as any)?.duration || 0), 0
    );

    return {
      weeklyData: last7Days,
      todayMeditation: this.extractMetricFromEvents(todayEvents, 'duration', 0, 'meditation'),
      meditationGoal: spiritualityGoals.meditationGoal || 30,
      currentStreak: meditationStreak,
      longestStreak: await this.calculateLongestStreak(userId, 'meditation'),
      totalSessions,
      averageSession: totalSessions > 0 ? Math.floor(totalMinutes / totalSessions) : 0,
      mindfulnessScore: this.calculateAverageMindfulness(spiritualityEvents),
      gratitudeEntries: spiritualityEvents.filter(e => e.type === 'gratitude').length,
      journalEntries: spiritualityEvents.filter(e => e.type === 'journaling').length,
      practices: practices.map((practice: any) => ({
        ...practice,
        lastDone: this.getLastPracticeDate(spiritualityEvents, practice.type),
        streak: this.calculatePracticeStreakSync(spiritualityEvents, practice.type)
      })),
      moodData,
      hasData: spiritualityEvents.length > 0,
      isOnboarded: user?.onboardingCompleted || false,
      dataSource: 'events', // Data from user events
      lastSync: new Date().toISOString()
    };
  }

  private extractMetricFromEvents(events: any[], metricKey: string, defaultValue: number, eventType?: string): number {
    const filteredEvents = eventType ? events.filter(e => e.type === eventType) : events;
    const event = filteredEvents.find(e => (e.data as any)?.[metricKey] !== undefined);
    return event ? (event.data as any)[metricKey] : defaultValue;
  }

  private async calculatePracticeStreak(userId: string, practiceType: string): Promise<number> {
    const events = await this.prisma.event.findMany({
      where: {
        userId,
        type: practiceType,
        status: 'active'
      },
      orderBy: { createdAt: 'desc' },
      take: 30
    });

    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = subDays(today, i);
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      
      const hasPractice = events.some(event =>
        format(new Date(event.createdAt), 'yyyy-MM-dd') === dateStr
      );
      
      if (hasPractice) {
        streak++;
      } else if (i === 0) {
        break;
      } else {
        break;
      }
    }

    return streak;
  }

  private async calculateLongestStreak(userId: string, practiceType: string): Promise<number> {
    const events = await this.prisma.event.findMany({
      where: {
        userId,
        type: practiceType,
        status: 'active'
      },
      orderBy: { createdAt: 'asc' }
    });

    let longestStreak = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;

    for (const event of events) {
      const eventDate = new Date(event.createdAt);
      eventDate.setHours(0, 0, 0, 0);

      if (lastDate) {
        const dayDiff = Math.floor((eventDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          currentStreak++;
        } else if (dayDiff > 1) {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      
      lastDate = eventDate;
    }

    return Math.max(longestStreak, currentStreak);
  }

  private calculateAverageMindfulness(events: any[]): number {
    const mindfulnessEvents = events.filter(e => 
      e.type === 'mindfulness' && (e.data as any)?.score !== undefined
    );
    
    if (mindfulnessEvents.length === 0) return 0;
    
    const total = mindfulnessEvents.reduce((sum, event) => 
      sum + (event.data as any).score, 0
    );
    
    return parseFloat((total / mindfulnessEvents.length).toFixed(1));
  }

  private getLastPracticeDate(events: any[], practiceType: string): string {
    const practiceEvents = events.filter(e => e.type === practiceType);
    if (practiceEvents.length === 0) return 'Never';
    
    const latestEvent = practiceEvents[0];
    const eventDate = new Date(latestEvent.createdAt);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  }

  private calculatePracticeStreakSync(events: any[], practiceType: string): number {
    const practiceEvents = events.filter(e => e.type === practiceType);
    // Simple streak calculation - could be enhanced
    return practiceEvents.length > 0 ? Math.min(practiceEvents.length, 30) : 0;
  }

  async createSpiritualityEvent(userId: string, eventData: {
    type: 'meditation' | 'gratitude' | 'journaling' | 'prayer' | 'mindfulness' | 'mood_check';
    data: Record<string, any>;
    title?: string;
  }) {
    return this.prisma.event.create({
      data: {
        userId,
        type: eventData.type,
        title: eventData.title || `Spirituality ${eventData.type}`,
        data: eventData.data,
        source: 'web'
      }
    });
  }

  async updateSpiritualityGoals(userId: string, goals: Record<string, any>) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        spiritualityGoals: goals
      }
    });
  }
}