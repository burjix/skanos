'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, Clock, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useRealTimeUpdates } from '@/lib/use-websocket'
import { cn } from '@/lib/utils'

interface RealTimeStatusProps {
  className?: string
  showDetails?: boolean
}

export function RealTimeStatus({ className, showDetails = false }: RealTimeStatusProps) {
  const { connectionStatus, isConnected } = useRealTimeUpdates(true)

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'Open':
        return CheckCircle
      case 'Connecting':
        return Clock
      case 'Closing':
        return WifiOff
      case 'Closed':
        return WifiOff
      default:
        return WifiOff
    }
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'Open':
        return 'text-green-400 border-green-400'
      case 'Connecting':
        return 'text-yellow-400 border-yellow-400'
      case 'Closing':
      case 'Closed':
        return 'text-red-400 border-red-400'
      default:
        return 'text-gray-400 border-gray-400'
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'Open':
        return 'Live'
      case 'Connecting':
        return 'Connecting...'
      case 'Closing':
        return 'Disconnecting...'
      case 'Closed':
        return 'Offline'
      default:
        return 'Unknown'
    }
  }

  const StatusIcon = getStatusIcon()

  if (!showDetails) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={cn("flex items-center gap-1", className)}
      >
        <motion.div
          animate={connectionStatus === 'Connecting' ? { rotate: 360 } : {}}
          transition={{ duration: 2, repeat: connectionStatus === 'Connecting' ? Infinity : 0, ease: "linear" }}
        >
          <StatusIcon className={cn("h-3 w-3", getStatusColor().split(' ')[0])} />
        </motion.div>
        {isConnected && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-1 bg-green-400 rounded-full"
          />
        )}
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={connectionStatus}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className={cn("flex items-center gap-2", className)}
      >
        <Badge variant="outline" className={cn("text-xs", getStatusColor())}>
          <motion.div
            className="mr-1"
            animate={connectionStatus === 'Connecting' ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: connectionStatus === 'Connecting' ? Infinity : 0, ease: "linear" }}
          >
            <StatusIcon className="h-3 w-3" />
          </motion.div>
          {getStatusText()}
        </Badge>
      </motion.div>
    </AnimatePresence>
  )
}

export function ConnectionIndicator() {
  const { connectionStatus, isConnected } = useRealTimeUpdates(true)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            className="glass border-red-500/20 bg-red-500/10 p-3 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-2 text-red-400">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm font-medium">
                {connectionStatus === 'Connecting' ? 'Reconnecting...' : 'Connection lost'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}