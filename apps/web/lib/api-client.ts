import { QueryClient } from '@tanstack/react-query'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3011'

// Create a global query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Don't retry on 401/403 errors
        if (error?.status === 401 || error?.status === 403) {
          return false
        }
        return failureCount < 3
      },
    },
  },
})

// API Client with authentication handling
class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    
    // Initialize token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  getToken(): string | null {
    return this.token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const config: RequestInit = {
      ...options,
      headers,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        if (response.status === 401) {
          // Clear token on 401
          this.setToken(null)
          throw new Error('Authentication required')
        }
        
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return response.json()
      }
      
      return response.text() as T
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<{ access_token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    this.setToken(response.access_token)
    return response
  }

  async register(email: string, password: string, name: string) {
    return this.request<{ access_token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
  }

  async getCurrentUser() {
    return this.request<any>('/api/auth/me')
  }

  // Dashboard endpoints
  async getDashboardData() {
    return this.request<any>('/api/dashboard')
  }

  async getTodayEvents() {
    return this.request<any[]>('/api/events/today')
  }

  async getQuickCaptures() {
    return this.request<any[]>('/api/dashboard/quick-capture')
  }

  async createQuickCapture(content: string) {
    return this.request<any>('/api/dashboard/quick-capture', {
      method: 'POST',
      body: JSON.stringify({ content }),
    })
  }

  // Events endpoints
  async getEvents(params?: { pillar?: string; limit?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.pillar) searchParams.set('pillar', params.pillar)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    const query = searchParams.toString() ? `?${searchParams.toString()}` : ''
    return this.request<any[]>(`/api/events${query}`)
  }

  async createEvent(data: any) {
    return this.request<any>('/api/events', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Entities endpoints
  async getEntities(params?: { type?: string; limit?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.type) searchParams.set('type', params.type)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    const query = searchParams.toString() ? `?${searchParams.toString()}` : ''
    return this.request<any[]>(`/api/entities${query}`)
  }

  async createEntity(data: any) {
    return this.request<any>('/api/entities', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Memories endpoints
  async getMemories(params?: { limit?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    const query = searchParams.toString() ? `?${searchParams.toString()}` : ''
    return this.request<any[]>(`/api/memories${query}`)
  }

  async createMemory(data: any) {
    return this.request<any>('/api/memories', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Health endpoints
  async getHealthMetrics() {
    return this.request<any>('/api/health/metrics')
  }

  // Wealth endpoints
  async getWealthMetrics() {
    return this.request<any>('/api/wealth/metrics')
  }

  // Spirituality endpoints
  async getSpiritualityMetrics() {
    return this.request<any>('/api/spirituality/metrics')
  }

  // Analytics endpoints
  async getAnalytics(params?: { period?: string; pillar?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.period) searchParams.set('period', params.period)
    if (params?.pillar) searchParams.set('pillar', params.pillar)
    
    const query = searchParams.toString() ? `?${searchParams.toString()}` : ''
    return this.request<any>(`/api/analytics${query}`)
  }

  // Insights endpoints
  async getInsights(params?: { limit?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    const query = searchParams.toString() ? `?${searchParams.toString()}` : ''
    return this.request<any[]>(`/api/insights${query}`)
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL)

// Export types for better TypeScript support
export interface AuthResponse {
  access_token: string
  user: {
    id: string
    email: string
    name: string
  }
}

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