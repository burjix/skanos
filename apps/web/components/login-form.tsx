'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const { login, isLoggingIn, loginError } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({ email, password, ...(otpCode && { otpCode }) })
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <Card className="w-[400px] glass border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              SkanOS
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Personal Operating System
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-black/50 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-black/50 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="OTP Code (optional)"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength={6}
                  className="bg-black/50 border-white/10"
                />
              </div>
              
              {loginError && (
                <p className="text-red-400 text-sm text-center">{loginError}</p>
              )}
              
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}