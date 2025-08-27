'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  Home, 
  Heart, 
  DollarSign, 
  Sparkles, 
  Network, 
  Archive, 
  TrendingUp, 
  BarChart3,
  Menu,
  X,
  Search
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'Your daily command center'
  },
  {
    name: 'Health',
    href: '/health',
    icon: Heart,
    description: 'Sleep, fitness, energy tracking'
  },
  {
    name: 'Wealth',
    href: '/wealth',
    icon: DollarSign,
    description: 'Financial health & goals'
  },
  {
    name: 'Spirituality',
    href: '/spirituality',
    icon: Sparkles,
    description: 'Meditation, journaling, growth'
  },
  {
    name: 'Knowledge',
    href: '/knowledge',
    icon: Network,
    description: 'Entity relationships & graph'
  },
  {
    name: 'Memories',
    href: '/memories',
    icon: Archive,
    description: 'Semantic search & insights'
  },
  {
    name: 'Insights',
    href: '/insights',
    icon: TrendingUp,
    description: 'AI-powered pattern recognition'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Deep data visualization'
  }
]

interface NavigationProps {
  children: React.ReactNode
}

export function Navigation({ children }: NavigationProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="glass border-white/10"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="fixed inset-y-0 left-0 z-40 w-72 bg-black/90 backdrop-blur-xl border-r border-white/10 lg:block hidden"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/10">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">SkanOS</h1>
                <p className="text-xs text-muted-foreground">Personal Operating System</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 py-4">
            <Button
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-white glass border-white/10"
            >
              <Search className="h-4 w-4 mr-3" />
              Search everything...
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-4">
            <div className="space-y-1">
              {navigation.map((item: any) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link key={item.name} href={item.href}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                        isActive 
                          ? 'bg-white/10 text-white border border-white/20' 
                          : 'text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                      )}
                    >
                      <Icon className={cn(
                        'mr-3 h-5 w-5 transition-colors',
                        isActive ? 'text-white' : 'text-muted-foreground group-hover:text-white'
                      )} />
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 group-hover:text-white/70">
                          {item.description}
                        </div>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                        />
                      )}
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="text-xs text-muted-foreground text-center">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="absolute left-0 top-0 h-full w-72 bg-black border-r border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile navigation content - same as desktop */}
              <div className="flex flex-col h-full">
                <div className="flex items-center px-6 py-6 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/10">
                      <Brain className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold">SkanOS</h1>
                      <p className="text-xs text-muted-foreground">Personal Operating System</p>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-4">
                  <Button
                    variant="ghost" 
                    className="w-full justify-start text-muted-foreground hover:text-white glass border-white/10"
                  >
                    <Search className="h-4 w-4 mr-3" />
                    Search everything...
                  </Button>
                </div>

                <nav className="flex-1 px-4 pb-4">
                  <div className="space-y-1">
                    {navigation.map((item: any) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      
                      return (
                        <Link key={item.name} href={item.href} onClick={() => setSidebarOpen(false)}>
                          <div
                            className={cn(
                              'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                              isActive 
                                ? 'bg-white/10 text-white border border-white/20' 
                                : 'text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                            )}
                          >
                            <Icon className={cn(
                              'mr-3 h-5 w-5 transition-colors',
                              isActive ? 'text-white' : 'text-muted-foreground group-hover:text-white'
                            )} />
                            <div className="flex-1">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-muted-foreground mt-0.5 group-hover:text-white/70">
                                {item.description}
                              </div>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </nav>

                <div className="p-4 border-t border-white/10">
                  <div className="text-xs text-muted-foreground text-center">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="lg:pl-72">
        {children}
      </div>
    </div>
  )
}