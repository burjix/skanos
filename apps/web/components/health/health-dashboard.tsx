'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, subDays } from 'date-fns'
import {
  Heart,
  Moon,
  Dumbbell,
  Zap,
  TrendingUp,
  Calendar,
  Target,
  Award,
  Activity,
  Clock,
  Flame,
  BarChart3,
  Plus
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ActivityChart } from '@/components/charts/activity-chart'
import { ProgressRing } from '@/components/charts/progress-ring'
import { MetricCard } from '@/components/charts/metric-card'
import { LoadingSkeleton } from '@/components/ui/loading-skeleton'
import { useHealthMetrics } from '@/lib/hooks/api-hooks'

// Mock data for health tracking
const generateHealthData = () => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    return {
      name: format(date, 'MMM d'),
      sleep: Math.floor(Math.random() * 3) + 6, // 6-9 hours
      steps: Math.floor(Math.random() * 5000) + 5000, // 5k-10k steps
      energy: Math.floor(Math.random() * 4) + 6, // 6-10 energy level
      workout: Math.random() > 0.3 ? Math.floor(Math.random() * 60) + 30 : 0, // 30-90 min or 0
      date: format(date, 'yyyy-MM-dd')
    }
  })

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
    waterGoal: 3.0
  }
}

const workoutTypes = [
  { name: 'Strength', icon: Dumbbell, count: 12, lastDone: '2 days ago' },
  { name: 'Cardio', icon: Heart, count: 8, lastDone: 'Yesterday' },
  { name: 'Yoga', icon: Activity, count: 6, lastDone: '3 days ago' },
  { name: 'HIIT', icon: Flame, count: 4, lastDone: '1 week ago' }
]

const habits = [
  { name: 'Morning Exercise', streak: 12, completed: true },
  { name: '8h Sleep', streak: 5, completed: false },
  { name: '3L Water', streak: 8, completed: true },
  { name: 'Vitamins', streak: 15, completed: true }
]

export function HealthDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview')
  
  // Fetch real health metrics from API
  const { data: healthMetrics, isLoading, error } = useHealthMetrics()
  
  // Use real data if available, otherwise fallback to mock data
  const healthData = healthMetrics || generateHealthData()

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
        <Card className="glass border-white/10 border-red-500/20">
          <CardContent className="p-6 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-red-400" />
            <h3 className="text-xl font-semibold mb-2">Health data temporarily unavailable</h3>
            <p className="text-muted-foreground">Using sample data for demonstration. Connect your health tracking devices to see real metrics.</p>
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
          <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/20">
            <Heart className="h-8 w-8 text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Health Dashboard</h1>
            <p className="text-muted-foreground">Track your physical wellness journey</p>
          </div>
        </div>
        <Button className="bg-green-500 hover:bg-green-600">
          <Plus className="h-4 w-4 mr-2" />
          Log Activity
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
          title="Sleep Last Night"
          value={`${healthData.todaySleep}h`}
          subtitle={`Goal: ${healthData.sleepGoal}h`}
          icon={Moon}
          trend={{ 
            value: `${((healthData.todaySleep / healthData.sleepGoal) * 100).toFixed(0)}%`, 
            direction: healthData.todaySleep >= healthData.sleepGoal ? "up" : "down" 
          }}
        />
        
        <MetricCard
          title="Steps Today"
          value={healthData.todaySteps.toLocaleString()}
          subtitle={`Goal: ${healthData.stepGoal.toLocaleString()}`}
          icon={Activity}
          trend={{ 
            value: `${((healthData.todaySteps / healthData.stepGoal) * 100).toFixed(0)}%`, 
            direction: healthData.todaySteps >= healthData.stepGoal ? "up" : "down" 
          }}
        />
        
        <MetricCard
          title="Current Weight"
          value={`${healthData.currentWeight}kg`}
          subtitle={`Target: ${healthData.targetWeight}kg`}
          icon={Target}
          trend={{ 
            value: `${(healthData.currentWeight - healthData.targetWeight).toFixed(1)}kg`, 
            direction: healthData.currentWeight > healthData.targetWeight ? "down" : "up" 
          }}
        />
        
        <MetricCard
          title="Workout Streak"
          value={`${healthData.workoutStreak} days`}
          subtitle="Personal best: 21 days"
          icon={Award}
          trend={{ value: "+1 day", direction: "up" }}
        />
      </motion.div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="glass border-white/10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="fitness">Fitness</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sleep Trend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ActivityChart
                  title="Sleep Pattern (Hours)"
                  data={healthData.weeklyData.map((d: any) => ({ ...d, value: d.sleep }))}
                  color="#3b82f6"
                  trend="up"
                  trendValue="+0.5h avg"
                />
              </motion.div>

              {/* Energy Levels */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <ActivityChart
                  title="Energy Levels (1-10)"
                  data={healthData.weeklyData.map((d: any) => ({ ...d, value: d.energy }))}
                  color="#f59e0b"
                  trend="up"
                  trendValue="+1.2 avg"
                />
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Progress Rings */}
              <div className="space-y-6">
                <ProgressRing
                  title="Daily Steps"
                  value={healthData.todaySteps}
                  maxValue={healthData.stepGoal}
                  color="#10b981"
                  unit=""
                  subtitle="Keep moving!"
                />

                <ProgressRing
                  title="Water Intake"
                  value={healthData.waterIntake}
                  maxValue={healthData.waterGoal}
                  color="#06b6d4"
                  unit="L"
                  subtitle="Stay hydrated"
                />
              </div>

              {/* Current Stats */}
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Vitals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Resting HR</span>
                    <span className="font-medium">{healthData.heartRate} bpm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Body Fat</span>
                    <span className="font-medium">{healthData.bodyFat}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Energy Level</span>
                    <span className="font-medium">{healthData.energyLevel}/10</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Workout Types */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5" />
                    Workout Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {workoutTypes.map((workout, index) => {
                      const Icon = workout.icon
                      return (
                        <div
                          key={workout.name}
                          className="p-4 rounded-lg bg-black/30 border border-white/5 text-center"
                        >
                          <Icon className="h-8 w-8 mx-auto mb-2 text-green-400" />
                          <h3 className="font-medium mb-1">{workout.name}</h3>
                          <p className="text-lg font-bold mb-1">{workout.count}</p>
                          <p className="text-xs text-muted-foreground">{workout.lastDone}</p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Habit Tracker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Daily Habits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {habits.map((habit: any) => (
                      <div key={habit.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              habit.completed
                                ? 'bg-green-500 border-green-500'
                                : 'border-muted-foreground'
                            }`}
                          />
                          <span className="font-medium">{habit.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {habit.streak} day streak
                          </span>
                          <Flame className="h-4 w-4 text-orange-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="sleep">
          <Card className="glass border-white/10">
            <CardContent className="p-8 text-center">
              <Moon className="h-16 w-16 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2">Sleep Tracking</h3>
              <p className="text-muted-foreground">Detailed sleep analysis coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fitness">
          <Card className="glass border-white/10">
            <CardContent className="p-8 text-center">
              <Dumbbell className="h-16 w-16 mx-auto mb-4 text-green-400" />
              <h3 className="text-xl font-semibold mb-2">Fitness Tracking</h3>
              <p className="text-muted-foreground">Advanced workout analytics coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition">
          <Card className="glass border-white/10">
            <CardContent className="p-8 text-center">
              <Activity className="h-16 w-16 mx-auto mb-4 text-orange-400" />
              <h3 className="text-xl font-semibold mb-2">Nutrition Tracking</h3>
              <p className="text-muted-foreground">Calorie and macro tracking coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}