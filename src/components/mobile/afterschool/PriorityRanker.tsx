// @ts-nocheck
'use client'

import { useCallback, useState } from 'react'
import { ChevronUp, ChevronDown, Users, Clock, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isActiveApplicationStatus, useUpdateApplicationPriorities } from '@/hooks/useStudentApplications'
import { toast } from 'sonner'

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

interface StudentApplication {
    id: string
    priority: number | null
    status: string | null
    class_id: string | null
    class: {
        id: string
        name: string
        teacher_name: string | null
        schedules: unknown
    } | null
}

interface PriorityRankerProps {
    applications: StudentApplication[]
    studentId: string
    onPrioritiesChanged: () => void
}

function getScheduleText(rawSchedules: unknown): string | null {
    if (!rawSchedules || !Array.isArray(rawSchedules) || rawSchedules.length === 0) return null
    const schedules = rawSchedules as { day_of_week: number; period: number }[]

    const byDay = new Map<number, number[]>()
    schedules.forEach(s => {
        const periods = byDay.get(s.day_of_week) || []
        periods.push(s.period)
        byDay.set(s.day_of_week, periods.sort())
    })

    return Array.from(byDay.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([day, periods]) => `${DAY_NAMES[day]} ${periods.join(',')}교시`)
        .join(' / ')
}

export function PriorityRanker({
    applications,
    studentId,
    onPrioritiesChanged,
}: PriorityRankerProps) {
    const updatePriorities = useUpdateApplicationPriorities()
    const [localOrder, setLocalOrder] = useState<string[] | null>(null)

    // 활성 신청만 필터링 후 우선순위 정렬
    const sortedApps = (() => {
        const active = applications.filter(a => isActiveApplicationStatus(a.status) && a.class !== null)

        if (localOrder) {
            // localOrder에 따라 정렬
            return [...active].sort((a, b) => {
                const idxA = localOrder.indexOf(a.id)
                const idxB = localOrder.indexOf(b.id)
                if (idxA === -1 && idxB === -1) return 0
                if (idxA === -1) return 1
                if (idxB === -1) return -1
                return idxA - idxB
            })
        }

        // priority 기준 정렬
        return [...active].sort((a, b) => {
            const pa = a.priority ?? 999
            const pb = b.priority ?? 999
            return pa - pb
        })
    })()

    const savePriorities = useCallback(async (orderedApps: StudentApplication[]) => {
        const priorities = orderedApps.map((app, index) => ({
            id: app.id,
            priority: index + 1,
        }))

        try {
            await updatePriorities.mutateAsync({
                priorities,
                studentId,
            })
            onPrioritiesChanged()
        } catch {
            toast.error('우선순위 저장에 실패했습니다')
        }
    }, [updatePriorities, studentId, onPrioritiesChanged])

    const moveItem = useCallback((index: number, direction: 'up' | 'down') => {
        const newOrder = [...sortedApps]
        const targetIndex = direction === 'up' ? index - 1 : index + 1

        if (targetIndex < 0 || targetIndex >= newOrder.length) return

        // 교환
        const temp = newOrder[index]
        newOrder[index] = newOrder[targetIndex]
        newOrder[targetIndex] = temp

        // localOrder 업데이트 (즉시 UI 반영)
        setLocalOrder(newOrder.map(a => a.id))

        // 서버 저장
        savePriorities(newOrder).then(() => {
            // 성공하면 localOrder 초기화 (실시간 구독이 새 데이터를 가져올 것)
            setLocalOrder(null)
        })
    }, [sortedApps, savePriorities])

    if (sortedApps.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 text-sm">
                신청한 프로그램이 없습니다
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">
                    우선순위 ({sortedApps.length}개)
                </h3>
                {updatePriorities.isPending && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        저장 중
                    </div>
                )}
            </div>

            {sortedApps.map((app, index) => {
                const scheduleText = getScheduleText(app.class?.schedules)
                const isFirst = index === 0
                const isLast = index === sortedApps.length - 1

                return (
                    <div
                        key={app.id}
                        className={cn(
                            'flex items-center gap-2 rounded-xl border bg-white p-3 transition-colors',
                            'border-gray-200'
                        )}
                    >
                        {/* 순위 표시 */}
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                            <span className="text-sm font-bold text-indigo-600">
                                {index + 1}
                            </span>
                        </div>

                        {/* 프로그램 정보 */}
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate text-sm">
                                {app.class?.name}
                            </p>
                            <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                                {app.class?.teacher_name && (
                                    <span className="inline-flex items-center gap-0.5 text-xs text-gray-500">
                                        <Users className="h-3 w-3" />
                                        {app.class.teacher_name}
                                    </span>
                                )}
                                {scheduleText && (
                                    <span className="inline-flex items-center gap-0.5 text-xs text-gray-500">
                                        <Clock className="h-3 w-3" />
                                        {scheduleText}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* 이동 버튼 */}
                        <div className="flex flex-col gap-0.5 flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => moveItem(index, 'up')}
                                disabled={isFirst || updatePriorities.isPending}
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                                    isFirst
                                        ? 'text-gray-300'
                                        : 'text-gray-600 bg-gray-100 active:bg-indigo-100 active:text-indigo-600'
                                )}
                                aria-label="위로 이동"
                            >
                                <ChevronUp className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => moveItem(index, 'down')}
                                disabled={isLast || updatePriorities.isPending}
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                                    isLast
                                        ? 'text-gray-300'
                                        : 'text-gray-600 bg-gray-100 active:bg-indigo-100 active:text-indigo-600'
                                )}
                                aria-label="아래로 이동"
                            >
                                <ChevronDown className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )
            })}

            <p className="text-xs text-gray-400 text-center mt-2">
                화살표 버튼으로 희망 순위를 조정하세요
            </p>
        </div>
    )
}
