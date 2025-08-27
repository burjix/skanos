'use client'

import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuickCapture } from '@/components/quick-capture'
import { TodayEvents } from '@/components/today-events'
import { PillarCards } from '@/components/pillar-cards'
import { QuickStats } from '@/components/quick-stats'
import { formatTime } from '@/lib/utils'
import { LogOut, Brain, Activity } from 'lucide-react'
import type { DashboardData } from '@skanos/shared'

export function Dashboard() {
  const { user, logout, token } = useAuth()

  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      
      return response.json()
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Brain className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-semibold">SkanOS</h1>
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {user?.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-white"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Capture */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <QuickCapture />
            </motion.div>

            {/* Today Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TodayEvents events={dashboardData?.todayEvents || []} />
            </motion.div>

            {/* Pillars */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <PillarCards pillars={dashboardData?.pillars || []} />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <QuickStats stats={dashboardData?.quickStats} />
            </motion.div>

            {/* Recent Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData?.recentInsights && dashboardData.recentInsights.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardData.recentInsights.map((insight) => (
                        <div
                          key={insight.id}
                          className="p-3 rounded-lg bg-black/30 border border-white/5"
                        >
                          <h4 className="font-medium text-sm mb-1">
                            {insight.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {insight.content}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-green-400">
                              {Math.round(insight.confidence * 100)}% confidence
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(insight.createdAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No insights yet. Keep capturing data to generate insights.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}