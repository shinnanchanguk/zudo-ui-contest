// @ts-nocheck
'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Loader2, AlertCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useProfile } from '@/hooks/useAuth'
import { useActiveEnrollmentPeriod, usePhase2Eligibility } from '@/hooks/useEnrollmentPeriods'
import {
    useStudentApplications,
    useAvailablePrograms,
    useClassEnrollmentCounts,
    useApplyToProgram,
    useCancelApplication,
    checkScheduleConflicts,
    isActiveApplicationStatus,
} from '@/hooks/useStudentApplications'
import { getEffectiveAfterschoolMinStudents } from '@/config/constants'
import { useAfterschoolClass } from '@/hooks/useAfterschoolClasses'
import { ProgramInfoTab } from './ProgramInfoTab'
import { ProgramActionBar } from './ProgramActionBar'
import { isWithinEnrollmentPeriod, formatEnrollmentTime } from '@/lib/afterschool/enrollmentPeriod'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { expandPeriodsForDisplay, formatPeriodRange } from '@/types/afterschool'

interface ProgramDetailPageProps {
    programId: string
}

export function ProgramDetailPage({ programId }: ProgramDetailPageProps) {
    const router = useRouter()
    const supabase = createClient()

    // 프로필 및 학생 정보
    const { data: profile, isLoading: profileLoading } = useProfile()
    const studentId = profile?.student_id

    const { data: studentData, isLoading: studentLoading } = useQuery({
        queryKey: ['student-basic-info', studentId],
        queryFn: async () => {
            if (!studentId) return null
            const data = [{ grade_level: 2 }]
            const error = null as unknown
            if (error) throw error
            return data?.[0] ?? null
        },
        enabled: !!studentId,
    })
    const studentGrade = studentData?.grade ?? null

    // 프로그램 상세 조회
    const { data: program, isLoading: programLoading, error: programError } = useAfterschoolClass(programId)

    // 신청 기간 조회
    const { data: activePeriod, isLoading: periodLoading } = useActiveEnrollmentPeriod({
        gradeLevel: studentGrade,
    })

    // 학생 신청 목록
    const { data: applications, isLoading: applicationsLoading } = useStudentApplications(
        studentId || null,
        activePeriod?.period_id,
        activePeriod?.period_term_id
    )

    // 사용 가능한 프로그램 목록 (충돌 체크용)
    const { data: programs, isLoading: programsLoading } = useAvailablePrograms(
        studentGrade || null,
        activePeriod?.period_id
    )

    // 2차 신청 자격 확인
    const { data: phase2Eligibility, isLoading: eligibilityLoading } = usePhase2Eligibility(
        studentId || null,
        activePeriod?.period_id ?? null
    )

    // 2차 신청 시 등록 인원수 조회
    const isPhase2 = activePeriod?.period_phase === 2
    const { data: enrollmentCounts } = useClassEnrollmentCounts(
        activePeriod?.period_term_id ?? null,
        isPhase2
    )

    // Mutations
    const applyMutation = useApplyToProgram()
    const cancelMutation = useCancelApplication()

    // 신청 기간 상태 체크
    const enrollmentStatus = useMemo(() => {
        if (!activePeriod) {
            return { isOpen: false, message: '현재 신청 기간이 아닙니다', phase: 0 }
        }

        const phase = activePeriod.period_phase

        if (!activePeriod.period_is_active) {
            return { isOpen: false, message: '신청이 마감되었습니다', phase }
        }

        if (!isWithinEnrollmentPeriod(activePeriod.period_start_date, activePeriod.period_end_date)) {
            return { isOpen: false, message: `신청은 ${formatEnrollmentTime(activePeriod.period_start_date)}부터 가능합니다`, phase }
        }

        // 학년 제한 체크
        if (
            studentGrade &&
            activePeriod.period_target_grades &&
            !activePeriod.period_target_grades.includes(studentGrade)
        ) {
            return { isOpen: false, message: `${activePeriod.period_target_grades.join(', ')}학년만 신청 가능`, phase }
        }

        // 2차 신청 자격 체크
        if (phase === 2 && phase2Eligibility && !phase2Eligibility.isEligible) {
            return { isOpen: false, message: '2차 신청 대상이 아닙니다', phase }
        }

        return { isOpen: true, message: `${phase}차 신청 진행중`, phase }
    }, [activePeriod, studentGrade, phase2Eligibility])

    // 신청한 프로그램 ID 목록
    const appliedProgramIds = useMemo(() => {
        if (!applications) return new Set<string>()
        return new Set(
            applications
                .filter(a => isActiveApplicationStatus(a.status) && a.class_id !== null)
                .map(a => a.class_id as string)
        )
    }, [applications])

    // 신청 상태 맵
    const applicationStatusMap = useMemo(() => {
        if (!applications) return new Map<string, { id: string; status: string }>()
        return new Map(
            applications
                .filter((a): a is typeof a & { class_id: string; status: string } =>
                    isActiveApplicationStatus(a.status) && a.class_id !== null && a.status !== null
                )
                .map(a => [a.class_id, { id: a.id, status: a.status }])
        )
    }, [applications])

    // 시간 충돌 체크
    const conflictInfo = useMemo(() => {
        if (!program || !programs) return { hasConflict: false, message: '' }

        // 이미 신청한 프로그램은 충돌 체크 불필요
        if (appliedProgramIds.has(program.id)) return { hasConflict: false, message: '' }

        const appliedPrograms = programs.filter(p => appliedProgramIds.has(p.id))

        const result = checkScheduleConflicts(
            [...appliedPrograms.map(p => p.id), program.id],
            [...appliedPrograms, program].map(p => ({
                id: p.id,
                schedule_mode: p.schedule_mode as 'recurring' | 'specific' | 'specific_dates' | null,
                schedules: p.schedules as { day_of_week: number; period: number }[] | null,
                specific_dates: p.specific_dates as { date: string; period: number }[] | null,
                periods_per_session: (p as { periods_per_session?: number | null }).periods_per_session ?? null,
            }))
        )

        if (!result.hasConflict) return { hasConflict: false, message: '' }

        const conflictingProgramNames = Array.from(new Set(result.conflicts
            .flatMap(c => c.programs.filter(pid => pid !== program.id))
            .map(pid => appliedPrograms.find(p => p.id === pid)?.name)
            .filter(Boolean)))

        return {
            hasConflict: true,
            message: conflictingProgramNames.length > 0
                ? `현재 신청한 ${conflictingProgramNames.map((name) => `'${name}'`).join(', ')}와 시간이 겹칩니다. 신청은 가능하지만, 최종 조정에서 우선순위가 낮은 강좌는 취소될 수 있습니다.`
                : '이미 신청한 프로그램과 시간이 겹칩니다. 신청은 가능하지만, 최종 조정에서 우선순위가 낮은 강좌는 취소될 수 있습니다.',
        }
    }, [program, programs, appliedProgramIds])

    // 현재 프로그램 신청 상태
    const isApplied = program ? appliedProgramIds.has(program.id) : false
    const applicationInfo = program ? applicationStatusMap.get(program.id) : undefined
    const applicationStatus = applicationInfo?.status as import('@/hooks/useStudentApplications').AfterschoolApplicationStatus | null
    const isVisibleInCurrentEnrollment = !!(program && programs?.some((candidate) => candidate.id === program.id))

    // Phase 2: 잔여 정원 계산
    const enrolledCount = program ? enrollmentCounts?.get(program.id) ?? 0 : 0
    const maxCapacity = program?.max_capacity ?? null
    const remainingCapacity = maxCapacity ? maxCapacity - enrolledCount : undefined
    const minStudents = program ? getEffectiveAfterschoolMinStudents(program.min_students) : 4
    const isPhase2Full = isPhase2 && remainingCapacity !== undefined && remainingCapacity <= 0
    const isPhase2AtRisk = isPhase2 && enrolledCount < minStudents
    const isPhase2Conflict = isPhase2 && conflictInfo.hasConflict

    // 신청 핸들러
    const handleApply = async () => {
        if (!studentId || !program || !activePeriod?.period_id) return

        if (!isVisibleInCurrentEnrollment) {
            toast.error('현재 신청 가능한 강좌가 아닙니다')
            return
        }

        try {
            await applyMutation.mutateAsync({
                studentId,
                classId: program.id,
                periodId: activePeriod.period_id,
                phase: activePeriod.period_phase,
            })
            toast.success('신청이 접수되었습니다')
            if (conflictInfo.hasConflict) {
                toast.warning('시간이 겹치는 강좌로 신청되었습니다. 내 신청 목록에서 우선순위를 확인해 주세요.')
            }
        } catch (error) {
            if (error instanceof Error && error.message.includes('duplicate')) {
                toast.error('이미 신청한 프로그램입니다')
            } else if (error instanceof Error && error.message) {
                toast.error(error.message)
            } else {
                toast.error('신청에 실패했습니다')
            }
        }
    }

    // 취소 핸들러
    const handleCancel = async () => {
        if (!studentId || !applicationInfo) return

        try {
            await cancelMutation.mutateAsync({
                applicationId: applicationInfo.id,
                studentId,
            })
            toast.success('신청이 취소되었습니다')
        } catch {
            toast.error('취소에 실패했습니다')
        }
    }

    const isLoading = profileLoading || studentLoading || programLoading || periodLoading || programsLoading || applicationsLoading || eligibilityLoading

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        )
    }

    if (programError || !program) {
        return (
            <div className="h-screen flex flex-col bg-gray-50">
                {/* 헤더 */}
                <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
                    <div className="flex items-center h-14 px-4">
                        <button
                            onClick={() => router.back()}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors -ml-2"
                            aria-label="뒤로가기"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-900" />
                        </button>
                        <h1 className="flex-1 text-center text-lg font-bold text-gray-900 truncate px-2">
                            프로그램 정보
                        </h1>
                        <div className="w-10" />
                    </div>
                </header>

                <div className="flex-1 flex flex-col items-center justify-center p-6">
                    <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">프로그램을 찾을 수 없습니다</h2>
                    <p className="text-sm text-gray-500 text-center">
                        요청하신 프로그램이 존재하지 않거나 삭제되었습니다.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* 모바일 헤더 (Pattern B) */}
            <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
                <div className="flex items-center h-14 px-4">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors -ml-2"
                        aria-label="뒤로가기"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-900" />
                    </button>
                    <h1 className="flex-1 text-center text-lg font-bold text-gray-900 truncate px-2">
                        {program.name}
                    </h1>
                    <div className="w-10" /> {/* 균형 스페이서 */}
                </div>
            </header>

            {/* 프로그램 정보 */}
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-5">
                    {/* Phase 2 안내 배너 */}
                    {isPhase2 && !isApplied && (
                        <>
                            {isPhase2Full && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                                    <p className="text-sm font-medium text-red-700">이 강좌는 정원이 마감되었습니다</p>
                                </div>
                            )}
                            {isPhase2Conflict && !isPhase2Full && (
                                <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                                    <p className="text-sm font-medium text-orange-700">확정된 시간표와 겹쳐 신청할 수 없습니다</p>
                                    <p className="text-xs text-orange-600 mt-1">기존 강좌를 취소하면 신청 가능합니다.</p>
                                </div>
                            )}
                            {isPhase2AtRisk && !isPhase2Full && (
                                <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                                    <p className="text-sm font-medium text-orange-700">현재 신청 인원이 최소 인원에 미달합니다</p>
                                    <p className="text-xs text-orange-600 mt-1">추가 신청 시 폐강을 방지할 수 있습니다.</p>
                                </div>
                            )}
                            {remainingCapacity !== undefined && remainingCapacity > 0 && (
                                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                                    <p className="text-sm font-medium text-green-700">잔여 {remainingCapacity}명</p>
                                </div>
                            )}
                        </>
                    )}

                    <ProgramInfoTab
                        program={program}
                        hasConflict={conflictInfo.hasConflict}
                        conflictMessage={isPhase2 ? undefined : conflictInfo.message}
                    />

                    {/* 카테고리 표시 */}
                    {program.course_category && (
                        <div className="rounded-lg border bg-gray-50 p-3">
                            <p className="text-xs text-gray-500 mb-1">강좌 구분</p>
                            <p className="font-medium text-gray-900">
                                {program.course_category === 'theme_interview' ? '테마/면접' : program.course_category === 'subject' ? '교과' : program.course_category}
                            </p>
                        </div>
                    )}

                    {/* 연속 교시 정보 */}
                    {program.periods_per_session && program.periods_per_session > 1 && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                            <p className="text-sm text-blue-700">
                                1회 수업: {program.periods_per_session}교시 연속
                            </p>
                        </div>
                    )}

                    {/* 2순위(참고) 시간표 */}
                    {program.secondary_schedules && (
                        (() => {
                            const secondarySchedules = program.secondary_schedules as { day_of_week: number; period: number }[] | null
                            if (!secondarySchedules || secondarySchedules.length === 0) return null

                            const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']
                            const byDay = new Map<number, number[]>()
                            secondarySchedules.forEach((s: { day_of_week: number; period: number }) => {
                                const periods = byDay.get(s.day_of_week) || []
                                periods.push(s.period)
                                byDay.set(s.day_of_week, periods.sort())
                            })
                            const pps = program.periods_per_session ?? 1
                            const secondaryText = Array.from(byDay.entries())
                                .sort((a, b) => a[0] - b[0])
                                .map(([day, periods]) => `${DAY_NAMES[day]} ${formatPeriodRange(expandPeriodsForDisplay(periods, pps))}`)
                                .join(' / ')

                            return (
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                                    <p className="text-xs text-gray-500 mb-1">2순위 일정 (참고 정보)</p>
                                    <p className="text-sm text-gray-700">{secondaryText}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        1순위 배정 불가 시 적용될 수 있는 일정입니다
                                    </p>
                                </div>
                            )
                        })()
                    )}
                </div>
            </ScrollArea>

            {/* 하단 액션 바 */}
            <ProgramActionBar
                isApplied={isApplied}
                applicationStatus={applicationStatus}
                hasConflict={conflictInfo.hasConflict}
                conflictMessage={isPhase2
                    ? (conflictInfo.hasConflict
                        ? `확정된 강좌와 시간이 겹칩니다. 기존 강좌를 취소하면 신청 가능합니다.`
                        : undefined)
                    : conflictInfo.message}
                isApplicationAvailable={isVisibleInCurrentEnrollment}
                isWithinEnrollmentPeriod={enrollmentStatus.isOpen && isVisibleInCurrentEnrollment}
                isPhase2={isPhase2}
                remainingCapacity={remainingCapacity}
                onApply={handleApply}
                onCancel={handleCancel}
                isApplying={applyMutation.isPending}
                isCancelling={cancelMutation.isPending}
            />
        </div>
    )
}
