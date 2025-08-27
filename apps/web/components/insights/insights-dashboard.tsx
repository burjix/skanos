'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { format, subDays, subWeeks } from 'date-fns'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter
} from 'recharts'
import {
  TrendingUp,
  Brain,
  Lightbulb,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Activity,
  Award,
  Eye,
  Sparkles,
  BarChart3,
  Filter
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MetricCard } from '@/components/charts/metric-card'

interface Insight {
  id: string
  title: string
  description: string
  type: 'pattern' | 'correlation' | 'prediction' | 'recommendation' | 'anomaly'
  pillar: 'health' | 'wealth' | 'spirituality' | 'general'
  confidence: number
  impact: 'low' | 'medium' | 'high'
  actionable: boolean
  createdAt: Date
  data?: any
}

interface Pattern {
  name: string
  description: string
  strength: number
  trend: 'up' | 'down' | 'stable'
}

interface Correlation {
  factor1: string
  factor2: string
  strength: number
  description: string
}

// Mock insights data
const generateInsightsData = () => {
  const insights: Insight[] = [
    {
      id: '1',
      title: 'Peak Productivity Hours Identified',
      description: 'Your focus time is 34% higher between 8-11 AM. Consider scheduling complex tasks during this window.',
      type: 'pattern',
      pillar: 'general',
      confidence: 0.92,
      impact: 'high',
      actionable: true,
      createdAt: subDays(new Date(), 1)
    },
    {
      id: '2',
      title: 'Exercise-Energy Correlation',
      description: 'Days with 30+ minutes of exercise correlate with 28% higher energy levels the following day.',
      type: 'correlation',
      pillar: 'health',
      confidence: 0.87,
      impact: 'high',
      actionable: true,
      createdAt: subDays(new Date(), 2)
    },
    {
      id: '3',
      title: 'Meditation Streak Impact',
      description: 'Your meditation streak shows diminishing returns after 45 minutes. Optimal session length: 20-30 minutes.',
      type: 'recommendation',
      pillar: 'spirituality',
      confidence: 0.79,
      impact: 'medium',
      actionable: true,
      createdAt: subDays(new Date(), 3)
    },
    {
      id: '4',
      title: 'Spending Pattern Alert',
      description: 'Your entertainment expenses increased 42% this month. Consider reviewing subscription services.',
      type: 'anomaly',
      pillar: 'wealth',
      confidence: 0.95,
      impact: 'medium',
      actionable: true,
      createdAt: subDays(new Date(), 1)
    },
    {
      id: '5',
      title: 'Sleep Quality Prediction',
      description: 'Based on recent patterns, optimizing room temperature could improve sleep quality by 15%.',
      type: 'prediction',
      pillar: 'health',
      confidence: 0.83,
      impact: 'medium',
      actionable: true,
      createdAt: subDays(new Date(), 4)
    }
  ]

  const patterns: Pattern[] = [
    { name: 'Morning Productivity', description: 'Peak focus 8-11 AM', strength: 0.92, trend: 'up' },
    { name: 'Weekend Recovery', description: 'Better sleep on weekends', strength: 0.78, trend: 'stable' },
    { name: 'Exercise Momentum', description: 'Workout consistency improving', strength: 0.85, trend: 'up' },
    { name: 'Financial Discipline', description: 'Savings rate increasing', strength: 0.73, trend: 'up' }
  ]

  const correlations: Correlation[] = [
    { 
      factor1: 'Exercise Duration', 
      factor2: 'Energy Levels', 
      strength: 0.87, 
      description: 'Strong positive correlation' 
    },
    { 
      factor1: 'Sleep Quality', 
      factor2: 'Mood Rating', 
      strength: 0.74, 
      description: 'Moderate positive correlation' 
    },
    { 
      factor1: 'Meditation Time', 
      factor2: 'Stress Levels', 
      strength: -0.68, 
      description: 'Moderate negative correlation' 
    },
    { 
      factor1: 'Screen Time', 
      factor2: 'Sleep Onset', 
      strength: 0.61, 
      description: 'Moderate positive correlation' 
    }
  ]

  const weeklyTrends = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    return {
      day: format(date, 'EEE'),
      productivity: Math.floor(Math.random() * 30) + 60,
      mood: Math.floor(Math.random() * 30) + 60,
      energy: Math.floor(Math.random() * 30) + 60,
      focus: Math.floor(Math.random() * 30) + 60,
      date: format(date, 'yyyy-MM-dd')
    }
  })

  const pillarPerformance = [
    { pillar: 'Health', score: 85, maxScore: 100 },
    { pillar: 'Wealth', score: 78, maxScore: 100 },
    { pillar: 'Spirituality', score: 72, maxScore: 100 },
    { pillar: 'Knowledge', score: 88, maxScore: 100 },
    { pillar: 'Productivity', score: 82, maxScore: 100 },
    { pillar: 'Relationships', score: 75, maxScore: 100 }
  ]

  return {
    insights,
    patterns,
    correlations,
    weeklyTrends,
    pillarPerformance,
    totalInsights: insights.length,
    highImpactInsights: insights.filter(i => i.impact === 'high').length,
    actionableInsights: insights.filter(i => i.actionable).length,
    averageConfidence: insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length
  }
}

const getInsightIcon = (type: string) => {
  switch (type) {
    case 'pattern': return Activity
    case 'correlation': return Target
    case 'prediction': return Eye
    case 'recommendation': return Lightbulb
    case 'anomaly': return AlertTriangle
    default: return Brain
  }
}

const getInsightColor = (type: string) => {
  switch (type) {
    case 'pattern': return '#10b981'
    case 'correlation': return '#3b82f6'
    case 'prediction': return '#8b5cf6'
    case 'recommendation': return '#f59e0b'
    case 'anomaly': return '#ef4444'
    default: return '#6b7280'
  }
}

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return '#ef4444'
    case 'medium': return '#f59e0b'
    case 'low': return '#10b981'
    default: return '#6b7280'
  }
}

export function InsightsDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [filterType, setFilterType] = useState<string | null>(null)

  const { data: insightsData } = useQuery({
    queryKey: ['insights-data'],
    queryFn: () => generateInsightsData(),
    refetchInterval: 300000 // 5 minutes
  })

  if (!insightsData) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/10 rounded w-48"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const filteredInsights = filterType 
    ? insightsData.insights.filter(insight => insight.type === filterType)
    : insightsData.insights

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-600/10 border border-purple-500/20">
            <Brain className="h-8 w-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Insights</h1>
            <p className="text-muted-foreground">Discover patterns and optimize your life with AI-powered analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="glass border-white/10">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Badge variant="outline" className="glass border-green-500/20 text-green-400">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Active
          </Badge>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <MetricCard
          title="Total Insights"
          value={insightsData.totalInsights}
          subtitle="Generated this month"
          icon={Brain}
          trend={{ value: "+8", direction: "up" }}
        />
        
        <MetricCard
          title="High Impact"
          value={insightsData.highImpactInsights}
          subtitle="Priority insights"
          icon={Award}
          trend={{ value: "+2", direction: "up" }}
        />
        
        <MetricCard
          title="Actionable"
          value={`${insightsData.actionableInsights}/${insightsData.totalInsights}`}
          subtitle="Ready to implement"
          icon={CheckCircle}
          trend={{ value: "85%", direction: "up" }}
        />
        
        <MetricCard
          title="Avg Confidence"
          value={`${Math.round(insightsData.averageConfidence * 100)}%`}
          subtitle="AI certainty"
          icon={Target}
          trend={{ value: "+3%", direction: "up" }}
        />
      </motion.div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="glass border-white/10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Insights */}
            <div className="lg:col-span-2 space-y-6">
              {/* Weekly Trends */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="glass border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Weekly Performance Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={insightsData.weeklyTrends}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                          <XAxis 
                            dataKey="day" 
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
                          <Area
                            type="monotone"
                            dataKey="productivity"
                            stackId="1"
                            stroke="#3b82f6"
                            fillOpacity={0.6}
                            fill="#3b82f6"
                          />
                          <Area
                            type="monotone"
                            dataKey="mood"
                            stackId="1"
                            stroke="#10b981"
                            fillOpacity={0.6}
                            fill="#10b981"
                          />
                          <Area
                            type="monotone"
                            dataKey="energy"
                            stackId="1"
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

              {/* Recent Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="glass border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        Recent Insights
                      </span>
                      <div className="flex gap-2">
                        {['pattern', 'correlation', 'recommendation', 'anomaly'].map(type => (
                          <Button
                            key={type}
                            variant={filterType === type ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilterType(filterType === type ? null : type)}
                            className="capitalize"
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredInsights.map((insight, index) => {
                        const Icon = getInsightIcon(insight.type)
                        return (
                          <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 rounded-lg bg-black/30 border border-white/5 hover:border-white/10 transition-colors"
                          >
                            <div className="flex items-start gap-4">
                              <div 
                                className="p-2 rounded-lg border flex-shrink-0"
                                style={{ 
                                  backgroundColor: `${getInsightColor(insight.type)}20`,
                                  borderColor: `${getInsightColor(insight.type)}40`
                                }}
                              >
                                <Icon 
                                  className="h-5 w-5"
                                  style={{ color: getInsightColor(insight.type) }}
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-medium">{insight.title}</h3>
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs capitalize"
                                    style={{ borderColor: getImpactColor(insight.impact), color: getImpactColor(insight.impact) }}
                                  >
                                    {insight.impact} impact
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {insight.description}
                                </p>
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-4">
                                    <span className="text-green-400">
                                      {Math.round(insight.confidence * 100)}% confidence
                                    </span>
                                    <Badge variant="outline" className="capitalize">
                                      {insight.pillar}
                                    </Badge>
                                  </div>
                                  <span className="text-muted-foreground">
                                    {format(insight.createdAt, 'MMM d')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Pillar Performance */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="glass border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Pillar Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={insightsData.pillarPerformance}>
                          <PolarGrid stroke="#ffffff20" />
                          <PolarAngleAxis 
                            dataKey="pillar" 
                            tick={{ fill: '#9ca3af', fontSize: 10 }}
                          />
                          <PolarRadiusAxis 
                            tick={{ fill: '#9ca3af', fontSize: 10 }}
                            domain={[0, 100]}
                          />
                          <Radar
                            name="Score"
                            dataKey="score"
                            stroke="#8b5cf6"
                            fill="#8b5cf6"
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* AI Status */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="glass border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      AI Analysis Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Data Processing</span>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        Active
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Pattern Detection</span>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        Running
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Next Analysis</span>
                      <span className="text-sm">2 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Data Points</span>
                      <span className="text-sm font-medium">2,847</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insightsData.patterns.map((pattern, index) => (
              <motion.div
                key={pattern.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{pattern.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        {pattern.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-400" />
                        ) : pattern.trend === 'down' ? (
                          <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="text-sm font-medium">
                          {Math.round(pattern.strength * 100)}%
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {pattern.description}
                    </p>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${pattern.strength * 100}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="correlations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insightsData.correlations.map((correlation, index) => (
              <motion.div
                key={`${correlation.factor1}-${correlation.factor2}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {correlation.factor1} ↔ {correlation.factor2}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Correlation Strength</span>
                        <span className="font-medium">
                          {correlation.strength > 0 ? '+' : ''}{Math.round(correlation.strength * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            correlation.strength > 0 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.abs(correlation.strength) * 100}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {correlation.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions">
          <Card className="glass border-white/10">
            <CardContent className="p-8 text-center">
              <Eye className="h-16 w-16 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Predictive Analytics</h3>
              <p className="text-muted-foreground">Advanced prediction models coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}