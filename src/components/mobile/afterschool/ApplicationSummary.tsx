// @ts-nocheck
'use client'

import { useMemo } from 'react'
import { BookOpen, AlertTriangle, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'
import { checkScheduleConflicts, isActiveApplicationStatus } from '@/hooks/useStudentApplications'

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']
const DAYS_IN_WEEK = [1, 2, 3, 4, 5] // 월~금
const PERIODS = [1, 2, 3, 4]

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
        schedule_mode?: string | null
        specific_dates?: unknown
        periods_per_session?: number | null
    } | null
}

interface ApplicationSummaryProps {
    applications: StudentApplication[]
}

export function ApplicationSummary({ applications }: ApplicationSummaryProps) {
    // 활성 신청만 필터링
    const activeApps = useMemo(() => {
        return applications
            .filter(a => isActiveApplicationStatus(a.status) && a.class !== null)
            .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
    }, [applications])

    // 충돌 수 계산
    const conflictCount = useMemo(() => {
        if (activeApps.length < 2) return 0

        const classIds = activeApps.map(a => a.class_id!).filter(Boolean)
        const programs = activeApps
            .filter((a): a is typeof a & { class: NonNullable<typeof a.class> } => a.class !== null)
            .map(a => ({
                id: a.class.id,
                schedule_mode: (a.class.schedule_mode as 'recurring' | 'specific' | 'specific_dates' | null) ?? 'recurring',
                schedules: a.class.schedules as { day_of_week: number; period: number }[] | null,
                specific_dates: a.class.specific_dates as { date: string; period: number }[] | null,
                periods_per_session: a.class.periods_per_session ?? null,
            }))

        const result = checkScheduleConflicts(classIds, programs)
        return result.conflicts.length
    }, [activeApps])

    // 주간 시간표 그리드 데이터 계산
    const scheduleGrid = useMemo(() => {
        const grid: Map<string, { name: string; color: string }> = new Map()

        const colors = [
            'bg-indigo-200 text-indigo-800',
            'bg-pink-200 text-pink-800',
            'bg-emerald-200 text-emerald-800',
            'bg-amber-200 text-amber-800',
            'bg-sky-200 text-sky-800',
            'bg-violet-200 text-violet-800',
            'bg-rose-200 text-rose-800',
            'bg-teal-200 text-teal-800',
        ]

        activeApps.forEach((app, idx) => {
            const rawSchedules = app.class?.schedules
            if (!rawSchedules || !Array.isArray(rawSchedules)) return
            const schedules = rawSchedules as { day_of_week: number; period: number }[]
            const periodsPerSession = app.class?.periods_per_session === 2 ? 2 : 1

            schedules.forEach(s => {
                const key = `${s.day_of_week}-${s.period}`
                grid.set(key, {
                    name: app.class?.name ?? '',
                    color: colors[idx % colors.length],
                })
                // 연강인 경우 다음 교시도 표시
                if (periodsPerSession === 2 && s.period + 1 <= 4) {
                    const nextKey = `${s.day_of_week}-${s.period + 1}`
                    grid.set(nextKey, {
                        name: app.class?.name ?? '',
                        color: colors[idx % colors.length],
                    })
                }
            })
        })

        return grid
    }, [activeApps])

    if (activeApps.length === 0) {
        return null
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
            {/* 요약 통계 */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                        <BookOpen className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">신청 과목</p>
                        <p className="font-semibold text-gray-900">{activeApps.length}개</p>
                    </div>
                </div>

                {conflictCount > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">시간 충돌</p>
                            <p className="font-semibold text-red-600">{conflictCount}건</p>
                        </div>
                    </div>
                )}
            </div>

            {/* 우선순위 순서 과목 목록 (간략) */}
            <div className="space-y-1">
                {activeApps.slice(0, 5).map((app, index) => (
                    <div
                        key={app.id}
                        className="flex items-center gap-2 text-sm"
                    >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                            {index + 1}
                        </span>
                        <span className="text-gray-700 truncate flex-1">
                            {app.class?.name}
                        </span>
                    </div>
                ))}
                {activeApps.length > 5 && (
                    <p className="text-xs text-gray-400 pl-7">
                        +{activeApps.length - 5}개 더
                    </p>
                )}
            </div>

            {/* 미니 주간 시간표 */}
            {scheduleGrid.size > 0 && (
                <div>
                    <div className="flex items-center gap-1.5 mb-2">
                        <CalendarDays className="h-3.5 w-3.5 text-gray-500" />
                        <span className="text-xs font-medium text-gray-500">주간 시간표</span>
                    </div>
                    <div className="grid grid-cols-6 gap-px bg-gray-200 rounded-lg overflow-hidden text-[10px]">
                        {/* 헤더 */}
                        <div className="bg-gray-50 p-1 text-center text-gray-400 font-medium" />
                        {DAYS_IN_WEEK.map(day => (
                            <div
                                key={day}
                                className="bg-gray-50 p-1 text-center text-gray-500 font-medium"
                            >
                                {DAY_NAMES[day]}
                            </div>
                        ))}

                        {/* 교시 행 */}
                        {PERIODS.map(period => (
                            <div key={period} className="contents">
                                <div className="bg-gray-50 p-1 text-center text-gray-400">
                                    {period}
                                </div>
                                {DAYS_IN_WEEK.map(day => {
                                    const cell = scheduleGrid.get(`${day}-${period}`)
                                    return (
                                        <div
                                            key={`${day}-${period}`}
                                            className={cn(
                                                'p-0.5 text-center truncate min-h-[20px]',
                                                cell ? cell.color : 'bg-white'
                                            )}
                                            title={cell?.name}
                                        >
                                            {cell && (
                                                <span className="leading-tight">
                                                    {cell.name.length > 3
                                                        ? cell.name.slice(0, 3) + '..'
                                                        : cell.name}
                                                </span>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
