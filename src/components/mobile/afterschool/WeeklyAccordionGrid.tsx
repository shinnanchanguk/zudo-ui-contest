// @ts-nocheck
'use client'

import { Fragment, useMemo } from 'react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { User, AlertTriangle, ChevronDown } from 'lucide-react'
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

interface WeeklyAccordionGridProps {
    programs: EnrichedProgram[]
    appliedClassIds: Set<string>
    applicationStatusMap: Map<string, { id: string; status: string }>
    onProgramClick: (program: EnrichedProgram) => void
}

export function WeeklyAccordionGrid({
    programs,
    appliedClassIds,
    applicationStatusMap,
    onProgramClick,
}: WeeklyAccordionGridProps) {
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
    const conflictingClassIds = useMemo(() => {
        const conflicts = new Set<string>()
        const appliedPrograms = programs.filter(p => appliedClassIds.has(p.id))

        // 신청한 프로그램들의 스케줄을 slot 키로 그룹화 (연강 확장 포함)
        const appliedSlots = new Map<string, string[]>()

        const addSlot = (key: string, programId: string) => {
            const existing = appliedSlots.get(key) || []
            appliedSlots.set(key, [...existing, programId])
        }

        appliedPrograms.forEach(program => {
            const mode = program.schedule_mode ?? 'recurring'
            const pps = program.periods_per_session === 2 ? 2 : 1

            if (mode === 'recurring' && program.schedules) {
                program.schedules.forEach(schedule => {
                    addSlot(`${schedule.day_of_week}-${schedule.period}`, program.id)
                    if (pps === 2 && schedule.period + 1 <= 4) {
                        addSlot(`${schedule.day_of_week}-${schedule.period + 1}`, program.id)
                    }
                })
            }
            // specific dates의 경우 같은 날짜+교시가 중복될 때만 충돌
            if (mode === 'specific' && program.specific_dates) {
                program.specific_dates.forEach(sd => {
                    addSlot(`${sd.date}-${sd.period}`, program.id)
                    if (pps === 2 && sd.period + 1 <= 4) {
                        addSlot(`${sd.date}-${sd.period + 1}`, program.id)
                    }
                })
            }
        })

        // 같은 슬롯에 2개 이상의 프로그램이 있으면 충돌
        appliedSlots.forEach(programIds => {
            if (programIds.length > 1) {
                programIds.forEach(id => conflicts.add(id))
            }
        })

        return conflicts
    }, [programs, appliedClassIds])

    if (weeksWithPrograms.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 text-sm">
                신청한 프로그램의 일정이 없습니다
            </div>
        )
    }

    return (
        <div className="w-full pb-8">
            <Accordion
                type="single"
                collapsible
                defaultValue={currentWeekId}
                className="w-full space-y-2 mb-1"
            >
                {weeksWithPrograms.map(week => (
                    <WeekAccordionItem
                        key={week.weekId}
                        week={week}
                        appliedClassIds={appliedClassIds}
                        conflictingClassIds={conflictingClassIds}
                        applicationStatusMap={applicationStatusMap}
                        onProgramClick={onProgramClick}
                    />
                ))}
            </Accordion>
        </div>
    )
}

interface WeekAccordionItemProps {
    week: WeekData
    appliedClassIds: Set<string>
    conflictingClassIds: Set<string>
    applicationStatusMap: Map<string, { id: string; status: string }>
    onProgramClick: (program: EnrichedProgram) => void
}

function WeekAccordionItem({
    week,
    appliedClassIds,
    conflictingClassIds,
    applicationStatusMap,
    onProgramClick,
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
                        {week.programCount}개 수업
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
}

function WeekGrid({
    week,
    appliedClassIds,
    conflictingClassIds,
    applicationStatusMap,
    onProgramClick,
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
}

function ProgramCell({
    programs,
    appliedClassIds,
    conflictingClassIds,
    applicationStatusMap,
    onProgramClick,
}: ProgramCellProps) {
    if (programs.length === 0) {
        return (
            <div className="h-full flex items-center justify-center p-1 bg-white">
                <span className="text-gray-300 text-[10px]">-</span>
            </div>
        )
    }

    return (
        <div className="h-full p-1 flex flex-col gap-1 overflow-hidden bg-white">
            {programs.map((program) => {
                const isApplied = appliedClassIds.has(program.id)
                const hasConflict = conflictingClassIds.has(program.id)
                const appInfo = applicationStatusMap.get(program.id)
                const hasActiveApplication = isActiveApplicationStatus(appInfo?.status)

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
                            !isApplied && !hasConflict && 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                        )}
                    >
                        <div className="flex items-start gap-0.5">
                            <span
                                className={cn(
                                    'text-[11px] font-medium leading-tight line-clamp-2',
                                    hasConflict && 'text-red-700',
                                    isApplied && !hasConflict && 'text-indigo-700',
                                    !isApplied && !hasConflict && 'text-gray-700'
                                )}
                            >
                                {program.name}
                            </span>
                        </div>

                        <div className="flex items-center gap-1 mt-0.5">
                            {hasConflict && (
                                <span className="inline-flex items-center text-red-600">
                                    <AlertTriangle className="h-2.5 w-2.5" />
                                </span>
                            )}
                            {hasActiveApplication && !hasConflict && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] text-green-600">
                                    <User className="h-2.5 w-2.5" />
                                    <span className="truncate max-w-[50px]">신청됨</span>
                                </span>
                            )}
                        </div>
                    </button>
                )
            })}
        </div>
    )
}
