// @ts-nocheck
'use client'

import { useMemo } from 'react'
import { BookOpen, Users, MapPin, Clock, ChevronRight, Check, AlertTriangle } from 'lucide-react'
import { getEffectiveAfterschoolMinStudents } from '@/config/constants'
import { cn } from '@/lib/utils'
import { formatPeriodRange, expandPeriodsForDisplay } from '@/types/afterschool'
import type { AfterschoolApplicationStatus } from '@/hooks/useStudentApplications'

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

interface ProgramCardProps {
    program: {
        id: string
        name: string
        teacher_name: string | null
        location: { name: string } | null
        program_type: string | null
        session_count: number | null
        schedules: { day_of_week: number; period: number }[] | null
        max_capacity?: number | null
        min_students?: number | null
        course_category?: string | null
        periods_per_session?: number | null
    }
    isApplied?: boolean
    hasConflict?: boolean
    applicationStatus?: AfterschoolApplicationStatus | null
    priority?: number | null
    enrolledCount?: number
    conflictingCourseNames?: string[]
    isPhase2?: boolean
    onClick?: () => void
}

export function ProgramCard({
    program,
    isApplied = false,
    hasConflict = false,
    applicationStatus,
    priority,
    enrolledCount,
    conflictingCourseNames,
    isPhase2 = false,
    onClick,
}: ProgramCardProps) {
    const scheduleText = useMemo(() => {
        if (!program.schedules || program.schedules.length === 0) return null

        const pps = program.periods_per_session ?? 1

        // 요일별로 그룹핑 (연강 시 다음 교시도 포함)
        const byDay = new Map<number, number[]>()
        program.schedules.forEach(s => {
            const existing = byDay.get(s.day_of_week) || []
            existing.push(s.period)
            byDay.set(s.day_of_week, existing)
        })

        return Array.from(byDay.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([day, periods]) => `${DAY_NAMES[day]} ${formatPeriodRange(expandPeriodsForDisplay(periods, pps))}`)
            .join(' / ')
    }, [program.schedules, program.periods_per_session])

    // 잔여 정원 계산
    const remainingCapacity = useMemo(() => {
        if (enrolledCount === undefined || enrolledCount === null) return undefined
        const maxCap = program.max_capacity
        if (!maxCap) return undefined
        return maxCap - enrolledCount
    }, [enrolledCount, program.max_capacity])

    // 정원 상태 계산
    const capacityStatus = useMemo(() => {
        if (enrolledCount === undefined || enrolledCount === null) return null

        const maxCap = program.max_capacity
        const minStudents = getEffectiveAfterschoolMinStudents(program.min_students)

        if (isPhase2) {
            // Phase 2: 마감 / 폐강 위기 / 잔여 N명
            if (maxCap && enrolledCount >= maxCap) {
                return { label: '마감', color: 'text-gray-600 bg-gray-200' }
            }
            if (enrolledCount < minStudents) {
                return { label: `폐강 위기 (${enrolledCount}/${minStudents}명)`, color: 'text-orange-700 bg-orange-100' }
            }
            if (maxCap) {
                const remaining = maxCap - enrolledCount
                return { label: `잔여 ${remaining}명`, color: 'text-green-700 bg-green-100' }
            }
            return { label: `${enrolledCount}명`, color: 'text-gray-600 bg-gray-100' }
        }

        // Phase 1: 기존 로직
        if (maxCap && enrolledCount >= maxCap) {
            return { label: '정원 초과', color: 'text-red-600 bg-red-100' }
        }
        if (enrolledCount < minStudents) {
            return { label: `${enrolledCount}/${minStudents}명`, color: 'text-yellow-700 bg-yellow-100' }
        }
        if (maxCap) {
            return { label: `${enrolledCount}/${maxCap}명`, color: 'text-green-700 bg-green-100' }
        }
        return { label: `${enrolledCount}명`, color: 'text-gray-600 bg-gray-100' }
    }, [enrolledCount, program.max_capacity, program.min_students, isPhase2])

    const statusBadge = useMemo(() => {
        // 충돌 배지 우선 표시
        if (hasConflict && !isApplied) {
            return (
                <span className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                    isPhase2 ? "bg-red-200 text-red-800" : "bg-red-100 text-red-700"
                )}>
                    <AlertTriangle className="h-3 w-3" />
                    {isPhase2 ? '시간 충돌' : '시간 겹침 주의'}
                </span>
            )
        }

        if (!isApplied) return null

        switch (applicationStatus) {
            case 'pending':
            case 'approved':
            case 'waitlist':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        <Check className="h-3 w-3" />
                        신청완료
                    </span>
                )
            case 'withdrawn':
                return (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                        탈락
                    </span>
                )
            case 'cancelled':
                return (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                        취소됨
                    </span>
                )
            case 'rejected':
                return (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                        반려됨
                    </span>
                )
            default:
                return null
        }
    }, [isApplied, hasConflict, applicationStatus, isPhase2])

    // Phase 2: 마감 또는 충돌 시 흐릿하게
    const isPhase2Disabled = isPhase2 && !isApplied && (
        hasConflict || (remainingCapacity !== undefined && remainingCapacity <= 0)
    )

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'w-full rounded-xl border bg-white p-4 text-left transition-all',
                'active:scale-[0.98] active:bg-gray-50',
                hasConflict && !isApplied && 'border-red-300 bg-red-50/50',
                isApplied && 'border-indigo-200 bg-indigo-50/50',
                !isApplied && !hasConflict && 'border-gray-200 hover:border-indigo-200',
                isPhase2Disabled && 'opacity-80 bg-gray-50/80'
            )}
        >
            <div className="flex items-start justify-between gap-3">
                {/* 우선순위 배지 (신청한 경우에만) */}
                {isApplied && priority !== null && priority !== undefined && (
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 mt-0.5">
                        <span className="text-xs font-bold text-indigo-600">
                            {priority}
                        </span>
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    {/* 프로그램명 & 상태 */}
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="font-semibold text-gray-900 truncate">
                            {program.name}
                        </h3>
                        {statusBadge}
                        {/* 카테고리 배지 */}
                        {program.course_category && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                {program.course_category === 'theme_interview' ? '테마/면접' : program.course_category === 'subject' ? '교과' : program.course_category}
                            </span>
                        )}
                        {/* 정원 상태 배지 */}
                        {capacityStatus && (
                            <span className={cn(
                                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                                capacityStatus.color
                            )}>
                                {capacityStatus.label}
                            </span>
                        )}
                        {/* Phase 2: 마감 배지 (capacityStatus와 별도로 명시적 마감 표시) */}
                        {isPhase2 && !isApplied && remainingCapacity !== undefined && remainingCapacity <= 0 && !capacityStatus && (
                            <span className="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                                마감
                            </span>
                        )}
                    </div>

                    {/* 메타 정보 */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500">
                        {program.teacher_name && (
                            <span className="inline-flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                {program.teacher_name}
                            </span>
                        )}
                        {program.location?.name && (
                            <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {program.location.name}
                            </span>
                        )}
                        {program.session_count && program.session_count > 0 && (
                            <span className="inline-flex items-center gap-1">
                                <BookOpen className="h-3.5 w-3.5" />
                                {program.session_count}차시
                            </span>
                        )}
                    </div>

                    {/* 일정 - 일정이 있을 때만 표시 */}
                    {scheduleText && (
                        <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
                            <Clock className="h-3.5 w-3.5 text-indigo-500" />
                            <span>{scheduleText}</span>
                        </div>
                    )}

                    {/* 충돌 상세 정보 */}
                    {hasConflict && !isApplied && conflictingCourseNames && conflictingCourseNames.length > 0 && (
                        <div className="mt-1.5 text-xs text-red-600">
                            {isPhase2
                                ? `겹침: ${conflictingCourseNames.join(', ')} · 확정된 강좌와 시간이 겹쳐 신청할 수 없습니다`
                                : `겹침: ${conflictingCourseNames.join(', ')} · 신청은 가능하지만 우선순위가 낮은 강좌는 추후 취소될 수 있습니다`
                            }
                        </div>
                    )}
                </div>

                <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
            </div>
        </button>
    )
}
