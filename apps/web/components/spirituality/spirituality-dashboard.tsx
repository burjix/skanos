'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, subDays } from 'date-fns'
import {
  Sparkles,
  Heart,
  BookOpen,
  Sunrise,
  Moon,
  Flame,
  Calendar,
  TrendingUp,
  Star,
  Feather,
  Target,
  Plus,
  Clock,
  Award,
  MessageSquare
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ActivityChart } from '@/components/charts/activity-chart'
import { ProgressRing } from '@/components/charts/progress-ring'
import { MetricCard } from '@/components/charts/metric-card'
import { Textarea } from '@/components/ui/textarea'
import { LoadingSkeleton } from '@/components/ui/loading-skeleton'
import { useSpiritualityMetrics } from '@/lib/hooks/api-hooks'

// Mock spirituality data
const generateSpiritualityData = () => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    return {
      name: format(date, 'EEE'),
      meditation: Math.floor(Math.random() * 45) + 15, // 15-60 minutes
      gratitude: Math.random() > 0.2 ? 1 : 0, // 80% chance
      journaling: Math.random() > 0.4 ? Math.floor(Math.random() * 20) + 10 : 0, // 10-30 min or 0
      mood: Math.floor(Math.random() * 4) + 6, // 6-10 mood score
      date: format(date, 'yyyy-MM-dd')
    }
  })

  return {
    weeklyData: last7Days,
    totalMeditationTime: 2340, // total minutes this month
    meditationStreak: 12,
    gratitudeStreak: 8,
    journalEntries: 15,
    averageMood: 7.8,
    mindfulMinutes: 45,
    dailyGoal: 30,
    weeklyReflections: 2,
    spiritualGrowthScore: 85
  }
}

const practices = [
  { 
    name: 'Morning Meditation', 
    icon: Sunrise, 
    streak: 12, 
    lastDone: 'Today', 
    timeSpent: 25,
    color: '#f59e0b'
  },
  { 
    name: 'Gratitude Journal', 
    icon: Heart, 
    streak: 8, 
    lastDone: 'Today', 
    timeSpent: 10,
    color: '#ef4444'
  },
  { 
    name: 'Evening Reflection', 
    icon: Moon, 
    streak: 5, 
    lastDone: 'Yesterday', 
    timeSpent: 15,
    color: '#8b5cf6'
  },
  { 
    name: 'Mindful Reading', 
    icon: BookOpen, 
    streak: 3, 
    lastDone: '2 days ago', 
    timeSpent: 30,
    color: '#10b981'
  }
]

const gratitudeEntries = [
  "Grateful for the peaceful morning walk and fresh air",
  "Thankful for meaningful conversations with loved ones",
  "Appreciating the small moments of joy throughout the day",
  "Blessed to have a roof over my head and food on the table"
]

const moodData = [
  { day: 'Mon', mood: 7, energy: 6 },
  { day: 'Tue', mood: 8, energy: 8 },
  { day: 'Wed', mood: 6, energy: 5 },
  { day: 'Thu', mood: 9, energy: 9 },
  { day: 'Fri', mood: 8, energy: 7 },
  { day: 'Sat', mood: 9, energy: 8 },
  { day: 'Sun', mood: 8, energy: 8 }
]

export function SpiritualityDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [journalEntry, setJournalEntry] = useState('')
  
  // Fetch real spirituality metrics from API
  const { data: spiritualityMetrics, isLoading, error } = useSpiritualityMetrics()
  
  // Use real data if available, otherwise fallback to mock data
  const spiritualityData = spiritualityMetrics || generateSpiritualityData()

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
        <Card className="glass border-white/10 border-purple-500/20">
          <CardContent className="p-6 text-center">
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-purple-400" />
            <h3 className="text-xl font-semibold mb-2">Spirituality data temporarily unavailable</h3>
            <p className="text-muted-foreground">Using sample data for demonstration. Start logging your spiritual practices to see real metrics.</p>
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
          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-600/10 border border-purple-500/20">
            <Sparkles className="h-8 w-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Spirituality Dashboard</h1>
            <p className="text-muted-foreground">Nurture your inner growth and mindfulness</p>
          </div>
        </div>
        <Button className="bg-purple-500 hover:bg-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          Quick Reflect
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
          title="Meditation Streak"
          value={`${spiritualityData.meditationStreak} days`}
          subtitle="Current streak"
          icon={Target}
          trend={{ value: "+1 day", direction: "up" }}
        />
        
        <MetricCard
          title="Mindful Minutes"
          value={`${spiritualityData.mindfulMinutes}m`}
          subtitle={`Goal: ${spiritualityData.dailyGoal}m`}
          icon={Clock}
          trend={{ 
            value: `${Math.round((spiritualityData.mindfulMinutes / spiritualityData.dailyGoal) * 100)}%`, 
            direction: spiritualityData.mindfulMinutes >= spiritualityData.dailyGoal ? "up" : "neutral" 
          }}
        />
        
        <MetricCard
          title="Average Mood"
          value={spiritualityData.averageMood.toFixed(1)}
          subtitle="Out of 10 this week"
          icon={Heart}
          trend={{ value: "+0.3", direction: "up" }}
        />
        
        <MetricCard
          title="Growth Score"
          value={`${spiritualityData.spiritualGrowthScore}%`}
          subtitle="Overall progress"
          icon={TrendingUp}
          trend={{ value: "+5%", direction: "up" }}
        />
      </motion.div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="glass border-white/10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="meditation">Meditation</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="gratitude">Gratitude</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Meditation Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ActivityChart
                  title="Daily Meditation (Minutes)"
                  data={spiritualityData.weeklyData.map((d: any) => ({ ...d, value: d.meditation }))}
                  color="#8b5cf6"
                  trend="up"
                  trendValue="+12 min avg"
                />
              </motion.div>

              {/* Mood & Energy Tracking */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <ActivityChart
                  title="Mood & Energy Levels"
                  data={moodData.map((d: any) => ({ name: d.day, value: d.mood, date: d.day }))}
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
                  title="Today's Goal"
                  value={spiritualityData.mindfulMinutes}
                  maxValue={spiritualityData.dailyGoal}
                  color="#8b5cf6"
                  unit="m"
                  subtitle="Meditation time"
                />

                <ProgressRing
                  title="Monthly Total"
                  value={spiritualityData.totalMeditationTime}
                  maxValue={3000}
                  color="#10b981"
                  unit="m"
                  subtitle="This month"
                />
              </div>

              {/* Spiritual Insights */}
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Today's Reflection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20">
                    <p className="text-sm italic text-purple-200">
                      "The present moment is the only time over which we have dominion. Peace comes from within, not from without."
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Daily wisdom</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Spiritual Practices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Spiritual Practices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {practices.map((practice: any) => {
                      const Icon = practice.icon
                      return (
                        <div
                          key={practice.name}
                          className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-white/5"
                        >
                          <div className="flex items-center gap-4">
                            <div 
                              className="p-2 rounded-lg border"
                              style={{ 
                                backgroundColor: `${practice.color}20`,
                                borderColor: `${practice.color}40`
                              }}
                            >
                              <Icon 
                                className="h-5 w-5" 
                                style={{ color: practice.color }}
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{practice.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {practice.lastDone} • {practice.timeSpent}min
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {practice.streak} day streak
                            </span>
                            <Flame className="h-4 w-4 text-orange-400" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Gratitude */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Recent Gratitude
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {gratitudeEntries.map((entry, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-gradient-to-r from-pink-500/5 to-purple-500/5 border border-pink-500/10"
                      >
                        <p className="text-sm text-pink-100">{entry}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(subDays(new Date(), index), 'MMM d')}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="meditation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Meditation Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6">
                    <div className="text-4xl font-bold mb-2">
                      {spiritualityData.totalMeditationTime}
                    </div>
                    <div className="text-muted-foreground">Minutes this month</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-black/30">
                      <div className="text-2xl font-semibold">{spiritualityData.meditationStreak}</div>
                      <div className="text-sm text-muted-foreground">Day streak</div>
                    </div>
                    <div className="p-4 rounded-lg bg-black/30">
                      <div className="text-2xl font-semibold">{spiritualityData.averageMood}</div>
                      <div className="text-sm text-muted-foreground">Avg mood</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle>Start Session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Sunrise className="h-6 w-6 mb-2" />
                    Morning
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Moon className="h-6 w-6 mb-2" />
                    Evening
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Heart className="h-6 w-6 mb-2" />
                    Gratitude
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Target className="h-6 w-6 mb-2" />
                    Focus
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="journal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Feather className="h-5 w-5" />
                  New Entry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="What's on your mind today? Reflect on your thoughts, feelings, and experiences..."
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    className="min-h-32 bg-black/30 border-white/10"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {journalEntry.length} characters
                    </span>
                    <Button disabled={!journalEntry.trim()}>
                      Save Entry
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recent Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    "Today I felt particularly grateful for the small moments...",
                    "Reflection on yesterday's challenges and how I grew...",
                    "Morning meditation brought clarity to my intentions..."
                  ].map((entry, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-black/30 border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                    >
                      <p className="text-sm line-clamp-2 mb-2">{entry}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{format(subDays(new Date(), index), 'MMM d, yyyy')}</span>
                        <MessageSquare className="h-3 w-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gratitude">
          <Card className="glass border-white/10">
            <CardContent className="p-8 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-pink-400" />
              <h3 className="text-xl font-semibold mb-2">Gratitude Practice</h3>
              <p className="text-muted-foreground">Enhanced gratitude tracking coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}