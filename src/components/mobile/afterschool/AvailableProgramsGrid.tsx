// @ts-nocheck
'use client'

import { Fragment, useMemo } from 'react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Check, AlertTriangle, ChevronDown } from 'lucide-react'
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from '@/components/ui/accordion'
import {
    type EnrichedProgram,
    type WeekData,
    generateWeeksAroundToday,
    mapProgramsToWeeks,
    isCurrentWeek,
    isPastWeek,
    formatDateForGrid,
} from '@/lib/week-utils'
import { isActiveApplicationStatus } from '@/hooks/useStudentApplications'

const DAY_NAMES = ['월', '화', '수', '목']
const PERIODS = [1, 2, 3, 4]

interface AvailableProgramsGridProps {
    programs: EnrichedProgram[]
    appliedClassIds: Set<string>
    applicationStatusMap: Map<string, { id: string; status: string }>
    onProgramClick: (program: EnrichedProgram) => void
    enrollmentCounts?: Map<string, number>
    programMaxCapacities?: { id: string; max_capacity: number | null }[]
    isPhase2?: boolean
}

export function AvailableProgramsGrid({
    programs,
    appliedClassIds,
    applicationStatusMap,
    onProgramClick,
    enrollmentCounts,
    programMaxCapacities,
    isPhase2 = false,
}: AvailableProgramsGridProps) {
    // 주 목록 생성 (2주 전 ~ 12주 후)
    const weeks = useMemo(() => {
        const baseWeeks = generateWeeksAroundToday(2, 12)
        return mapProgramsToWeeks(programs, baseWeeks)
    }, [programs])

    // 프로그램이 있는 주만 필터링
    const weeksWithPrograms = useMemo(() => {
        return weeks.filter(week => week.programCount > 0)
    }, [weeks])

    // 현재 주 ID (기본 열림 상태)
    const currentWeekId = useMemo(() => {
        const current = weeks.find(isCurrentWeek)
        // 현재 주에 프로그램이 없으면 첫 번째 프로그램 있는 주
        if (current && current.programCount > 0) return current.weekId
        return weeksWithPrograms[0]?.weekId ?? ''
    }, [weeks, weeksWithPrograms])

    // 충돌 프로그램 ID 계산
    // 1. 신청한 프로그램들 간의 충돌
    // 2. 미신청 프로그램이 신청한 프로그램과 같은 슬롯에 있는 경우도 충돌로 표시
    const conflictingClassIds = useMemo(() => {
        const conflicts = new Set<string>()

        weeks.forEach(week => {
            week.programsBySlot.forEach(slotPrograms => {
                const appliedInSlot = slotPrograms.filter(p => appliedClassIds.has(p.id))
                const notAppliedInSlot = slotPrograms.filter(p => !appliedClassIds.has(p.id))

                // 1. 신청한 프로그램이 2개 이상이면 서로 충돌
                if (appliedInSlot.length > 1) {
                    appliedInSlot.forEach(p => conflicts.add(p.id))
                }

                // 2. 이미 신청한 프로그램이 있는 슬롯의 미신청 프로그램도 충돌로 표시
                if (appliedInSlot.length > 0) {
                    notAppliedInSlot.forEach(p => conflicts.add(p.id))
                }
            })
        })

        return conflicts
    }, [weeks, appliedClassIds])

    // 정원 마감 프로그램 ID 계산
    const fullClassIds = useMemo(() => {
        const fullIds = new Set<string>()
        if (!enrollmentCounts || !programMaxCapacities) return fullIds
        const capMap = new Map(programMaxCapacities.map(p => [p.id, p.max_capacity]))
        enrollmentCounts.forEach((count, classId) => {
            const maxCap = capMap.get(classId)
            if (maxCap && count >= maxCap) {
                fullIds.add(classId)
            }
        })
        return fullIds
    }, [enrollmentCounts, programMaxCapacities])

    if (weeksWithPrograms.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 text-sm">
                신청 가능한 프로그램의 일정이 없습니다
            </div>
        )
    }

    return (
        <div className="w-full">
            <Accordion
                type="single"
                collapsible
                defaultValue={currentWeekId}
                className="w-full space-y-2"
            >
                {weeksWithPrograms.map(week => (
                    <WeekAccordionItem
                        key={week.weekId}
                        week={week}
                        appliedClassIds={appliedClassIds}
                        conflictingClassIds={conflictingClassIds}
                        applicationStatusMap={applicationStatusMap}
                        onProgramClick={onProgramClick}
                        fullClassIds={fullClassIds}
                        isPhase2={isPhase2}
                    />
                ))}
            </Accordion>

            {/* 범례 */}
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500 px-1">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-indigo-100 border border-indigo-300" />
                    <span>신청됨</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-gray-100 border border-gray-300" />
                    <span>미신청</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-red-100 border border-red-300" />
                    <span>시간 충돌</span>
                </div>
                {isPhase2 && (
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-gray-200 border border-gray-400" />
                        <span>마감</span>
                    </div>
                )}
            </div>
        </div>
    )
}

interface WeekAccordionItemProps {
    week: WeekData
    appliedClassIds: Set<string>
    conflictingClassIds: Set<string>
    applicationStatusMap: Map<string, { id: string; status: string }>
    onProgramClick: (program: EnrichedProgram) => void
    fullClassIds: Set<string>
    isPhase2: boolean
}

function WeekAccordionItem({
    week,
    appliedClassIds,
    conflictingClassIds,
    applicationStatusMap,
    onProgramClick,
    fullClassIds,
    isPhase2,
}: WeekAccordionItemProps) {
    const isCurrent = isCurrentWeek(week)
    const isPast = isPastWeek(week)

    return (
        <AccordionItem
            value={week.weekId}
            className={cn(
                'border border-gray-200 rounded-xl overflow-hidden bg-white',
                isCurrent && 'ring-2 ring-indigo-200',
                isPast && 'opacity-60'
            )}
        >
            <AccordionTrigger
                className={cn(
                    'px-4 py-3 hover:no-underline',
                    '[&>svg]:hidden' // 기본 chevron 숨기기
                )}
            >
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
                        <span className={cn(
                            'font-semibold text-sm',
                            isCurrent && 'text-indigo-700',
                            isPast && 'text-gray-500'
                        )}>
                            {week.weekLabel}
                        </span>
                        {isCurrent && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-indigo-100 text-indigo-700 rounded">
                                이번 주
                            </span>
                        )}
                        {isPast && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-500 rounded">
                                지난 주
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-gray-500">
                        {week.programCount}개 프로그램
                    </span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-0 pb-0">
                <div className="border-t border-gray-200">
                    <WeekGrid
                        week={week}
                        appliedClassIds={appliedClassIds}
                        conflictingClassIds={conflictingClassIds}
                        applicationStatusMap={applicationStatusMap}
                        onProgramClick={onProgramClick}
                        fullClassIds={fullClassIds}
                        isPhase2={isPhase2}
                    />
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}

interface WeekGridProps {
    week: WeekData
    appliedClassIds: Set<string>
    conflictingClassIds: Set<string>
    applicationStatusMap: Map<string, { id: string; status: string }>
    onProgramClick: (program: EnrichedProgram) => void
    fullClassIds: Set<string>
    isPhase2: boolean
}

function WeekGrid({
    week,
    appliedClassIds,
    conflictingClassIds,
    applicationStatusMap,
    onProgramClick,
    fullClassIds,
    isPhase2,
}: WeekGridProps) {
    return (
        <div className="grid grid-cols-[48px_repeat(4,1fr)] gap-px bg-gray-200">
            {/* 헤더 행 - 5개 셀 평탄하게 배치 */}
            <div className="p-2 text-center text-xs font-medium text-gray-500 bg-gray-50">
                교시
            </div>
            {week.dates.map((date, idx) => (
                <div key={idx} className="p-2 text-center bg-gray-50">
                    <div className="text-xs font-semibold text-gray-700">
                        {DAY_NAMES[idx]}
                    </div>
                    <div className="text-[10px] text-gray-500">
                        {formatDateForGrid(date)}
                    </div>
                </div>
            ))}

            {/* 바디 - 교시별로 5개 셀씩 평탄하게 배치 */}
            {PERIODS.map((period) => (
                <Fragment key={period}>
                    {/* 교시 레이블 */}
                    <div className="p-2 text-center text-xs font-medium text-gray-500 bg-gray-50 flex items-center justify-center">
                        {period}
                    </div>

                    {/* 해당 교시의 4개 요일 셀 */}
                    {week.dates.map((date) => {
                        const dateKey = format(date, 'yyyy-MM-dd')
                        const slotKey = `${dateKey}-${period}`
                        const cellPrograms = week.programsBySlot.get(slotKey) || []

                        return (
                            <div
                                key={slotKey}
                                className="min-h-[60px] bg-white"
                            >
                                <ProgramCell
                                    programs={cellPrograms}
                                    appliedClassIds={appliedClassIds}
                                    conflictingClassIds={conflictingClassIds}
                                    applicationStatusMap={applicationStatusMap}
                                    onProgramClick={onProgramClick}
                                    fullClassIds={fullClassIds}
                                    isPhase2={isPhase2}
                                />
                            </div>
                        )
                    })}
                </Fragment>
            ))}
        </div>
    )
}

interface ProgramCellProps {
    programs: EnrichedProgram[]
    appliedClassIds: Set<string>
    conflictingClassIds: Set<string>
    applicationStatusMap: Map<string, { id: string; status: string }>
    onProgramClick: (program: EnrichedProgram) => void
    fullClassIds: Set<string>
    isPhase2: boolean
}

function ProgramCell({
    programs,
    appliedClassIds,
    conflictingClassIds,
    applicationStatusMap,
    onProgramClick,
    fullClassIds,
    isPhase2,
}: ProgramCellProps) {
    if (programs.length === 0) {
        return (
            <div className="h-full flex items-center justify-center p-1 bg-white">
                <span className="text-gray-300 text-[10px]">-</span>
            </div>
        )
    }

    // 모바일에서 최대 3개까지 표시, 나머지는 "+N개" 표시
    const visiblePrograms = programs.slice(0, 3)
    const remainingCount = programs.length - 3

    return (
        <div className="h-full p-1 flex flex-col gap-1 overflow-hidden bg-white">
            {visiblePrograms.map((program) => {
                const isApplied = appliedClassIds.has(program.id)
                const hasConflict = conflictingClassIds.has(program.id)
                const appInfo = applicationStatusMap.get(program.id)
                const hasActiveApplication = isActiveApplicationStatus(appInfo?.status)
                const isFull = isPhase2 && fullClassIds.has(program.id)

                return (
                    <button
                        key={program.id}
                        type="button"
                        onClick={() => onProgramClick(program)}
                        className={cn(
                            'w-full rounded-md px-1.5 py-1 text-left transition-all',
                            'active:scale-[0.98]',
                            hasConflict && 'bg-red-50 border border-red-300 ring-1 ring-red-200',
                            isApplied && !hasConflict && 'bg-indigo-50 border border-indigo-300',
                            isFull && !isApplied && !hasConflict && 'bg-gray-100 border border-gray-300',
                            !isApplied && !hasConflict && !isFull && 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                        )}
                    >
                        <div className="flex items-start gap-0.5">
                            <span
                                className={cn(
                                    'text-[11px] font-medium leading-tight line-clamp-2',
                                    hasConflict && 'text-red-700',
                                    isApplied && !hasConflict && 'text-indigo-700',
                                    isFull && !isApplied && !hasConflict && 'text-gray-500',
                                    !isApplied && !hasConflict && !isFull && 'text-gray-700'
                                )}
                            >
                                {program.name}
                            </span>
                        </div>

                        {/* 선생님 이름 표시 */}
                        {program.teacher_name && (
                            <div className={cn(
                                'text-[9px] mt-0.5 truncate',
                                hasConflict && 'text-red-500',
                                isApplied && !hasConflict && 'text-indigo-500',
                                !isApplied && !hasConflict && 'text-gray-500'
                            )}>
                                {program.teacher_name}
                            </div>
                        )}

                        <div className="flex items-center gap-1 mt-0.5">
                            {isFull && !isApplied && (
                                <span className="inline-flex items-center rounded px-1 py-px text-[8px] font-medium bg-gray-200 text-gray-600">
                                    마감
                                </span>
                            )}
                            {hasConflict && !isFull && (
                                <span className="inline-flex items-center text-red-600">
                                    <AlertTriangle className="h-2.5 w-2.5" />
                                </span>
                            )}
                            {hasActiveApplication && !hasConflict && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] text-green-600">
                                    <Check className="h-2.5 w-2.5" />
                                    <span>신청</span>
                                </span>
                            )}
                        </div>
                    </button>
                )
            })}

            {/* 나머지 프로그램 표시 */}
            {remainingCount > 0 && (
                <div className="text-[10px] text-gray-400 text-center py-0.5">
                    +{remainingCount}개 더보기
                </div>
            )}
        </div>
    )
}
