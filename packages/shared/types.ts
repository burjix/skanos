import { z } from 'zod'

// Authentication Types
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  otpCode: z.string().length(6).optional()
})

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2)
})

export type LoginRequest = z.infer<typeof LoginSchema>
export type RegisterRequest = z.infer<typeof RegisterSchema>

// Event Types
export const EventSchema = z.object({
  type: z.string(),
  title: z.string(),
  description: z.string().optional(),
  data: z.record(z.any()),
  source: z.string().default('web'),
  priority: z.number().default(0)
})

export type CreateEventRequest = z.infer<typeof EventSchema>

// Quick Capture Types
export const QuickCaptureSchema = z.object({
  content: z.string().min(1)
})

export type QuickCaptureRequest = z.infer<typeof QuickCaptureSchema>

// Entity Types
export const EntitySchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string().optional(),
  metadata: z.record(z.any()).default({})
})

export type CreateEntityRequest = z.infer<typeof EntitySchema>

// Memory Types
export const MemorySchema = z.object({
  content: z.string(),
  type: z.enum(['episodic', 'semantic', 'working']).default('episodic'),
  importance: z.number().min(0).max(1).default(0.5),
  entityId: z.string().optional()
})

export type CreateMemoryRequest = z.infer<typeof MemorySchema>

// Dashboard Types
export interface DashboardData {
  todayEvents: Array<{
    id: string
    type: string
    title: string
    description?: string
    createdAt: string
  }>
  quickStats: {
    totalEvents: number
    entitiesCount: number
    memoriesCount: number
    insightsCount: number
  }
  recentInsights: Array<{
    id: string
    title: string
    content: string
    confidence: number
    createdAt: string
  }>
  pillars: Array<{
    id: string
    name: string
    color: string
    icon?: string
  }>
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}