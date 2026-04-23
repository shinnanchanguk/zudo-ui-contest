// @ts-nocheck
'use client'

import { useMemo, useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, addMonths, subMonths } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, CalendarDays, Repeat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatPeriodRange, expandPeriodsForDisplay } from '@/types/afterschool'
import type { AfterschoolClassWithRelations } from '@/hooks/useAfterschoolClasses'

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']
const WEEKDAY_NAMES = ['월', '화', '수', '목'] // 방과후는 월~목만

interface ProgramScheduleTabProps {
    program: AfterschoolClassWithRelations
}

interface RecurringSchedule {
    day_of_week: number
    period: number
}

interface SpecificDateSchedule {
    date: string
    period: number
}

export function ProgramScheduleTab({ program }: ProgramScheduleTabProps) {
    const scheduleMode = (program.schedule_mode as 'recurring' | 'specific') || 'recurring'

    // recurring 모드에서도 specific_dates가 있으면 캘린더+날짜 목록도 보여줌
    const specificDates = program.specific_dates as SpecificDateSchedule[] | null
    const hasSpecificDates = specificDates && Array.isArray(specificDates) && specificDates.length > 0

    if (scheduleMode === 'recurring') {
        return (
            <div className="space-y-6">
                <RecurringScheduleView program={program} />
                {hasSpecificDates && (
                    <SpecificDateScheduleView program={program} />
                )}
            </div>
        )
    } else {
        return <SpecificDateScheduleView program={program} />
    }
}

// 반복 일정 뷰 (요일×교시 그리드)
function RecurringScheduleView({ program }: ProgramScheduleTabProps) {
    const periodsPerSession = program.periods_per_session === 2 ? 2 : 1

    const schedules = useMemo(() => {
        const raw = program.schedules as RecurringSchedule[] | null
        if (!raw || !Array.isArray(raw)) return []
        return raw
    }, [program.schedules])

    // 연강 확장된 스케줄 셋 (그리드 표시용)
    const expandedScheduleSet = useMemo(() => {
        const set = new Set<string>()
        schedules.forEach(s => {
            const expanded = expandPeriodsForDisplay([s.period], periodsPerSession)
            expanded.forEach(p => set.add(`${s.day_of_week}-${p}`))
        })
        return set
    }, [schedules, periodsPerSession])

    // 일정이 있는 셀인지 확인 (연강 확장 포함)
    const hasSchedule = (dayOfWeek: number, period: number) => {
        return expandedScheduleSet.has(`${dayOfWeek}-${period}`)
    }

    // 텍스트 요약
    const summaryText = useMemo(() => {
        if (schedules.length === 0) return '일정 미정'

        const byDay = new Map<number, number[]>()
        schedules.forEach(s => {
            const existing = byDay.get(s.day_of_week) || []
            existing.push(s.period)
            byDay.set(s.day_of_week, existing)
        })

        return Array.from(byDay.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([day, periods]) => `${DAY_NAMES[day]}요일 ${formatPeriodRange(expandPeriodsForDisplay(periods, periodsPerSession))}`)
            .join(' / ')
    }, [schedules, periodsPerSession])

    if (schedules.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <CalendarDays className="h-12 w-12 mb-3 text-gray-300" />
                <p className="text-sm">일정이 아직 지정되지 않았습니다.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* 헤더 */}
            <div className="flex items-center gap-2 text-indigo-600">
                <Repeat className="h-4 w-4" />
                <span className="font-medium text-sm">매주 반복 일정</span>
            </div>

            {/* 요일×교시 그리드 */}
            <div className="border rounded-lg overflow-hidden">
                {/* 헤더 행 (요일) */}
                <div className="grid grid-cols-5 bg-gray-50 border-b">
                    <div className="p-2 text-center text-xs text-gray-400 border-r">교시</div>
                    {WEEKDAY_NAMES.map((day, idx) => (
                        <div key={day} className={cn(
                            "p-2 text-center text-xs font-medium text-gray-600",
                            idx < WEEKDAY_NAMES.length - 1 && "border-r"
                        )}>
                            {day}
                        </div>
                    ))}
                </div>

                {/* 데이터 행 (1~4교시) */}
                {[1, 2, 3, 4].map(period => (
                    <div key={period} className={cn(
                        "grid grid-cols-5",
                        period < 4 && "border-b"
                    )}>
                        {/* 교시 레이블 */}
                        <div className="p-2 text-center text-xs text-gray-400 border-r bg-gray-50">
                            {period}
                        </div>

                        {/* 각 요일 셀 */}
                        {[1, 2, 3, 4].map((dayOfWeek, idx) => {
                            const isActive = hasSchedule(dayOfWeek, period)
                            return (
                                <div
                                    key={dayOfWeek}
                                    className={cn(
                                        "p-3 flex items-center justify-center min-h-[48px]",
                                        idx < 3 && "border-r",
                                        isActive && "bg-indigo-100"
                                    )}
                                >
                                    {isActive && (
                                        <div className="w-3 h-3 rounded-full bg-indigo-600" />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>

            {/* 텍스트 요약 */}
            <p className="text-sm text-gray-600 text-center">{summaryText}</p>
        </div>
    )
}

// 특정 날짜 일정 뷰 (미니 캘린더)
function SpecificDateScheduleView({ program }: ProgramScheduleTabProps) {
    const [currentMonth, setCurrentMonth] = useState(() => new Date())
    const periodsPerSession = program.periods_per_session === 2 ? 2 : 1

    const specificDates = useMemo(() => {
        const raw = program.specific_dates as SpecificDateSchedule[] | null
        if (!raw || !Array.isArray(raw)) return []
        return raw
    }, [program.specific_dates])

    // 날짜별 교시 맵 (연강 확장 포함)
    const dateMap = useMemo(() => {
        const map = new Map<string, number[]>()
        specificDates.forEach(s => {
            const existing = map.get(s.date) || []
            existing.push(s.period)
            map.set(s.date, existing)
        })
        // 연강 확장 적용
        for (const [date, periods] of map) {
            map.set(date, expandPeriodsForDisplay(periods, periodsPerSession))
        }
        return map
    }, [specificDates, periodsPerSession])

    // 현재 월의 날짜들
    const monthDays = useMemo(() => {
        const start = startOfMonth(currentMonth)
        const end = endOfMonth(currentMonth)
        return eachDayOfInterval({ start, end })
    }, [currentMonth])

    // 달력 시작 요일 패딩 (일요일 = 0)
    const startDayOfWeek = getDay(startOfMonth(currentMonth))

    // 해당 날짜에 일정이 있는지 확인
    const hasScheduleOnDate = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd')
        return dateMap.has(dateStr)
    }

    if (specificDates.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <CalendarDays className="h-12 w-12 mb-3 text-gray-300" />
                <p className="text-sm">일정이 아직 지정되지 않았습니다.</p>
            </div>
        )
    }

    // 날짜 리스트 (정렬됨)
    const sortedDates = Array.from(dateMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))

    return (
        <div className="space-y-4">
            {/* 헤더 */}
            <div className="flex items-center gap-2 text-indigo-600">
                <CalendarDays className="h-4 w-4" />
                <span className="font-medium text-sm">특정 날짜 일정</span>
            </div>

            {/* 월 네비게이션 */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium">
                    {format(currentMonth, 'yyyy년 M월', { locale: ko })}
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* 미니 캘린더 */}
            <div className="border rounded-lg overflow-hidden">
                {/* 요일 헤더 */}
                <div className="grid grid-cols-7 bg-gray-50 border-b">
                    {DAY_NAMES.map((day, idx) => (
                        <div
                            key={day}
                            className={cn(
                                "p-2 text-center text-xs font-medium",
                                idx === 0 ? "text-red-500" : idx === 6 ? "text-blue-500" : "text-gray-600"
                            )}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* 날짜 그리드 */}
                <div className="grid grid-cols-7">
                    {/* 시작 요일까지 빈 셀 */}
                    {Array.from({ length: startDayOfWeek }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="p-2 h-10" />
                    ))}

                    {/* 실제 날짜들 */}
                    {monthDays.map(day => {
                        const hasSchedule = hasScheduleOnDate(day)
                        const dayOfWeek = getDay(day)
                        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

                        return (
                            <div
                                key={day.toISOString()}
                                className={cn(
                                    "p-1 h-10 flex flex-col items-center justify-center relative",
                                    !isSameMonth(day, currentMonth) && "text-gray-300"
                                )}
                            >
                                <span className={cn(
                                    "text-sm",
                                    isWeekend && dayOfWeek === 0 && "text-red-500",
                                    isWeekend && dayOfWeek === 6 && "text-blue-500",
                                    hasSchedule && "font-bold text-indigo-600"
                                )}>
                                    {format(day, 'd')}
                                </span>
                                {hasSchedule && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-0.5" />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* 상세 일정 리스트 */}
            <div className="space-y-2">
                <h4 className="font-medium text-gray-900 text-sm">상세 일정</h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {sortedDates.map(([dateStr, periods]) => {
                        const date = new Date(dateStr)
                        const dayOfWeek = getDay(date)
                        return (
                            <div
                                key={dateStr}
                                className="flex items-center justify-between rounded-lg border bg-gray-50 px-3 py-2"
                            >
                                <span className="text-sm text-gray-700">
                                    {format(date, 'M/d', { locale: ko })}
                                    <span className="text-gray-400 ml-1">
                                        ({DAY_NAMES[dayOfWeek]})
                                    </span>
                                </span>
                                <span className="text-sm font-medium text-indigo-600">
                                    {formatPeriodRange(periods)}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
