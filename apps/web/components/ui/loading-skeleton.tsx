'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'card' | 'chart' | 'text' | 'circle' | 'metric'
  count?: number
}

export function LoadingSkeleton({ className, variant = 'card', count = 1 }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="glass border-white/10 rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-white/10 rounded animate-pulse w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-white/10 rounded animate-pulse" />
              <div className="h-3 bg-white/10 rounded animate-pulse w-5/6" />
            </div>
          </div>
        )

      case 'chart':
        return (
          <div className="glass border-white/10 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-6 bg-white/10 rounded animate-pulse w-1/3" />
                <div className="h-4 bg-white/10 rounded animate-pulse w-16" />
              </div>
              <div className="h-64 bg-white/5 rounded animate-pulse" />
            </div>
          </div>
        )

      case 'metric':
        return (
          <div className="glass border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 bg-white/10 rounded animate-pulse w-20" />
              <div className="w-5 h-5 bg-white/10 rounded animate-pulse" />
            </div>
            <div className="h-8 bg-white/10 rounded animate-pulse w-16 mb-2" />
            <div className="h-3 bg-white/10 rounded animate-pulse w-24" />
          </div>
        )

      case 'circle':
        return <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse" />

      case 'text':
        return (
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded animate-pulse" />
            <div className="h-4 bg-white/10 rounded animate-pulse w-5/6" />
          </div>
        )

      default:
        return <div className="h-20 bg-white/10 rounded animate-pulse" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("space-y-4", className)}
    >
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </motion.div>
  )
}