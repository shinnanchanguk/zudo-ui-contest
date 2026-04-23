// @ts-nocheck
'use client'

import { useMemo } from 'react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Users,
    MapPin,
    BookOpen,
    Clock,
    Calendar,
    Loader2,
    Check,
    X,
    AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AfterschoolApplicationStatus } from '@/hooks/useStudentApplications'

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

interface SessionDescription {
    session: number
    description: string
}

interface ProgramDetailSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    program: {
        id: string
        name: string
        teacher_name: string | null
        location: { name: string } | null
        program_type: string | null
        textbook_name: string | null
        session_count: number | null
        session_descriptions: unknown
        schedules: { day_of_week: number; period: number }[] | null
        target_grades: number[] | null
    } | null
    isApplied?: boolean
    applicationStatus?: AfterschoolApplicationStatus | null
    applicationId?: string | null
    hasConflict?: boolean
    conflictMessage?: string
    onApply?: () => void
    onCancel?: () => void
    isApplying?: boolean
    isCancelling?: boolean
    isWithinEnrollmentPeriod?: boolean
}


export function ProgramDetailSheet({
    open,
    onOpenChange,
    program,
    isApplied = false,
    applicationStatus,
    applicationId,
    hasConflict = false,
    conflictMessage,
    onApply,
    onCancel,
    isApplying = false,
    isCancelling = false,
    isWithinEnrollmentPeriod = true,
}: ProgramDetailSheetProps) {
    const scheduleText = useMemo(() => {
        if (!program?.schedules || program.schedules.length === 0) return '일정 미정'

        const byDay = new Map<number, number[]>()
        program.schedules.forEach(s => {
            const periods = byDay.get(s.day_of_week) || []
            periods.push(s.period)
            byDay.set(s.day_of_week, periods.sort())
        })

        return Array.from(byDay.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([day, periods]) => `${DAY_NAMES[day]}요일 ${periods.join(', ')}교시`)
            .join('\n')
    }, [program])

    const sessionDescriptions = (() => {
        if (!program?.session_descriptions) return []
        try {
            const parsed = program.session_descriptions as SessionDescription[]
            return Array.isArray(parsed) ? parsed.filter(d => d.description.trim()) : []
        } catch {
            return []
        }
    })()

    const canApply = !isApplied && !hasConflict && isWithinEnrollmentPeriod
    const canCancel = isApplied && applicationStatus === 'approved' && isWithinEnrollmentPeriod

    if (!program) return null

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0">
                <SheetHeader className="sticky top-0 z-10 bg-white px-6 py-4 border-b">
                    <SheetTitle className="text-left text-lg">
                        {program.name}
                    </SheetTitle>
                </SheetHeader>

                <ScrollArea className="flex-1 h-[calc(100%-180px)]">
                    <div className="px-6 py-4 space-y-5">
                        {/* 시간 충돌 경고 */}
                        {hasConflict && (
                            <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-3">
                                <div className="flex items-center gap-2 text-yellow-800">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span className="font-medium text-sm">시간 충돌</span>
                                </div>
                                <p className="mt-1 text-sm text-yellow-700">
                                    {conflictMessage || '이미 신청한 프로그램과 시간이 겹칩니다.'}
                                </p>
                            </div>
                        )}

                        {/* 기본 정보 */}
                        <div className="space-y-3">
                            {program.teacher_name && (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                                        <Users className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">담당 선생님</p>
                                        <p className="font-medium">{program.teacher_name}</p>
                                    </div>
                                </div>
                            )}

                            {program.location?.name && (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-100">
                                        <MapPin className="h-4 w-4 text-pink-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">장소</p>
                                        <p className="font-medium">{program.location.name}</p>
                                    </div>
                                </div>
                            )}

                            {program.textbook_name && (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                                        <BookOpen className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">교재</p>
                                        <p className="font-medium">{program.textbook_name}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                                    <Calendar className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">일정</p>
                                    <p className="font-medium whitespace-pre-line">{scheduleText}</p>
                                </div>
                            </div>

                            {program.session_count && program.session_count > 0 && (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">
                                        <Clock className="h-4 w-4 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">총 차시</p>
                                        <p className="font-medium">{program.session_count}차시</p>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* 차시별 설명 */}
                        {sessionDescriptions.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="font-medium text-gray-900">커리큘럼(총 {program?.session_count ?? 0}차시)</h4>
                                <div className="space-y-2">
                                    {sessionDescriptions.map(item => (
                                        <div
                                            key={item.session}
                                            className="rounded-lg border bg-gray-50 p-3"
                                        >
                                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 mr-2">
                                                {item.session}
                                            </span>
                                            <span className="text-sm text-gray-700">
                                                {item.description}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* 하단 액션 */}
                <div className="sticky bottom-0 border-t bg-white px-6 py-4 pb-safe">
                    {isApplied ? (
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "flex-1 rounded-xl py-3 text-center font-medium",
                                (applicationStatus === 'approved' || applicationStatus === 'pending' || applicationStatus === 'waitlist')
                                    ? "bg-green-100 text-green-700"
                                    : applicationStatus === 'withdrawn'
                                      ? "bg-red-100 text-red-700"
                                      : "bg-gray-100 text-gray-500"
                            )}>
                                {(applicationStatus === 'approved' || applicationStatus === 'pending') && (
                                    <span className="flex items-center justify-center gap-1.5">
                                        <Check className="h-4 w-4" />
                                        신청완료
                                    </span>
                                )}
                                {applicationStatus === 'waitlist' && '대기중'}
                                {applicationStatus === 'cancelled' && '취소됨'}
                                {applicationStatus === 'withdrawn' && '탈락'}
                                {applicationStatus === 'rejected' && '반려됨'}
                            </div>

                            {canCancel && (
                                <Button
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={onCancel}
                                    disabled={isCancelling}
                                >
                                    {isCancelling ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <X className="h-4 w-4 mr-1" />
                                            취소
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    ) : (
                        <Button
                            className="w-full h-12 text-base"
                            onClick={onApply}
                            disabled={!canApply || isApplying}
                        >
                            {isApplying ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    신청 중...
                                </>
                            ) : !isWithinEnrollmentPeriod ? (
                                '수강신청 기간이 아닙니다'
                            ) : hasConflict ? (
                                '시간 충돌로 신청 불가'
                            ) : (
                                '신청하기'
                            )}
                        </Button>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
