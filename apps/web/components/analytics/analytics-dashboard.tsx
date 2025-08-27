'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { format, subDays, subMonths } from 'date-fns'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  PieChart, 
  Pie, 
  Cell,
  ComposedChart,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  RadialBarChart,
  RadialBar
} from 'recharts'
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Zap,
  Target,
  Activity,
  Clock,
  Award,
  Eye,
  Settings,
  Share
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MetricCard } from '@/components/charts/metric-card'

// Mock analytics data
const generateAnalyticsData = () => {
  // Monthly data for the past year
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), 11 - i)
    return {
      month: format(date, 'MMM'),
      health: Math.floor(Math.random() * 20) + 70,
      wealth: Math.floor(Math.random() * 20) + 65,
      spirituality: Math.floor(Math.random() * 20) + 60,
      productivity: Math.floor(Math.random() * 20) + 75,
      mood: Math.floor(Math.random() * 20) + 70,
      energy: Math.floor(Math.random() * 20) + 65,
      date: format(date, 'yyyy-MM')
    }
  })

  // Daily data for the past month
  const dailyData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i)
    return {
      day: format(date, 'd'),
      date: format(date, 'MMM d'),
      focusTime: Math.floor(Math.random() * 120) + 180, // 3-8 hours
      tasksCompleted: Math.floor(Math.random() * 10) + 5,
      exerciseMinutes: Math.random() > 0.3 ? Math.floor(Math.random() * 60) + 30 : 0,
      meditationMinutes: Math.random() > 0.2 ? Math.floor(Math.random() * 30) + 10 : 0,
      sleepHours: Math.random() * 3 + 6, // 6-9 hours
      mood: Math.floor(Math.random() * 4) + 6 // 6-10
    }
  })

  // Correlation data
  const correlationData = [
    { x: 7.5, y: 8.2, name: 'Sleep vs Mood' },
    { x: 45, y: 7.8, name: 'Exercise vs Energy' },
    { x: 25, y: 8.5, name: 'Meditation vs Focus' },
    { x: 6.2, y: 6.8, name: 'Screen Time vs Sleep' },
    { x: 8.1, y: 8.9, name: 'Mood vs Productivity' }
  ]

  // Time distribution
  const timeDistribution = [
    { name: 'Deep Work', value: 28, color: '#3b82f6' },
    { name: 'Meetings', value: 18, color: '#ef4444' },
    { name: 'Learning', value: 15, color: '#10b981' },
    { name: 'Exercise', value: 8, color: '#f59e0b' },
    { name: 'Meditation', value: 5, color: '#8b5cf6' },
    { name: 'Leisure', value: 12, color: '#6b7280' },
    { name: 'Sleep', value: 14, color: '#1f2937' }
  ]

  // Goal achievement over time
  const goalProgress = [
    { month: 'Jan', health: 85, wealth: 72, spirituality: 68, knowledge: 78 },
    { month: 'Feb', health: 88, wealth: 75, spirituality: 71, knowledge: 82 },
    { month: 'Mar', health: 82, wealth: 78, spirituality: 73, knowledge: 85 },
    { month: 'Apr', health: 90, wealth: 81, spirituality: 76, knowledge: 88 },
    { month: 'May', health: 87, wealth: 83, spirituality: 78, knowledge: 90 },
    { month: 'Jun', health: 92, wealth: 86, spirituality: 82, knowledge: 92 }
  ]

  // Performance metrics
  const performanceMetrics = [
    { name: 'Consistency', score: 85, color: '#10b981' },
    { name: 'Growth Rate', score: 78, color: '#3b82f6' },
    { name: 'Efficiency', score: 82, color: '#f59e0b' },
    { name: 'Balance', score: 74, color: '#8b5cf6' }
  ]

  return {
    monthlyData,
    dailyData,
    correlationData,
    timeDistribution,
    goalProgress,
    performanceMetrics,
    totalDataPoints: 15847,
    analysisTime: '2.3s',
    lastUpdate: new Date(),
    uptime: '99.8%'
  }
}

export function AnalyticsDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('30d')

  const { data: analyticsData, refetch } = useQuery({
    queryKey: ['analytics-data', timeRange],
    queryFn: () => generateAnalyticsData(),
    refetchInterval: 300000 // 5 minutes
  })

  if (!analyticsData) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/10 rounded w-48"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
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
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-600/10 border border-blue-500/20">
            <BarChart3 className="h-8 w-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive data visualization and insights</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {['7d', '30d', '90d', '1y'].map(range => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="glass border-white/10"
              >
                {range}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="glass border-white/10" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="glass border-white/10">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* System Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <MetricCard
          title="Data Points"
          value={analyticsData.totalDataPoints.toLocaleString()}
          subtitle="Total collected"
          icon={Activity}
          trend={{ value: "+1,247", direction: "up" }}
        />
        
        <MetricCard
          title="Analysis Time"
          value={analyticsData.analysisTime}
          subtitle="Avg processing"
          icon={Zap}
          trend={{ value: "-0.1s", direction: "up" }}
        />
        
        <MetricCard
          title="System Uptime"
          value={analyticsData.uptime}
          subtitle="Availability"
          icon={Target}
          trend={{ value: "+0.1%", direction: "up" }}
        />
        
        <MetricCard
          title="Last Updated"
          value={format(analyticsData.lastUpdate, 'HH:mm')}
          subtitle="Real-time data"
          icon={Clock}
          trend={{ value: "Live", direction: "up" }}
        />
      </motion.div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="glass border-white/10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monthly Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Monthly Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData.monthlyData}>
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
                        />
                        <Tooltip
                          contentStyle={{
                            background: 'rgba(0, 0, 0, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="health" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="wealth" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="spirituality" stroke="#8b5cf6" strokeWidth={2} />
                        <Line type="monotone" dataKey="productivity" stroke="#f59e0b" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Time Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Time Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData.timeDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {analyticsData.timeDistribution.map((entry, index) => (
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
                            formatter={(value) => [`${value}%`, 'Time']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="space-y-2">
                      {analyticsData.timeDistribution.map((item: any) => (
                        <div key={item.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span>{item.name}</span>
                          </div>
                          <span className="font-medium">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Daily Patterns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Daily Activity Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={analyticsData.dailyData.slice(-14)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis 
                          dataKey="day" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#9ca3af', fontSize: 12 }}
                        />
                        <YAxis
                          yAxisId="left"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#9ca3af', fontSize: 12 }}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#9ca3af', fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            background: 'rgba(0, 0, 0, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="focusTime" fill="#3b82f6" name="Focus Time (min)" />
                        <Bar yAxisId="left" dataKey="exerciseMinutes" fill="#10b981" name="Exercise (min)" />
                        <Line yAxisId="right" type="monotone" dataKey="mood" stroke="#f59e0b" strokeWidth={2} name="Mood" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="correlations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle>Factor Correlations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={analyticsData.correlationData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis
                          type="number"
                          dataKey="x"
                          name="Factor 1"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#9ca3af', fontSize: 12 }}
                        />
                        <YAxis
                          type="number"
                          dataKey="y"
                          name="Factor 2"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#9ca3af', fontSize: 12 }}
                        />
                        <Tooltip
                          cursor={{ strokeDasharray: '3 3' }}
                          contentStyle={{
                            background: 'rgba(0, 0, 0, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                        />
                        <Scatter dataKey="y" fill="#8b5cf6" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        data={analyticsData.performanceMetrics}
                        cx="50%"
                        cy="50%"
                        innerRadius="20%"
                        outerRadius="90%"
                      >
                        <RadialBar
                          dataKey="score"
                          cornerRadius={10}
                          fill="#60a5fa"
                        />
                        <Tooltip
                          contentStyle={{
                            background: 'rgba(0, 0, 0, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {analyticsData.performanceMetrics.map((metric: any) => (
                      <div key={metric.name} className="text-center">
                        <div className="text-sm font-medium">{metric.name}</div>
                        <div className="text-lg font-bold" style={{ color: metric.color }}>
                          {metric.score}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Goal Achievement Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.goalProgress}>
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
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(0, 0, 0, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="health"
                        stackId="1"
                        stroke="#10b981"
                        fillOpacity={0.6}
                        fill="#10b981"
                      />
                      <Area
                        type="monotone"
                        dataKey="wealth"
                        stackId="2"
                        stroke="#3b82f6"
                        fillOpacity={0.6}
                        fill="#3b82f6"
                      />
                      <Area
                        type="monotone"
                        dataKey="spirituality"
                        stackId="3"
                        stroke="#8b5cf6"
                        fillOpacity={0.6}
                        fill="#8b5cf6"
                      />
                      <Area
                        type="monotone"
                        dataKey="knowledge"
                        stackId="4"
                        stroke="#f59e0b"
                        fillOpacity={0.6}
                        fill="#f59e0b"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {['trends', 'performance'].map(tab => (
          <TabsContent key={tab} value={tab}>
            <Card className="glass border-white/10">
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-blue-400" />
                <h3 className="text-xl font-semibold mb-2 capitalize">{tab} Analysis</h3>
                <p className="text-muted-foreground">Advanced {tab} analytics coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}