import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subMonths, format } from 'date-fns';

@Injectable()
export class WealthService {
  constructor(private readonly prisma: PrismaService) {}

  async getWealthMetrics(userId: string) {
    // For now, return sample data
    // In the future, this would integrate with financial APIs like Plaid, Yodlee, etc.
    
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), 5 - i);
      const baseNetWorth = 45000 + i * 2000 + Math.random() * 3000;
      return {
        month: format(date, 'MMM'),
        netWorth: Math.floor(baseNetWorth),
        income: Math.floor(4000 + Math.random() * 1000),
        expenses: Math.floor(2500 + Math.random() * 800),
        investments: Math.floor(20000 + i * 1500 + Math.random() * 2000),
        date: format(date, 'yyyy-MM-dd')
      };
    });

    const currentMonth = last6Months[last6Months.length - 1];
    const previousMonth = last6Months[last6Months.length - 2];
    const netWorthChange = ((currentMonth.netWorth - previousMonth.netWorth) / previousMonth.netWorth) * 100;

    return {
      monthlyData: last6Months,
      currentNetWorth: currentMonth.netWorth,
      monthlyIncome: currentMonth.income,
      monthlyExpenses: currentMonth.expenses,
      investmentValue: currentMonth.investments,
      savingsRate: Math.floor(((currentMonth.income - currentMonth.expenses) / currentMonth.income) * 100),
      netWorthChange: parseFloat(netWorthChange.toFixed(2)),
      // Portfolio allocation (sample data)
      portfolioAllocation: [
        { name: 'Stocks', value: 45, color: '#22c55e' },
        { name: 'Bonds', value: 25, color: '#3b82f6' },
        { name: 'Real Estate', value: 20, color: '#f59e0b' },
        { name: 'Cash', value: 10, color: '#6b7280' }
      ],
      // Add integration point for real financial data
      dataSource: 'sample', // Will change to 'plaid', 'yodlee', etc.
      lastSync: new Date().toISOString()
    };
  }
}