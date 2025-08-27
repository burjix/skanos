'use client'

import { useAuth } from '@/lib/auth'
import { LoginForm } from '@/components/login-form'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, Settings, User } from 'lucide-react'
import { motion } from 'framer-motion'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-8 w-8 border-2 border-white/20 border-t-white rounded-full"
        />
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <Navigation>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex-1" />
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {user?.name || user?.email}
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-white"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                
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

        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </Navigation>
  )
}