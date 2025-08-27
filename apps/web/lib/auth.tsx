'use client'

import React from 'react'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './api-client'
import type { LoginRequest } from '@skanos/shared'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthStore {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  logout: () => void
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'skanos-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export function useAuth() {
  const { token, user, setAuth, logout: storeLogout } = useAuthStore()
  const queryClient = useQueryClient()

  // Initialize API client token when auth store changes
  React.useEffect(() => {
    apiClient.setToken(token)
  }, [token])

  const { isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiClient.getCurrentUser(),
    enabled: !!token && !user,
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => apiClient.login(data.email, data.password),
    onSuccess: (data) => {
      setAuth(data.access_token, data.user)
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const logout = () => {
    apiClient.setToken(null)
    storeLogout()
    queryClient.clear()
  }

  return {
    user,
    token,
    isLoading: isLoading && !!token,
    login: loginMutation.mutate,
    loginError: loginMutation.error?.message,
    isLoggingIn: loginMutation.isPending,
    logout,
  }
}