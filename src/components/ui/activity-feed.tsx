'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import {
    UserCheck,
    UserX,
    Moon,
    LogIn,
    Clock,
    ChevronDown,
    ChevronUp,
} from 'lucide-react'
import { getStatusLabel, type AttendanceStatus } from '@/components/shared/attendance-types'
import { useStatusStyles } from '@/components/shared/StatusColorProvider'
import type { StatusKey } from '@/types/admin'

interface ActivityItem {
    id: string
    type: 'attendance_change' | 'overnight_request' | 'entry_record'
    timestamp: string
    studentName: string
    studentNumber: string
    studentId: string
    details: {
        oldStatus?: AttendanceStatus
        newStatus?: AttendanceStatus
        period?: number
        location?: string
        requestType?: string
    }
}

interface ActivityFeedProps {
    items: ActivityItem[]
    className?: string
    loading?: boolean
    emptyMessage?: string
    onItemClick?: (item: ActivityItem) => void
    maxItems?: number
}

/**
 * Activity Feed - Real-time event timeline
 *
 * Usage:
 * <ActivityFeed
 *   items={activityItems}
 *   onItemClick={(item) => console.log(item)}
 * />
 */
export function ActivityFeed({
    items,
    className,
    loading = false,
    emptyMessage = '최근 활동이 없습니다',
    onItemClick,
    maxItems,
}: ActivityFeedProps) {
    const displayItems = maxItems ? items.slice(0, maxItems) : items

    if (loading) {
        return (
            <div className={cn('space-y-4', className)}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <ActivityItemSkeleton key={i} />
                ))}
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className={cn('py-12 text-center', className)}>
                <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className={cn('space-y-1', className)}>
            {displayItems.map((item, index) => (
                <ActivityItemCard
                    key={item.id}
                    item={item}
                    onClick={onItemClick ? () => onItemClick(item) : undefined}
                    isNew={index === 0}
                />
            ))}
        </div>
    )
}

interface ActivityItemCardProps {
    item: ActivityItem
    onClick?: () => void
    isNew?: boolean
}

function ActivityItemCard({ item, onClick, isNew }: ActivityItemCardProps) {
    const [isExpanded, setIsExpanded] = React.useState(false)
    const { styles } = useStatusStyles()

    const getIcon = () => {
        switch (item.type) {
            case 'attendance_change':
                if (item.details.newStatus === 'present') return <UserCheck className="h-4 w-4" />
                if (item.details.newStatus === 'overnight') return <Moon className="h-4 w-4" />
                if (item.details.newStatus === 'entry') return <LogIn className="h-4 w-4" />
                return <UserCheck className="h-4 w-4" />
            case 'overnight_request':
                return <Moon className="h-4 w-4" />
            case 'entry_record':
                return <LogIn className="h-4 w-4" />
            default:
                return <Clock className="h-4 w-4" />
        }
    }

    const getStatusColor = () => {
        if (item.type === 'attendance_change' && item.details.newStatus) {
            return styles[item.details.newStatus as StatusKey]?.dot ?? 'bg-gray-500'
        }
        if (item.type === 'overnight_request') return 'bg-purple-500'
        if (item.type === 'entry_record') return 'bg-amber-500'
        return 'bg-gray-500'
    }

    const getTitle = () => {
        switch (item.type) {
            case 'attendance_change':
                const status = item.details.newStatus
                return `${item.studentName} - ${getStatusLabel(status)}`
            case 'overnight_request':
                return `${item.studentName} - 외박 신청`
            case 'entry_record':
                return `${item.studentName} - 입실`
            default:
                return item.studentName
        }
    }

    const getSubtitle = () => {
        switch (item.type) {
            case 'attendance_change':
                return item.details.period ? `${item.details.period}교시` : ''
            case 'overnight_request':
                return item.details.requestType === 'overnight' ? '외박' : '외출'
            case 'entry_record':
                return item.details.location ?? ''
            default:
                return ''
        }
    }

    const timeAgo = formatDistanceToNow(new Date(item.timestamp), {
        addSuffix: true,
        locale: ko,
    })

    return (
        <div
            className={cn(
                'group relative rounded-xl border bg-card p-4 transition-all',
                'hover:shadow-sm',
                onClick && 'cursor-pointer',
                isNew && 'animate-in slide-in-from-top-2 duration-300'
            )}
            onClick={onClick}
        >
            <div className="flex items-start gap-3">
                {/* Status dot and icon */}
                <div className="relative">
                    <div
                        className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-full',
                            'bg-muted text-muted-foreground'
                        )}
                    >
                        {getIcon()}
                    </div>
                    <div
                        className={cn(
                            'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card',
                            getStatusColor()
                        )}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="text-sm font-medium">{getTitle()}</p>
                            <p className="text-xs text-muted-foreground">
                                {item.studentNumber} {getSubtitle() && `• ${getSubtitle()}`}
                            </p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {timeAgo}
                        </span>
                    </div>

                    {/* Expandable details */}
                    {isExpanded && (
                        <div className="mt-3 rounded-lg bg-muted/50 p-3 text-xs">
                            <div className="space-y-1">
                                {item.details.oldStatus && (
                                    <p>
                                        이전 상태:{' '}
                                        <span className="font-medium">
                                            {getStatusLabel(item.details.oldStatus)}
                                        </span>
                                    </p>
                                )}
                                {item.details.newStatus && (
                                    <p>
                                        변경 상태:{' '}
                                        <span className="font-medium">
                                            {getStatusLabel(item.details.newStatus)}
                                        </span>
                                    </p>
                                )}
                                {item.details.location && (
                                    <p>
                                        장소: <span className="font-medium">{item.details.location}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Expand button */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsExpanded(!isExpanded)
                    }}
                    className={cn(
                        'rounded-md p-1.5 text-muted-foreground',
                        'hover:bg-muted hover:text-foreground',
                        'transition-colors'
                    )}
                >
                    {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </button>
            </div>
        </div>
    )
}

function ActivityItemSkeleton() {
    return (
        <div className="rounded-xl border bg-card p-4 animate-pulse">
            <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 rounded bg-muted" />
                    <div className="h-3 w-24 rounded bg-muted" />
                </div>
                <div className="h-3 w-16 rounded bg-muted" />
            </div>
        </div>
    )
}

export type { ActivityItem }
