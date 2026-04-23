'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const statCardVariants = cva(
    'bg-card rounded-xl border shadow-sm flex flex-col',
    {
        variants: {
            size: {
                default: 'p-6',
                sm: 'p-4',
                lg: 'p-8',
            },
        },
        defaultVariants: {
            size: 'default',
        },
    }
)

const statValueVariants = cva('text-4xl font-extrabold tracking-tight', {
    variants: {
        variant: {
            default: 'text-primary',
            warning: 'text-yellow-500',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
})

const statTitleVariants = cva('text-lg font-bold', {
    variants: {
        variant: {
            default: 'text-muted-foreground',
            warning: 'text-yellow-600',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
})

interface StatCardProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof statCardVariants>,
        VariantProps<typeof statValueVariants> {
    title: string
    value: string | number
    trend?: {
        value: number
        direction: 'up' | 'down' | 'stable'
        label?: string
    }
    icon?: React.ReactNode
    loading?: boolean
}

/**
 * Stat Card - Typography Focus Design
 *
 * Design based on statistics-card-preview #2 "98% Attendance Rate"
 * - Large, bold value in primary color
 * - Small label below value
 * - Clean card with subtle shadow
 *
 * Usage:
 * <StatCard
 *   title="출석률"
 *   value="92%"
 *   trend={{ value: 5, direction: 'up', label: '전주 대비' }}
 *   icon={<Users />}
 * />
 */
export function StatCard({
    title,
    value,
    trend,
    icon,
    loading = false,
    size,
    variant,
    className,
    ...props
}: StatCardProps) {
    return (
        <div
            className={cn(statCardVariants({ size, className }))}
            {...props}
        >
            {/* Loading skeleton */}
            {loading ? (
                <div className="space-y-3 animate-pulse">
                    <div className="h-10 w-20 rounded bg-muted" />
                    <div className="h-5 w-24 rounded bg-muted" />
                </div>
            ) : (
                <>
                    {/* Value + Icon Row */}
                    <div className="flex items-start justify-between">
                        <p className={statValueVariants({ variant })}>
                            {value}
                        </p>
                        {icon && (
                            <div className="rounded-lg bg-muted/50 p-2.5 text-muted-foreground">
                                {icon}
                            </div>
                        )}
                    </div>

                    {/* Title + Trend Row */}
                    <div className="flex items-center gap-2 mt-1">
                        <p className={statTitleVariants({ variant })}>
                            {title}
                        </p>
                        {trend && (
                            <span
                                className={cn(
                                    'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium',
                                    trend.direction === 'up' && 'bg-green-100 text-green-700',
                                    trend.direction === 'down' && 'bg-red-100 text-red-700',
                                    trend.direction === 'stable' && 'bg-gray-100 text-gray-700'
                                )}
                            >
                                {trend.direction === 'up' && <TrendingUp className="h-3 w-3" />}
                                {trend.direction === 'down' && <TrendingDown className="h-3 w-3" />}
                                {trend.direction === 'stable' && <Minus className="h-3 w-3" />}
                                {trend.value > 0 ? '+' : ''}{trend.value}%
                            </span>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

interface StatCardGridProps {
    children: React.ReactNode
    className?: string
    columns?: 2 | 3 | 4
}

/**
 * Grid wrapper for StatCards
 */
export function StatCardGrid({ children, className, columns = 4 }: StatCardGridProps) {
    const gridCols = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    }

    return (
        <div className={cn('grid gap-4', gridCols[columns], className)}>
            {children}
        </div>
    )
}

export { statCardVariants }
