'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

  const { isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      if (!token) throw new Error('No token')
      
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }
      
      return response.json()
    },
    enabled: !!token && !user,
  })

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }
      
      return response.json()
    },
    onSuccess: (data) => {
      setAuth(data.access_token, data.user)
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const logout = () => {
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