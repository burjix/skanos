'use client'

import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
  }
  className?: string
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  className 
}: MetricCardProps) {
  const trendColor = trend?.direction === 'up' 
    ? 'text-green-400' 
    : trend?.direction === 'down' 
    ? 'text-red-400' 
    : 'text-gray-400'

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className={`glass border-white/10 hover:border-white/20 transition-colors ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold"
            >
              {value}
            </motion.div>
            
            <div className="flex items-center justify-between text-sm">
              {subtitle && (
                <span className="text-muted-foreground">{subtitle}</span>
              )}
              {trend && (
                <span className={`${trendColor} font-medium`}>
                  {trend.direction === 'up' && '+'}
                  {trend.value}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}