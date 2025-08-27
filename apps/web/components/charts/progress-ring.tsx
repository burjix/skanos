'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProgressRingProps {
  title: string
  value: number
  maxValue: number
  color: string
  unit?: string
  subtitle?: string
  className?: string
}

export function ProgressRing({ 
  title, 
  value, 
  maxValue, 
  color, 
  unit = '', 
  subtitle,
  className 
}: ProgressRingProps) {
  const percentage = Math.min((value / maxValue) * 100, 100)
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <Card className={`glass border-white/10 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="45"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="45"
                stroke={color}
                strokeWidth="8"
                fill="none"
                strokeDasharray={strokeDasharray}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-bold"
              >
                {value.toLocaleString()}{unit}
              </motion.span>
              <span className="text-sm text-muted-foreground">
                of {maxValue.toLocaleString()}{unit}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <span className="text-sm text-muted-foreground">
            {percentage.toFixed(1)}% complete
          </span>
        </div>
      </CardContent>
    </Card>
  )
}