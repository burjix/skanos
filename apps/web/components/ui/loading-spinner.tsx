'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  variant?: 'default' | 'dots' | 'pulse' | 'bounce'
}

export function LoadingSpinner({ 
  size = 'md', 
  className, 
  variant = 'default' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  if (variant === 'dots') {
    return (
      <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2].map((i: any) => (
          <motion.div
            key={i}
            className={cn(
              "rounded-full bg-white/60",
              size === 'sm' ? 'h-2 w-2' : size === 'lg' ? 'h-4 w-4' : 'h-3 w-3'
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={cn(
          "rounded-full bg-white/20 flex items-center justify-center",
          sizeClasses[size],
          className
        )}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.div
          className={cn(
            "rounded-full bg-white/60",
            size === 'sm' ? 'h-2 w-2' : size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'
          )}
          animate={{
            scale: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    )
  }

  if (variant === 'bounce') {
    return (
      <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2].map((i: any) => (
          <motion.div
            key={i}
            className={cn(
              "rounded-full bg-white/60",
              size === 'sm' ? 'h-2 w-2' : size === 'lg' ? 'h-4 w-4' : 'h-3 w-3'
            )}
            animate={{
              y: ["0%", "-100%", "0%"]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
      </div>
    )
  }

  // Default spinner
  return (
    <motion.div
      className={cn(
        "border-2 border-white/20 border-t-white rounded-full",
        sizeClasses[size],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  )
}