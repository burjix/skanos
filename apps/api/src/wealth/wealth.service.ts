import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subMonths, format, startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class WealthService {
  constructor(private readonly prisma: PrismaService) {}

  async getWealthMetrics(userId: string) {
    // Get user's wealth goals
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { 
        wealthGoals: true,
        onboardingCompleted: true 
      }
    });

    // Get wealth-related events from the database
    const wealthEvents = await this.prisma.event.findMany({
      where: {
        userId,
        type: { in: ['financial_transaction', 'investment', 'income', 'expense', 'net_worth_update'] },
        status: 'active',
        createdAt: {
          gte: subMonths(new Date(), 6)
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Process events to create monthly data
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), 5 - i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      // Find events for this month
      const monthEvents = wealthEvents.filter(event => {
        const eventDate = new Date(event.createdAt);
        return eventDate >= monthStart && eventDate <= monthEnd;
      });

      return {
        month: format(date, 'MMM'),
        netWorth: this.extractMetricFromEvents(monthEvents, 'net_worth', 0),
        income: this.extractMetricFromEvents(monthEvents, 'income', 0),
        expenses: this.extractMetricFromEvents(monthEvents, 'expenses', 0),
        investments: this.extractMetricFromEvents(monthEvents, 'investments', 0),
        date: format(date, 'yyyy-MM-dd')
      };
    });

    // Calculate metrics from real data
    const currentMonth = last6Months[last6Months.length - 1];
    const previousMonth = last6Months[last6Months.length - 2];
    
    let netWorthChange = 0;
    if (currentMonth.netWorth > 0 && previousMonth.netWorth > 0) {
      netWorthChange = ((currentMonth.netWorth - previousMonth.netWorth) / previousMonth.netWorth) * 100;
    }

    let savingsRate = 0;
    if (currentMonth.income > 0) {
      savingsRate = Math.floor(((currentMonth.income - currentMonth.expenses) / currentMonth.income) * 100);
    }

    // Get portfolio allocation from latest events
    const portfolioEvents = wealthEvents.filter(e => (e.data as any)?.portfolio_allocation);
    const latestPortfolio = portfolioEvents.length > 0 ? 
      (portfolioEvents[0].data as any).portfolio_allocation : [];

    const wealthGoals = (user?.wealthGoals as any) || {};

    return {
      monthlyData: last6Months,
      currentNetWorth: currentMonth.netWorth,
      monthlyIncome: currentMonth.income,
      monthlyExpenses: currentMonth.expenses,
      investmentValue: currentMonth.investments,
      savingsRate,
      netWorthChange: parseFloat(netWorthChange.toFixed(2)),
      portfolioAllocation: latestPortfolio.length > 0 ? latestPortfolio : [],
      targetNetWorth: wealthGoals.targetNetWorth || 0,
      monthlySavingsGoal: wealthGoals.monthlySavingsGoal || 0,
      hasData: wealthEvents.length > 0,
      isOnboarded: user?.onboardingCompleted || false,
      dataSource: 'events', // Data from user events
      lastSync: new Date().toISOString()
    };
  }

  private extractMetricFromEvents(events: any[], metricType: string, defaultValue: number): number {
    const relevantEvents = events.filter(e => (e.data as any)?.[metricType] !== undefined);
    if (relevantEvents.length === 0) return defaultValue;
    
    // For amounts, sum them up; for single values like net_worth, take the latest
    if (['income', 'expenses'].includes(metricType)) {
      return relevantEvents.reduce((sum, event) => sum + (event.data as any)[metricType], 0);
    } else {
      return (relevantEvents[0].data as any)[metricType];
    }
  }

  async createWealthEvent(userId: string, eventData: {
    type: 'financial_transaction' | 'investment' | 'income' | 'expense' | 'net_worth_update';
    data: Record<string, any>;
    title?: string;
  }) {
    return this.prisma.event.create({
      data: {
        userId,
        type: eventData.type,
        title: eventData.title || `Wealth ${eventData.type}`,
        data: eventData.data,
        source: 'web'
      }
    });
  }

  async updateWealthGoals(userId: string, goals: Record<string, any>) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        wealthGoals: goals
      }
    });
  }
}