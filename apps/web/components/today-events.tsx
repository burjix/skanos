'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatTime } from '@/lib/utils'
import { Calendar, Circle } from 'lucide-react'
import { motion } from 'framer-motion'

interface Event {
  id: string
  type: string
  title: string
  description?: string
  createdAt: string
}

interface TodayEventsProps {
  events: Event[]
}

const eventTypeColors: Record<string, string> = {
  quick_capture: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  health: 'bg-green-500/20 text-green-400 border-green-500/30',
  wealth: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  spirituality: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  default: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const eventTypeIcons: Record<string, string> = {
  quick_capture: '💭',
  health: '💪',
  wealth: '💰',
  spirituality: '🧘',
  default: '📝',
}

export function TodayEvents({ events }: TodayEventsProps) {
  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Today's Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events && events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-black/30 border border-white/5 hover:bg-black/40 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={`
                    w-8 h-8 rounded-full border flex items-center justify-center text-sm
                    ${eventTypeColors[event.type] || eventTypeColors.default}
                  `}>
                    {eventTypeIcons[event.type] || eventTypeIcons.default}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm truncate">
                      {event.title}
                    </h4>
                    <span className="text-xs text-muted-foreground ml-2">
                      {formatTime(event.createdAt)}
                    </span>
                  </div>
                  
                  {event.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium border
                      ${eventTypeColors[event.type] || eventTypeColors.default}
                    `}>
                      {event.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Circle className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No activity today yet.</p>
            <p className="text-xs mt-1">Start by capturing something above!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}