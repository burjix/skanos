'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Database, Brain, Lightbulb } from 'lucide-react'
import { motion } from 'framer-motion'

interface QuickStatsProps {
  stats?: {
    totalEvents: number
    entitiesCount: number
    memoriesCount: number
    insightsCount: number
  }
}

export function QuickStats({ stats }: QuickStatsProps) {
  const statItems = [
    {
      label: 'Total Events',
      value: stats?.totalEvents || 0,
      icon: BarChart3,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Entities',
      value: stats?.entitiesCount || 0,
      icon: Database,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Memories',
      value: stats?.memoriesCount || 0,
      icon: Brain,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Insights',
      value: stats?.insightsCount || 0,
      icon: Lightbulb,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
  ]

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="text-lg">System Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-lg ${item.bgColor} border border-white/5`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-black/30`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className={`text-xl font-bold ${item.color}`}
              >
                {item.value.toLocaleString()}
              </motion.span>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-muted-foreground text-center">
            Data processed and analyzed in real-time
          </p>
        </div>
      </CardContent>
    </Card>
  )
}