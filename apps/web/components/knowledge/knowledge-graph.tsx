'use client'

import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import * as d3 from 'd3'
import {
  Network,
  Search,
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Users,
  MapPin,
  Lightbulb,
  Briefcase,
  Play,
  Pause,
  Settings
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface Node extends d3.SimulationNodeDatum {
  id: string
  name: string
  type: 'person' | 'place' | 'idea' | 'project' | 'event'
  description: string
  importance: number
  connections: number
  lastUpdated: Date
}

interface Link {
  source: string
  target: string
  strength: number
  type: 'knows' | 'located_at' | 'related_to' | 'worked_on' | 'part_of'
}

interface GraphData {
  nodes: Node[]
  links: Link[]
}

// Mock knowledge graph data
const generateKnowledgeGraph = (): GraphData => {
  const nodes: Node[] = [
    {
      id: '1',
      name: 'Skander',
      type: 'person',
      description: 'Software engineer and entrepreneur',
      importance: 10,
      connections: 8,
      lastUpdated: new Date()
    },
    {
      id: '2',
      name: 'G8nie Platform',
      type: 'project',
      description: 'AI-powered development platform',
      importance: 9,
      connections: 6,
      lastUpdated: new Date()
    },
    {
      id: '3',
      name: 'Dubai',
      type: 'place',
      description: 'Current residence and business hub',
      importance: 8,
      connections: 5,
      lastUpdated: new Date()
    },
    {
      id: '4',
      name: 'Machine Learning',
      type: 'idea',
      description: 'Core technology and area of expertise',
      importance: 9,
      connections: 7,
      lastUpdated: new Date()
    },
    {
      id: '5',
      name: 'SkanOS',
      type: 'project',
      description: 'Personal operating system and digital brain',
      importance: 8,
      connections: 4,
      lastUpdated: new Date()
    },
    {
      id: '6',
      name: 'Team Member A',
      type: 'person',
      description: 'Frontend developer on G8nie team',
      importance: 6,
      connections: 3,
      lastUpdated: new Date()
    },
    {
      id: '7',
      name: 'OpenAI API',
      type: 'idea',
      description: 'AI integration technology',
      importance: 7,
      connections: 4,
      lastUpdated: new Date()
    },
    {
      id: '8',
      name: 'Tech Conference 2024',
      type: 'event',
      description: 'Annual technology conference',
      importance: 5,
      connections: 3,
      lastUpdated: new Date()
    }
  ]

  const links: Link[] = [
    { source: '1', target: '2', strength: 10, type: 'worked_on' },
    { source: '1', target: '3', strength: 8, type: 'located_at' },
    { source: '1', target: '4', strength: 9, type: 'related_to' },
    { source: '1', target: '5', strength: 10, type: 'worked_on' },
    { source: '1', target: '6', strength: 7, type: 'knows' },
    { source: '2', target: '4', strength: 8, type: 'related_to' },
    { source: '2', target: '7', strength: 6, type: 'part_of' },
    { source: '4', target: '7', strength: 7, type: 'related_to' },
    { source: '5', target: '4', strength: 6, type: 'related_to' },
    { source: '6', target: '2', strength: 8, type: 'worked_on' },
    { source: '3', target: '8', strength: 5, type: 'located_at' }
  ]

  return { nodes, links }
}

const getNodeColor = (type: string) => {
  switch (type) {
    case 'person': return '#3b82f6'
    case 'place': return '#10b981'
    case 'idea': return '#f59e0b'
    case 'project': return '#8b5cf6'
    case 'event': return '#ef4444'
    default: return '#6b7280'
  }
}

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'person': return Users
    case 'place': return MapPin
    case 'idea': return Lightbulb
    case 'project': return Briefcase
    case 'event': return Play
    default: return Network
  }
}

export function KnowledgeGraph() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const simulationRef = useRef<any>(null)

  const { data: graphData } = useQuery({
    queryKey: ['knowledge-graph'],
    queryFn: () => generateKnowledgeGraph(),
    refetchInterval: 300000 // 5 minutes
  })

  useEffect(() => {
    if (!graphData || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 800
    const height = 600

    const simulation = d3
      .forceSimulation(graphData.nodes as any)
      .force('link', d3.forceLink(graphData.links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))

    simulationRef.current = simulation

    // Create links
    const link = svg
      .append('g')
      .selectAll('line')
      .data(graphData.links)
      .enter()
      .append('line')
      .attr('stroke', '#ffffff20')
      .attr('stroke-width', (d) => Math.sqrt(d.strength))

    // Create nodes
    const node = svg
      .append('g')
      .selectAll('circle')
      .data(graphData.nodes)
      .enter()
      .append('circle')
      .attr('r', (d) => 5 + d.importance)
      .attr('fill', (d) => getNodeColor(d.type))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .call(d3.drag<SVGCircleElement, Node>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        })
      )

    // Add labels
    const label = svg
      .append('g')
      .selectAll('text')
      .data(graphData.nodes)
      .enter()
      .append('text')
      .text((d) => d.name)
      .attr('font-size', 12)
      .attr('fill', '#ffffff')
      .attr('text-anchor', 'middle')
      .attr('dy', -20)

    // Node click handler
    node.on('click', (event, d) => {
      setSelectedNode(d)
    })

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y)

      label
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y)
    })

    return () => {
      simulation.stop()
    }
  }, [graphData])

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      1.5
    )
  }

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      0.75
    )
  }

  const handleReset = () => {
    if (simulationRef.current) {
      simulationRef.current.alpha(1).restart()
    }
  }

  const toggleSimulation = () => {
    if (simulationRef.current) {
      if (isSimulating) {
        simulationRef.current.stop()
      } else {
        simulationRef.current.restart()
      }
      setIsSimulating(!isSimulating)
    }
  }

  const filteredNodes = graphData?.nodes.filter(node =>
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (!graphData) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/10 rounded w-48"></div>
          <div className="h-96 bg-white/10 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-600/10 border border-blue-500/20">
            <Network className="h-8 w-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Knowledge Graph</h1>
            <p className="text-muted-foreground">Explore connections in your digital brain</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={toggleSimulation}>
            {isSimulating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search entities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass border-white/10"
          />
        </div>
        <Button variant="outline" size="sm" className="glass border-white/10">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Graph Visualization */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Entity Network</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{graphData.nodes.length} nodes</span>
                    <span>•</span>
                    <span>{graphData.links.length} connections</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <svg
                    ref={svgRef}
                    width="800"
                    height="600"
                    className="border border-white/10 rounded-lg bg-black/30"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Node Info */}
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {(() => {
                      const Icon = getNodeIcon(selectedNode.type)
                      return <Icon className="h-5 w-5" style={{ color: getNodeColor(selectedNode.type) }} />
                    })()}
                    {selectedNode.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Badge variant="outline" className="capitalize">
                    {selectedNode.type}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {selectedNode.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Importance</div>
                      <div className="font-medium">{selectedNode.importance}/10</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Connections</div>
                      <div className="font-medium">{selectedNode.connections}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Entity Types */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle>Entity Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: 'person', count: graphData.nodes.filter(n => n.type === 'person').length },
                    { type: 'project', count: graphData.nodes.filter(n => n.type === 'project').length },
                    { type: 'idea', count: graphData.nodes.filter(n => n.type === 'idea').length },
                    { type: 'place', count: graphData.nodes.filter(n => n.type === 'place').length },
                    { type: 'event', count: graphData.nodes.filter(n => n.type === 'event').length }
                  ].map(({ type, count }) => {
                    const Icon = getNodeIcon(type)
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon 
                            className="h-4 w-4" 
                            style={{ color: getNodeColor(type) }}
                          />
                          <span className="capitalize text-sm">{type}s</span>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search Results */}
          {searchTerm && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle>Search Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {filteredNodes.slice(0, 5).map(node => {
                      const Icon = getNodeIcon(node.type)
                      return (
                        <div
                          key={node.id}
                          className="flex items-center gap-2 p-2 rounded hover:bg-white/5 cursor-pointer"
                          onClick={() => setSelectedNode(node)}
                        >
                          <Icon 
                            className="h-4 w-4" 
                            style={{ color: getNodeColor(node.type) }}
                          />
                          <span className="text-sm">{node.name}</span>
                        </div>
                      )
                    })}
                    {filteredNodes.length === 0 && (
                      <p className="text-sm text-muted-foreground">No matches found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}