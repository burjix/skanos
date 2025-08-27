'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, subMonths } from 'date-fns'
import { 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar
} from 'recharts'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  PiggyBank,
  CreditCard,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Wallet,
  Shield,
  LineChart
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProgressRing } from '@/components/charts/progress-ring'
import { MetricCard } from '@/components/charts/metric-card'
import { LoadingSkeleton } from '@/components/ui/loading-skeleton'
import { useWealthMetrics } from '@/lib/hooks/api-hooks'

// Mock financial data
const generateWealthData = () => {
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i)
    const baseNetWorth = 45000 + i * 2000 + Math.random() * 3000
    return {
      month: format(date, 'MMM'),
      netWorth: Math.floor(baseNetWorth),
      income: Math.floor(Math.random() * 2000) + 4000,
      expenses: Math.floor(Math.random() * 1500) + 2500,
      investments: Math.floor(Math.random() * 1000) + 500,
      date: format(date, 'yyyy-MM')
    }
  })

  const expenseCategories = [
    { name: 'Housing', value: 1500, color: '#ef4444' },
    { name: 'Food', value: 800, color: '#f97316' },
    { name: 'Transport', value: 400, color: '#eab308' },
    { name: 'Utilities', value: 250, color: '#22c55e' },
    { name: 'Entertainment', value: 300, color: '#3b82f6' },
    { name: 'Healthcare', value: 200, color: '#8b5cf6' },
    { name: 'Other', value: 150, color: '#6b7280' }
  ]

  return {
    monthlyData: last6Months,
    expenseCategories,
    netWorth: 52340,
    monthlyChange: 2.8,
    totalIncome: 6500,
    totalExpenses: 3600,
    savingsRate: 44.6,
    emergencyFund: 15000,
    emergencyGoal: 18000,
    investmentGoal: 100000,
    currentInvestments: 28500,
    debtTotal: 8200,
    creditScore: 785,
    portfolioGrowth: 12.4
  }
}

const goals = [
  {
    name: 'Emergency Fund',
    current: 15000,
    target: 18000,
    deadline: '2024-12-31',
    color: '#10b981'
  },
  {
    name: 'Investment Portfolio',
    current: 28500,
    target: 100000,
    deadline: '2026-12-31',
    color: '#3b82f6'
  },
  {
    name: 'Debt Payoff',
    current: 8200,
    target: 0,
    deadline: '2025-06-30',
    color: '#ef4444',
    inverse: true // Lower is better
  }
]

export function WealthDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview')
  
  // Fetch real wealth metrics from API
  const { data: wealthMetrics, isLoading, error } = useWealthMetrics()
  
  // Use real data if available, otherwise fallback to mock data
  const wealthData = wealthMetrics || generateWealthData()

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <LoadingSkeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <LoadingSkeleton className="h-64" />
            <LoadingSkeleton className="h-64" />
          </div>
          <div className="space-y-6">
            <LoadingSkeleton className="h-48" />
            <LoadingSkeleton className="h-48" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="glass border-white/10 border-yellow-500/20">
          <CardContent className="p-6 text-center">
            <DollarSign className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
            <h3 className="text-xl font-semibold mb-2">Financial data temporarily unavailable</h3>
            <p className="text-muted-foreground">Using sample data for demonstration. Connect your financial accounts to see real metrics.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-600/10 border border-green-500/20">
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Wealth Dashboard</h1>
            <p className="text-muted-foreground">Track your financial growth and goals</p>
          </div>
        </div>
        <Button className="bg-green-500 hover:bg-green-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <MetricCard
          title="Net Worth"
          value={`$${wealthData.netWorth.toLocaleString()}`}
          subtitle="Total assets - liabilities"
          icon={Wallet}
          trend={{ 
            value: `${wealthData.monthlyChange}%`, 
            direction: wealthData.monthlyChange >= 0 ? "up" : "down" 
          }}
        />
        
        <MetricCard
          title="Monthly Income"
          value={`$${wealthData.totalIncome.toLocaleString()}`}
          subtitle="This month"
          icon={TrendingUp}
          trend={{ value: "+$200", direction: "up" }}
        />
        
        <MetricCard
          title="Monthly Expenses"
          value={`$${wealthData.totalExpenses.toLocaleString()}`}
          subtitle="This month"
          icon={CreditCard}
          trend={{ value: "-$150", direction: "up" }}
        />
        
        <MetricCard
          title="Savings Rate"
          value={`${wealthData.savingsRate.toFixed(1)}%`}
          subtitle="Income - Expenses"
          icon={PiggyBank}
          trend={{ value: "+2.1%", direction: "up" }}
        />
      </motion.div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="glass border-white/10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Net Worth Trend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="glass border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="h-5 w-5" />
                      Net Worth Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={wealthData.monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                          />
                          <Tooltip
                            contentStyle={{
                              background: 'rgba(0, 0, 0, 0.9)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '8px',
                              color: 'white'
                            }}
                            formatter={(value) => [`$${value.toLocaleString()}`, 'Net Worth']}
                          />
                          <Area
                            type="monotone"
                            dataKey="netWorth"
                            stroke="#10b981"
                            fillOpacity={0.3}
                            fill="url(#colorGradient)"
                          />
                          <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Income vs Expenses */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="glass border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart className="h-5 w-5" />
                      Income vs Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={wealthData.monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                          />
                          <Tooltip
                            contentStyle={{
                              background: 'rgba(0, 0, 0, 0.9)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '8px',
                              color: 'white'
                            }}
                          />
                          <Bar dataKey="income" fill="#10b981" name="Income" />
                          <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Progress Rings */}
              <div className="space-y-6">
                <ProgressRing
                  title="Emergency Fund"
                  value={wealthData.emergencyFund}
                  maxValue={wealthData.emergencyGoal}
                  color="#10b981"
                  unit=""
                  subtitle="$15k of $18k"
                />

                <ProgressRing
                  title="Investment Goal"
                  value={wealthData.currentInvestments}
                  maxValue={wealthData.investmentGoal}
                  color="#3b82f6"
                  unit=""
                  subtitle="$28.5k of $100k"
                />
              </div>

              {/* Financial Health Score */}
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Financial Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Credit Score</span>
                    <span className="font-medium">{wealthData.creditScore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Portfolio Growth</span>
                    <span className="font-medium text-green-400">+{wealthData.portfolioGrowth}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Debt</span>
                    <span className="font-medium text-red-400">${wealthData.debtTotal.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Expense Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Monthly Expenses Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={wealthData.expenseCategories}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {wealthData.expenseCategories.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: 'rgba(0, 0, 0, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                          formatter={(value) => [`$${value}`, 'Amount']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-4">
                    {wealthData.expenseCategories.map((category: any) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <span className="text-sm font-mono">${category.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {goals.map((goal: any) => (
              <motion.div
                key={goal.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="glass border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">{goal.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Due: {format(new Date(goal.deadline), 'MMM d, yyyy')}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {goal.inverse 
                            ? `$${goal.current.toLocaleString()} remaining`
                            : `$${goal.current.toLocaleString()} / $${goal.target.toLocaleString()}`
                          }
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: goal.inverse 
                              ? `${Math.max(0, 100 - (goal.current / goal.target) * 100)}%`
                              : `${Math.min(100, (goal.current / goal.target) * 100)}%`,
                            backgroundColor: goal.color
                          }}
                        />
                      </div>
                      
                      <div className="text-center">
                        <span className="text-2xl font-bold">
                          {goal.inverse
                            ? `${Math.max(0, 100 - Math.round((goal.current / goal.target) * 100))}%`
                            : `${Math.min(100, Math.round((goal.current / goal.target) * 100))}%`
                          }
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {goal.inverse ? 'Paid off' : 'Complete'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {['income', 'expenses', 'investments'].map((tab: any) => (
          <TabsContent key={tab} value={tab}>
            <Card className="glass border-white/10">
              <CardContent className="p-8 text-center">
                <Briefcase className="h-16 w-16 mx-auto mb-4 text-green-400" />
                <h3 className="text-xl font-semibold mb-2 capitalize">{tab} Tracking</h3>
                <p className="text-muted-foreground">Detailed {tab} analytics coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}