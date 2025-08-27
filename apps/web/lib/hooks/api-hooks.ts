import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { DashboardData } from '@/lib/api-client'

// Auth hooks
export const useAuth = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiClient.getCurrentUser(),
    enabled: !!apiClient.getToken(),
    retry: false,
  })
}

export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiClient.login(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], data.user)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: ({ email, password, name }: { email: string; password: string; name: string }) =>
      apiClient.register(email, password, name),
  })
}

// Dashboard hooks
export const useDashboardData = () => {
  return useQuery<DashboardData>({
    queryKey: ['dashboard', 'data'],
    queryFn: () => apiClient.getDashboardData(),
    enabled: !!apiClient.getToken(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export const useTodayEvents = () => {
  return useQuery({
    queryKey: ['events', 'today'],
    queryFn: () => apiClient.getTodayEvents(),
    enabled: !!apiClient.getToken(),
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  })
}

export const useQuickCaptures = () => {
  return useQuery({
    queryKey: ['dashboard', 'quick-captures'],
    queryFn: () => apiClient.getQuickCaptures(),
    enabled: !!apiClient.getToken(),
  })
}

export const useCreateQuickCapture = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (content: string) => apiClient.createQuickCapture(content),
    onSuccess: () => {
      // Invalidate and refetch related data
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'quick-captures'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'data'] })
      queryClient.invalidateQueries({ queryKey: ['events', 'today'] })
    },
  })
}

// Events hooks
export const useEvents = (params?: { pillar?: string; limit?: number }) => {
  return useQuery({
    queryKey: ['events', 'list', params],
    queryFn: () => apiClient.getEvents(params),
    enabled: !!apiClient.getToken(),
  })
}

export const useCreateEvent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: any) => apiClient.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// Entities hooks
export const useEntities = (params?: { type?: string; limit?: number }) => {
  return useQuery({
    queryKey: ['entities', 'list', params],
    queryFn: () => apiClient.getEntities(params),
    enabled: !!apiClient.getToken(),
  })
}

export const useCreateEntity = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: any) => apiClient.createEntity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// Memories hooks
export const useMemories = (params?: { limit?: number }) => {
  return useQuery({
    queryKey: ['memories', 'list', params],
    queryFn: () => apiClient.getMemories(params),
    enabled: !!apiClient.getToken(),
  })
}

export const useCreateMemory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: any) => apiClient.createMemory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// Health hooks
export const useHealthMetrics = () => {
  return useQuery({
    queryKey: ['health', 'metrics'],
    queryFn: () => apiClient.getHealthMetrics(),
    enabled: !!apiClient.getToken(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

// Wealth hooks
export const useWealthMetrics = () => {
  return useQuery({
    queryKey: ['wealth', 'metrics'],
    queryFn: () => apiClient.getWealthMetrics(),
    enabled: !!apiClient.getToken(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

// Spirituality hooks
export const useSpiritualityMetrics = () => {
  return useQuery({
    queryKey: ['spirituality', 'metrics'],
    queryFn: () => apiClient.getSpiritualityMetrics(),
    enabled: !!apiClient.getToken(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

// Analytics hooks
export const useAnalytics = (params?: { period?: string; pillar?: string }) => {
  return useQuery({
    queryKey: ['analytics', params],
    queryFn: () => apiClient.getAnalytics(params),
    enabled: !!apiClient.getToken(),
    staleTime: 1000 * 60 * 15, // 15 minutes
  })
}

// Insights hooks
export const useInsights = (params?: { limit?: number }) => {
  return useQuery({
    queryKey: ['insights', 'list', params],
    queryFn: () => apiClient.getInsights(params),
    enabled: !!apiClient.getToken(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}