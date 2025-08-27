'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle, Zap } from 'lucide-react'

export function QuickCapture() {
  const [content, setContent] = useState('')
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const captureMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch('/api/dashboard/quick-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to capture')
      }
      
      return response.json()
    },
    onSuccess: () => {
      setContent('')
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      captureMutation.mutate(content)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      if (content.trim()) {
        captureMutation.mutate(content)
      }
    }
  }

  return (
    <Card className="glass border-white/10 glow">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400" />
          Quick Capture
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Capture anything... thoughts, ideas, observations, goals, or daily experiences. Press Cmd+Enter to save."
            className="bg-black/50 border-white/10 min-h-[100px] resize-none focus:ring-1 focus:ring-white/20"
            disabled={captureMutation.isPending}
          />
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              Cmd+Enter to capture
            </span>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="submit"
                disabled={!content.trim() || captureMutation.isPending}
                className="bg-white text-black hover:bg-gray-200 transition-colors"
              >
                {captureMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Capture
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}