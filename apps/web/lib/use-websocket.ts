'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'

interface UseWebSocketOptions {
  url: string
  protocols?: string | string[]
  onOpen?: (event: Event) => void
  onMessage?: (event: MessageEvent) => void
  onError?: (event: Event) => void
  onClose?: (event: CloseEvent) => void
  shouldReconnect?: (closeEvent: CloseEvent) => boolean
  reconnectAttempts?: number
  reconnectInterval?: number
  enabled?: boolean
}

interface UseWebSocketReturn {
  socket: WebSocket | null
  connectionStatus: 'Connecting' | 'Open' | 'Closing' | 'Closed'
  lastMessage: MessageEvent | null
  sendMessage: (message: string | ArrayBufferLike | Blob | ArrayBufferView) => void
  sendJsonMessage: (message: any) => void
  reconnect: () => void
}

export function useWebSocket({
  url,
  protocols,
  onOpen,
  onMessage,
  onError,
  onClose,
  shouldReconnect = () => true,
  reconnectAttempts = 3,
  reconnectInterval = 3000,
  enabled = true
}: UseWebSocketOptions): UseWebSocketReturn {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'Connecting' | 'Open' | 'Closing' | 'Closed'>('Closed')
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null)
  
  const queryClient = useQueryClient()
  const reconnectAttemptsRef = useRef(0)
  const shouldReconnectRef = useRef(shouldReconnect)
  const urlRef = useRef(url)
  
  // Update refs when props change
  useEffect(() => {
    shouldReconnectRef.current = shouldReconnect
    urlRef.current = url
  }, [shouldReconnect, url])

  const connect = useCallback(() => {
    if (!enabled) return

    try {
      const ws = new WebSocket(url, protocols)
      
      ws.onopen = (event) => {
        setConnectionStatus('Open')
        reconnectAttemptsRef.current = 0
        onOpen?.(event)
      }
      
      ws.onmessage = (event) => {
        setLastMessage(event)
        
        // Try to parse as JSON for real-time data updates
        try {
          const data = JSON.parse(event.data)
          
          // Handle different types of real-time updates
          if (data.type === 'query_invalidate') {
            // Invalidate specific queries
            queryClient.invalidateQueries({ queryKey: data.queryKey })
          } else if (data.type === 'query_update') {
            // Update query data directly
            queryClient.setQueryData(data.queryKey, data.data)
          } else if (data.type === 'notification') {
            // Handle notifications (could integrate with toast system)
            console.log('Real-time notification:', data.message)
          }
        } catch (error) {
          // Not JSON, just a regular message
        }
        
        onMessage?.(event)
      }
      
      ws.onerror = (event) => {
        setConnectionStatus('Closed')
        onError?.(event)
      }
      
      ws.onclose = (event) => {
        setConnectionStatus('Closed')
        setSocket(null)
        onClose?.(event)
        
        // Attempt to reconnect if conditions are met
        if (
          shouldReconnectRef.current(event) &&
          reconnectAttemptsRef.current < reconnectAttempts &&
          enabled
        ) {
          reconnectAttemptsRef.current++
          setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
      }
      
      setSocket(ws)
      setConnectionStatus('Connecting')
      
    } catch (error) {
      console.error('WebSocket connection error:', error)
      setConnectionStatus('Closed')
    }
  }, [url, protocols, enabled, onOpen, onMessage, onError, onClose, reconnectAttempts, reconnectInterval, queryClient])

  const disconnect = useCallback(() => {
    if (socket) {
      setConnectionStatus('Closing')
      socket.close()
    }
  }, [socket])

  const sendMessage = useCallback((message: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message)
    } else {
      console.warn('WebSocket is not connected. Message not sent.')
    }
  }, [socket])

  const sendJsonMessage = useCallback((message: any) => {
    sendMessage(JSON.stringify(message))
  }, [sendMessage])

  const reconnect = useCallback(() => {
    disconnect()
    setTimeout(connect, 100)
  }, [disconnect, connect])

  // Initial connection
  useEffect(() => {
    if (enabled) {
      connect()
    }
    
    return () => {
      disconnect()
    }
  }, [enabled]) // Only depend on enabled to avoid reconnecting on every prop change

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [])

  return {
    socket,
    connectionStatus,
    lastMessage,
    sendMessage,
    sendJsonMessage,
    reconnect
  }
}

// Hook for specific real-time features
export function useRealTimeUpdates(enabled = true) {
  const queryClient = useQueryClient()
  
  const { connectionStatus, sendJsonMessage } = useWebSocket({
    url: process.env.NODE_ENV === 'production' 
      ? 'wss://your-domain.com/ws' 
      : 'ws://localhost:8080/ws',
    enabled,
    onMessage: (event) => {
      try {
        const data = JSON.parse(event.data)
        
        // Handle real-time dashboard updates
        if (data.type === 'dashboard_update') {
          queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        }
        
        // Handle real-time pillar updates
        if (data.type === 'pillar_update') {
          queryClient.invalidateQueries({ queryKey: [`${data.pillar}-data`] })
        }
        
        // Handle real-time insights
        if (data.type === 'new_insight') {
          queryClient.invalidateQueries({ queryKey: ['insights-data'] })
        }
        
      } catch (error) {
        console.warn('Failed to parse WebSocket message:', error)
      }
    },
    shouldReconnect: (closeEvent) => {
      // Reconnect unless it was a manual close (code 1000)
      return closeEvent.code !== 1000
    }
  })

  const subscribeToUpdates = useCallback((topics: string[]) => {
    sendJsonMessage({
      type: 'subscribe',
      topics
    })
  }, [sendJsonMessage])

  const unsubscribeFromUpdates = useCallback((topics: string[]) => {
    sendJsonMessage({
      type: 'unsubscribe',
      topics
    })
  }, [sendJsonMessage])

  return {
    connectionStatus,
    isConnected: connectionStatus === 'Open',
    subscribeToUpdates,
    unsubscribeFromUpdates
  }
}