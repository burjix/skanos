import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface OnboardingData {
  currentStep: number;
  personalInfo?: {
    name: string;
    timezone: string;
    preferences: Record<string, any>;
  };
  healthGoals?: {
    sleepGoal: number;
    stepGoal: number;
    targetWeight?: number;
    waterGoal: number;
    workoutFrequency: string;
  };
  wealthGoals?: {
    targetNetWorth?: number;
    monthlySavingsGoal?: number;
    investmentStrategy: string;
    financialPriorities: string[];
  };
  spiritualityGoals?: {
    meditationGoal: number;
    practices: Array<{
      name: string;
      frequency: string;
      type: string;
    }>;
    spiritualFocus: string[];
  };
  dailyCheckupPreferences?: {
    enabled: boolean;
    time: string;
    includedPillars: string[];
    reminderStyle: string;
  };
  completed: boolean;
}

@Injectable()
export class OnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserOnboardingStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        onboardingCompleted: true,
        onboardingStep: true,
        onboardingData: true,
        healthGoals: true,
        wealthGoals: true,
        spiritualityGoals: true,
        dailyCheckupEnabled: true,
        dailyCheckupTime: true,
      },
    });

    return {
      completed: user?.onboardingCompleted || false,
      currentStep: user?.onboardingStep || 0,
      data: (user?.onboardingData as any) || {},
      goals: {
        health: user?.healthGoals || {},
        wealth: user?.wealthGoals || {},
        spirituality: user?.spiritualityGoals || {},
      },
      dailyCheckup: {
        enabled: user?.dailyCheckupEnabled || true,
        time: user?.dailyCheckupTime || '09:00',
      },
    };
  }

  async updateOnboardingStep(userId: string, step: number, stepData: any) {
    // Get current onboarding data
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { onboardingData: true },
    });

    const currentData = (currentUser?.onboardingData as any) || {};
    const updatedData = { ...currentData, ...stepData, currentStep: step };

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        onboardingStep: step,
        onboardingData: updatedData,
      },
    });
  }

  async completeOnboarding(userId: string, finalData: OnboardingData) {
    const { healthGoals, wealthGoals, spiritualityGoals, dailyCheckupPreferences } = finalData;

    // Create default pillars for the user
    await this.createDefaultPillars(userId);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: true,
        onboardingStep: 7, // Final step
        onboardingData: finalData as any,
        ...(healthGoals && { healthGoals }),
        ...(wealthGoals && { wealthGoals }),
        ...(spiritualityGoals && { spiritualityGoals }),
        ...(dailyCheckupPreferences && {
          dailyCheckupEnabled: dailyCheckupPreferences.enabled,
          dailyCheckupTime: dailyCheckupPreferences.time,
        }),
      },
    });
  }

  private async createDefaultPillars(userId: string) {
    const defaultPillars = [
      {
        name: 'Health',
        description: 'Physical wellness, fitness, nutrition, and medical care',
        color: '#22c55e',
        icon: 'heart',
        order: 1,
      },
      {
        name: 'Wealth',
        description: 'Financial health, investments, income, and spending',
        color: '#f59e0b',
        icon: 'dollar-sign',
        order: 2,
      },
      {
        name: 'Spirituality',
        description: 'Mental wellness, mindfulness, gratitude, and personal growth',
        color: '#8b5cf6',
        icon: 'sparkles',
        order: 3,
      },
      {
        name: 'Knowledge',
        description: 'Learning, skills development, and intellectual growth',
        color: '#3b82f6',
        icon: 'book',
        order: 4,
      },
    ];

    for (const pillar of defaultPillars) {
      await this.prisma.pillar.upsert({
        where: {
          userId_name: {
            userId,
            name: pillar.name,
          },
        },
        create: {
          ...pillar,
          userId,
        },
        update: {}, // Don't update if already exists
      });
    }
  }

  async skipOnboarding(userId: string) {
    // Create default pillars but mark onboarding as completed with minimal data
    await this.createDefaultPillars(userId);
    
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: true,
        onboardingStep: 7,
        onboardingData: { skipped: true },
      },
    });
  }

  async resetOnboarding(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: false,
        onboardingStep: 0,
        onboardingData: {},
        healthGoals: {},
        wealthGoals: {},
        spiritualityGoals: {},
      },
    });
  }
}