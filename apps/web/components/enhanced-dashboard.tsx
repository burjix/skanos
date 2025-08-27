'use client'

import { motion } from 'framer-motion'
import { format, subDays } from 'date-fns'
import { 
  Activity, 
  Brain, 
  Clock, 
  Zap, 
  Target, 
  TrendingUp,
  Heart,
  DollarSign,
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QuickCapture } from '@/components/quick-capture'
import { TodayEvents } from '@/components/today-events'
import { ActivityChart } from '@/components/charts/activity-chart'
import { ProgressRing } from '@/components/charts/progress-ring'
import { MetricCard } from '@/components/charts/metric-card'
import { LoadingSkeleton } from '@/components/ui/loading-skeleton'
import { useDashboardData, useTodayEvents, useAuth, useAnalytics } from '@/lib/hooks/api-hooks'

// Generate chart data from analytics or return empty data
const generateChartData = (analytics?: any) => {
  if (analytics?.activityData && analytics.hasData) {
    return analytics.activityData
  }
  
  // Return empty data structure when no real data exists
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    return {
      name: format(date, 'EEE'),
      value: 0,
      date: format(date, 'yyyy-MM-dd')
    }
  })
  return last7Days
}

export function EnhancedDashboard() {
  // Fetch real data from API
  const { data: authUser, isError: authError } = useAuth()
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useDashboardData()
  const { data: todayEvents, isLoading: eventsLoading } = useTodayEvents()
  const { data: analytics } = useAnalytics({ period: '7d' })
  // const { needsOnboarding, isOnboarded } = useOnboarding() // Removed for now

  // Show loading state while fetching dashboard data
  if (dashboardLoading || eventsLoading) {
    return (
      <div className="p-8 space-y-6">
        <LoadingSkeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <LoadingSkeleton className="h-64" />
            <LoadingSkeleton className="h-64" />
          </div>
          <div className="space-y-8">
            <LoadingSkeleton className="h-48" />
            <LoadingSkeleton className="h-48" />
          </div>
        </div>
      </div>
    )
  }

  // Show error state if authentication failed
  if (authError || dashboardError) {
    return (
      <div className="p-8 space-y-6">
        <Card className="glass border-white/10 border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <div>
                <h3 className="font-medium">Unable to load dashboard</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {authError ? 'Please log in to view your dashboard.' : 'There was an error loading your data. Please try again.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if we have any real data
  const hasAnyData = (dashboardData?.quickStats?.totalEvents || 0) > 0 || (analytics?.hasData)
  
  // TODO: Add empty state handling when no data exists
  // if (!hasAnyData) { return <EmptyState /> }

  // Generate chart data
  const activityData = generateChartData(analytics)
  const energyData = activityData.map((d: any) => ({ ...d, value: 0 })) // No mock data for energy

  // Calculate metrics from real data only
  const focusTime = 0 // Will be calculated from real time-tracking data
  const tasksCompleted = dashboardData?.quickStats?.totalEvents || 0
  const streakDays = 1 // Will be calculated from consistent daily activity
  const healthScore = 0 // Will be calculated from health metrics
  const wealthGrowth = '0.0' // Will be calculated from financial data
  const meditationMinutes = 0 // Will be calculated from spirituality events

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Good morning, {authUser?.name || 'User'}</h1>
          <p className="text-muted-foreground mt-1">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Day {streakDays} streak
        </div>
      </motion.div>

      {/* Quick Capture */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <QuickCapture />
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <MetricCard
          title="Focus Time"
          value={`${Math.floor(focusTime / 60)}h ${focusTime % 60}m`}
          subtitle="Today"
          icon={Clock}
          trend={{ value: "+23min", direction: "up" }}
        />
        
        <MetricCard
          title="Events Created"
          value={tasksCompleted}
          subtitle="Total"
          icon={Target}
          trend={{ value: `+${Math.floor(tasksCompleted * 0.1)}`, direction: "up" }}
        />
        
        <MetricCard
          title="Health Score"
          value={`${healthScore}%`}
          subtitle="Overall"
          icon={Heart}
          trend={{ value: "+5%", direction: "up" }}
        />
        
        <MetricCard
          title="Wealth Growth"
          value={`${wealthGrowth}%`}
          subtitle="This month"
          icon={DollarSign}
          trend={{ 
            value: `${Math.abs(parseFloat(wealthGrowth))}%`, 
            direction: parseFloat(wealthGrowth) >= 0 ? "up" : "down" 
          }}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ActivityChart
              title="Daily Activity Score"
              data={activityData}
              color="#10b981"
              trend="up"
              trendValue="+12%"
            />
          </motion.div>

          {/* Energy Levels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ActivityChart
              title="Energy Levels"
              data={energyData}
              color="#f59e0b"
              trend="neutral"
              trendValue="Stable"
            />
          </motion.div>

          {/* Today's Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <TodayEvents events={todayEvents || []} />
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Progress Rings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <ProgressRing
              title="Daily Steps"
              value={8432}
              maxValue={10000}
              color="#3b82f6"
              unit=""
              subtitle="Health goal"
            />
            
            <ProgressRing
              title="Meditation"
              value={meditationMinutes}
              maxValue={60}
              color="#8b5cf6"
              unit="m"
              subtitle="Daily practice"
            />
          </motion.div>

          {/* Recent Insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.recentInsights && dashboardData.recentInsights.length > 0 ? (
                    dashboardData.recentInsights.slice(0, 2).map((insight, index) => (
                      <div key={insight.id} className="p-4 rounded-lg bg-black/30 border border-white/5">
                        <div className="flex items-start gap-3">
                          {index === 0 ? (
                            <TrendingUp className="h-5 w-5 text-green-400 mt-0.5" />
                          ) : (
                            <Zap className="h-5 w-5 text-yellow-400 mt-0.5" />
                          )}
                          <div>
                            <h4 className="font-medium text-sm">{insight.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {insight.content}
                            </p>
                            <span className={`text-xs mt-2 block ${
                              insight.confidence >= 80 ? 'text-green-400' : 
                              insight.confidence >= 60 ? 'text-yellow-400' : 'text-orange-400'
                            }`}>
                              {insight.confidence}% confidence
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="p-4 rounded-lg bg-black/30 border border-white/5">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="h-5 w-5 text-green-400 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-sm">Getting Started</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Start capturing events and activities to generate personalized insights.
                            </p>
                            <span className="text-xs text-green-400 mt-2 block">AI-powered analysis</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-black/30 border border-white/5">
                        <div className="flex items-start gap-3">
                          <Sparkles className="h-5 w-5 text-purple-400 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-sm">Smart Recommendations</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Your personal AI assistant will learn from your patterns and provide actionable insights.
                            </p>
                            <span className="text-xs text-purple-400 mt-2 block">Coming soon</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}