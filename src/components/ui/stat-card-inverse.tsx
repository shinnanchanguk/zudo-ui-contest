'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const inverseStatCardVariants = cva('bg-card rounded-xl border border-border text-center shadow-sm', {
  variants: {
    variant: {
      primary: '',
      success: '',
      warning: '',
      danger: '',
      info: '',
      purple: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

interface InverseStatCardProps extends VariantProps<typeof inverseStatCardVariants> {
  title: React.ReactNode
  value: string | number
  className?: string
  size?: 'md' | 'sm'
  valueClassName?: string
}

const sizeStyles = {
  md: {
    container: 'p-4',
    value: 'text-5xl mb-1',
    title: 'text-base',
  },
  sm: {
    container: 'p-3',
    value: 'text-3xl mb-0',
    title: 'text-sm',
  },
}

export function InverseStatCard({ title, value, variant, className, size = 'md', valueClassName }: InverseStatCardProps) {
  const sizeClass = sizeStyles[size]
  return (
    <div className={cn(inverseStatCardVariants({ variant }), sizeClass.container, className)}>
      <div
        className={cn(
          'stat-value font-black text-slate-900 dark:text-slate-50',
          sizeClass.value,
          valueClassName
        )}
      >
        {value}
      </div>
      <div className={cn('font-semibold text-slate-900 dark:text-slate-50', sizeClass.title)}>{title}</div>
    </div>
  )
}
