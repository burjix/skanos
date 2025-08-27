'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { format, subDays } from 'date-fns'
import {
  Archive,
  Search,
  Filter,
  Clock,
  Tag,
  Star,
  Brain,
  Lightbulb,
  FileText,
  Image,
  Video,
  Mic,
  Link,
  Calendar,
  MapPin,
  User,
  Zap
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Memory {
  id: string
  title: string
  content: string
  type: 'note' | 'idea' | 'image' | 'video' | 'audio' | 'link' | 'event'
  tags: string[]
  importance: number
  connections: string[]
  location?: string
  person?: string
  createdAt: Date
  lastAccessed: Date
  searchRelevance?: number
}

interface MemoryCluster {
  id: string
  name: string
  description: string
  memories: Memory[]
  theme: string
  color: string
}

// Mock memory data
const generateMemoryData = () => {
  const memories: Memory[] = [
    {
      id: '1',
      title: 'Next.js 15 Performance Insights',
      content: 'Discovered new optimization techniques using App Router and Turbopack. Performance improvements up to 40% in build times.',
      type: 'note',
      tags: ['development', 'performance', 'nextjs'],
      importance: 8,
      connections: ['2', '5'],
      createdAt: subDays(new Date(), 2),
      lastAccessed: new Date()
    },
    {
      id: '2',
      title: 'AI Architecture Patterns',
      content: 'Explored different approaches to integrating AI models into web applications. Key considerations: latency, cost, and accuracy.',
      type: 'idea',
      tags: ['ai', 'architecture', 'patterns'],
      importance: 9,
      connections: ['1', '3'],
      createdAt: subDays(new Date(), 5),
      lastAccessed: subDays(new Date(), 1)
    },
    {
      id: '3',
      title: 'Meeting with investors',
      content: 'Productive discussion about Series A funding. Key points: market validation, growth metrics, and team scaling.',
      type: 'event',
      tags: ['business', 'funding', 'growth'],
      importance: 10,
      connections: ['2'],
      location: 'Dubai Business Bay',
      person: 'John Smith',
      createdAt: subDays(new Date(), 7),
      lastAccessed: subDays(new Date(), 3)
    },
    {
      id: '4',
      title: 'Meditation Benefits Research',
      content: 'Studies show 20-minute daily meditation improves focus by 23% and reduces stress hormones by 15%.',
      type: 'note',
      tags: ['health', 'meditation', 'research'],
      importance: 7,
      connections: [],
      createdAt: subDays(new Date(), 10),
      lastAccessed: subDays(new Date(), 5)
    },
    {
      id: '5',
      title: 'SkanOS Architecture Diagram',
      content: 'System design for personal operating system with microservices architecture.',
      type: 'image',
      tags: ['architecture', 'system-design', 'skanos'],
      importance: 9,
      connections: ['1'],
      createdAt: subDays(new Date(), 15),
      lastAccessed: subDays(new Date(), 2)
    }
  ]

  const clusters: MemoryCluster[] = [
    {
      id: 'tech',
      name: 'Technology & Development',
      description: 'Programming insights, architecture patterns, and technical discoveries',
      memories: memories.filter(m => ['1', '2', '5'].includes(m.id)),
      theme: 'Technical Knowledge',
      color: '#3b82f6'
    },
    {
      id: 'business',
      name: 'Business & Strategy',
      description: 'Business meetings, strategic insights, and growth opportunities',
      memories: memories.filter(m => m.id === '3'),
      theme: 'Business Intelligence',
      color: '#10b981'
    },
    {
      id: 'personal',
      name: 'Personal Growth',
      description: 'Health, wellness, and personal development insights',
      memories: memories.filter(m => m.id === '4'),
      theme: 'Self Improvement',
      color: '#8b5cf6'
    }
  ]

  return { memories, clusters }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'note': return FileText
    case 'idea': return Lightbulb
    case 'image': return Image
    case 'video': return Video
    case 'audio': return Mic
    case 'link': return Link
    case 'event': return Calendar
    default: return FileText
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'note': return '#6b7280'
    case 'idea': return '#f59e0b'
    case 'image': return '#ef4444'
    case 'video': return '#8b5cf6'
    case 'audio': return '#10b981'
    case 'link': return '#3b82f6'
    case 'event': return '#f97316'
    default: return '#6b7280'
  }
}

export function MemoryPalace() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [selectedTab, setSelectedTab] = useState('timeline')

  const { data: memoryData } = useQuery({
    queryKey: ['memory-palace'],
    queryFn: () => generateMemoryData(),
    refetchInterval: 300000 // 5 minutes
  })

  if (!memoryData) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/10 rounded w-48"></div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const filteredMemories = memoryData.memories
    .filter(memory => 
      memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime())

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/10 border border-indigo-500/20">
            <Archive className="h-8 w-8 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Memory Palace</h1>
            <p className="text-muted-foreground">Your digital memory repository with semantic search</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {memoryData.memories.length} memories • {memoryData.clusters.length} clusters
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4"
      >
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search memories, ideas, and insights..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 py-6 text-lg glass border-white/10 bg-black/30"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Badge variant="outline" className="text-xs">
              <Brain className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </div>
        <Button variant="outline" className="glass border-white/10">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="glass border-white/10">
          <CardContent className="p-4 text-center">
            <Archive className="h-8 w-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold">{memoryData.memories.length}</div>
            <div className="text-sm text-muted-foreground">Total Memories</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-white/10">
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold">
              {memoryData.memories.reduce((sum, m) => sum + m.connections.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Connections</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-white/10">
          <CardContent className="p-4 text-center">
            <Tag className="h-8 w-8 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold">
              {new Set(memoryData.memories.flatMap(m => m.tags)).size}
            </div>
            <div className="text-sm text-muted-foreground">Unique Tags</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-white/10">
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold">
              {memoryData.memories.filter(m => m.importance >= 8).length}
            </div>
            <div className="text-sm text-muted-foreground">High Value</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="glass border-white/10">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="clusters">Clusters</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Memory List */}
            <div className="lg:col-span-3 space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                {filteredMemories.map((memory, index) => {
                  const TypeIcon = getTypeIcon(memory.type)
                  return (
                    <motion.div
                      key={memory.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card 
                        className="glass border-white/10 hover:border-white/20 transition-all cursor-pointer"
                        onClick={() => setSelectedMemory(memory)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div 
                                className="p-2 rounded-lg border"
                                style={{ 
                                  backgroundColor: `${getTypeColor(memory.type)}20`,
                                  borderColor: `${getTypeColor(memory.type)}40`
                                }}
                              >
                                <TypeIcon 
                                  className="h-4 w-4"
                                  style={{ color: getTypeColor(memory.type) }}
                                />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{memory.title}</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  <Clock className="h-3 w-3" />
                                  {format(memory.createdAt, 'MMM d, yyyy')}
                                  {memory.location && (
                                    <>
                                      <span>•</span>
                                      <MapPin className="h-3 w-3" />
                                      {memory.location}
                                    </>
                                  )}
                                  {memory.person && (
                                    <>
                                      <span>•</span>
                                      <User className="h-3 w-3" />
                                      {memory.person}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right text-sm">
                                <div className="text-yellow-400">★{memory.importance}</div>
                                <div className="text-muted-foreground">
                                  {memory.connections.length} links
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {memory.content}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {memory.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>

            {/* Sidebar - Memory Details */}
            <div className="space-y-6">
              {selectedMemory ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <Card className="glass border-white/10">
                    <CardHeader>
                      <CardTitle>Memory Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">{selectedMemory.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedMemory.content}
                        </p>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type</span>
                          <span className="capitalize">{selectedMemory.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Importance</span>
                          <span>{selectedMemory.importance}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Connections</span>
                          <span>{selectedMemory.connections.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Accessed</span>
                          <span>{format(selectedMemory.lastAccessed, 'MMM d')}</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Tags</div>
                        <div className="flex flex-wrap gap-1">
                          {selectedMemory.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card className="glass border-white/10">
                  <CardContent className="p-8 text-center">
                    <Archive className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Select a memory to view details
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="clusters" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {memoryData.clusters.map((cluster, index) => (
              <motion.div
                key={cluster.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-white/10 hover:border-white/20 transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: cluster.color }}
                      />
                      <CardTitle className="text-lg">{cluster.name}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {cluster.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Memories</span>
                        <span>{cluster.memories.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Theme</span>
                        <span>{cluster.theme}</span>
                      </div>
                      <div className="space-y-2">
                        {cluster.memories.slice(0, 3).map(memory => (
                          <div 
                            key={memory.id}
                            className="text-xs p-2 bg-black/20 rounded border border-white/5"
                          >
                            {memory.title}
                          </div>
                        ))}
                        {cluster.memories.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{cluster.memories.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="connections">
          <Card className="glass border-white/10">
            <CardContent className="p-8 text-center">
              <Brain className="h-16 w-16 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Memory Connections</h3>
              <p className="text-muted-foreground">Interactive connection visualization coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}