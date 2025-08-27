'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface Pillar {
  id: string
  name: string
  color: string
  icon?: string
}

interface PillarCardsProps {
  pillars: Pillar[]
}

export function PillarCards({ pillars }: PillarCardsProps) {
  if (!pillars || pillars.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Life Pillars</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pillars.map((pillar, index) => (
          <motion.div
            key={pillar.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="glass border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer"
              style={{ 
                borderLeftColor: pillar.color,
                borderLeftWidth: '4px'
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {pillar.icon && (
                      <span className="text-lg">{pillar.icon}</span>
                    )}
                    <CardTitle 
                      className="text-base"
                      style={{ color: pillar.color }}
                    >
                      {pillar.name}
                    </CardTitle>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors" />
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div 
                    className="h-2 rounded-full bg-black/30"
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.random() * 80 + 20}%` }}
                      transition={{ delay: index * 0.2, duration: 1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: pillar.color }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>This week</span>
                    <span>{Math.floor(Math.random() * 5 + 1)} activities</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}