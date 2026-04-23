// @ts-nocheck
'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, Loader2, AlertCircle, Search, List, CalendarDays, Download } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProfile } from '@/hooks/useAuth'
import { useActiveEnrollmentPeriod, usePhase2Eligibility } from '@/hooks/useEnrollmentPeriods'
import {
    useStudentApplications,
    useAvailablePrograms,
    useClassEnrollmentCounts,
    checkScheduleConflicts,
    isActiveApplicationStatus,
} from '@/hooks/useStudentApplications'
import { ProgramCard } from './ProgramCard'
import { PriorityRanker } from './PriorityRanker'
import { ApplicationSummary } from './ApplicationSummary'
import { WeeklyAccordionGrid } from './WeeklyAccordionGrid'
import { AvailableProgramsGrid } from './AvailableProgramsGrid'
import { useWeeklySchedulePdf } from '@/hooks/useWeeklySchedulePdf'
import { isWithinEnrollmentPeriod, formatEnrollmentTime } from '@/lib/afterschool/enrollmentPeriod'
import type { RecurringSchedule, SpecificDateSchedule } from '@/lib/week-utils'
import { createClient } from '@/lib/supabase/client'
import { getEffectiveAfterschoolMinStudents } from '@/config/constants'

function normalizeScheduleMode(value: string | null | undefined): 'recurring' | 'specific' | null {
    if (value === 'specific_dates') return 'specific'
    if (value === 'recurring' || value === 'specific') return value
    return null
}

// 프로그램을 변환하여 타입 호환성 보장
function transformProgram(program: {
    id: string
    name: string
    teacher_name: string | null
    location: { id: string; name: string } | null
    program_type: string | null
    textbook_name: string | null
    session_count: number | null
    session_descriptions: unknown
    schedules: unknown
    specific_dates?: unknown
    schedule_mode?: string | null
    target_grades: number[] | null
    min_students: number | null
    periods_per_session?: number | null
}) {
    const scheduleMode = normalizeScheduleMode(program.schedule_mode) ?? 'recurring'
    return {
        id: program.id,
        name: program.name,
        teacher_name: program.teacher_name,
        location: program.location ? { name: program.location.name } : null,
        program_type: program.program_type,
        textbook_name: program.textbook_name,
        session_count: program.session_count,
        session_descriptions: program.session_descriptions,
        schedules: program.schedules as RecurringSchedule[] | null,
        target_grades: program.target_grades,
        min_students: getEffectiveAfterschoolMinStudents(program.min_students),
        schedule_mode: scheduleMode,
        specific_dates: program.specific_dates as SpecificDateSchedule[] | null,
        periods_per_session: program.periods_per_session ?? null,
    }
}

interface AfterschoolRequestViewProps {
    onClose?: () => void
}

export function AfterschoolRequestView({ onClose }: AfterschoolRequestViewProps) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('available')
    const [searchQuery, setSearchQuery] = useState('')
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

    const supabase = createClient()
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

    const { data: activePeriod, isLoading: periodLoading } = useActiveEnrollmentPeriod({
        gradeLevel: studentGrade,
    })
    const { data: applications, isLoading: applicationsLoading } = useStudentApplications(
        studentId || null,
        activePeriod?.period_id,
        activePeriod?.period_term_id
    )
    const { data: programs, isLoading: programsLoading } = useAvailablePrograms(
        studentGrade || null,
        activePeriod?.period_id
    )

    // 2차 신청 자격 확인
    const { data: phase2Eligibility, isLoading: eligibilityLoading } = usePhase2Eligibility(
        studentId || null,
        activePeriod?.period_id ?? null
    )

    // 2차 신청 시 프로그램별 등록 인원수 조회
    const isPhase2 = activePeriod?.period_phase === 2
    const { data: enrollmentCounts } = useClassEnrollmentCounts(
        activePeriod?.period_term_id ?? null,
        isPhase2
    )

    // 신청 기간 체크
    const enrollmentStatus = useMemo(() => {
        if (!activePeriod) {
            return { isOpen: false, message: '현재 신청 기간이 아닙니다', phase: 0 }
        }

        const phase = activePeriod.period_phase

        if (!activePeriod.period_is_active) {
            return { isOpen: false, message: '신청이 마감되었습니다', phase }
        }

        if (!isWithinEnrollmentPeriod(activePeriod.period_start_date, activePeriod.period_end_date)) {
            return {
                isOpen: false,
                message: `신청은 ${formatEnrollmentTime(activePeriod.period_start_date)}부터 가능합니다`,
                phase,
            }
        }

        // 학년 제한 체크
        if (
            studentGrade &&
            activePeriod.period_target_grades &&
            !activePeriod.period_target_grades.includes(studentGrade)
        ) {
            return {
                isOpen: false,
                message: `${activePeriod.period_target_grades.join(', ')}학년만 신청 가능합니다`,
                phase,
            }
        }

        // 2차 신청 자격 체크
        if (phase === 2 && phase2Eligibility && !phase2Eligibility.isEligible) {
            return {
                isOpen: false,
                message: '2차 신청 대상이 아닙니다',
                phase,
                reason: '1차에서 신청한 프로그램이 폐강되지 않았습니다',
            }
        }

        return {
            isOpen: true,
            message: `${phase}차 신청 진행중`,
            endDate: activePeriod.period_end_date,
            phase,
            cancelledPrograms: phase === 2 ? phase2Eligibility?.cancelledPrograms : undefined,
        }
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

    // 충돌 프로그램 ID 계산 + 충돌 과목명 맵
    const { conflictingProgramIds, conflictingCourseNamesMap } = useMemo(() => {
        if (!programs) return { conflictingProgramIds: new Set<string>(), conflictingCourseNamesMap: new Map<string, string[]>() }
        const conflicts = new Set<string>()
        const courseNamesMap = new Map<string, string[]>()

        // 신청한 프로그램 목록
        const appliedPrograms = programs.filter(p => appliedProgramIds.has(p.id))
        if (appliedPrograms.length === 0) return { conflictingProgramIds: conflicts, conflictingCourseNamesMap: courseNamesMap }

        // 각 미신청 프로그램에 대해 충돌 체크
        programs.forEach(program => {
            if (appliedProgramIds.has(program.id)) return

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
            if (result.hasConflict) {
                conflicts.add(program.id)
                // 충돌하는 과목명 추출
                const conflictNames = result.conflicts
                    .flatMap(c => c.programs.filter(pid => pid !== program.id))
                    .map(pid => appliedPrograms.find(p => p.id === pid)?.name)
                    .filter((n): n is string => !!n)
                courseNamesMap.set(program.id, [...new Set(conflictNames)])
            }
        })

        return { conflictingProgramIds: conflicts, conflictingCourseNamesMap: courseNamesMap }
    }, [programs, appliedProgramIds])

    // 신청 우선순위 맵
    const priorityMap = useMemo(() => {
        if (!applications) return new Map<string, number>()
        return new Map(
            applications
                .filter(a => isActiveApplicationStatus(a.status) && a.class_id !== null && a.priority !== null)
                .map(a => [a.class_id as string, a.priority as number])
        )
    }, [applications])

    // 필터링된 프로그램
    const filteredPrograms = useMemo(() => {
        if (!programs) return []

        let filtered = programs

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                p =>
                    p.name.toLowerCase().includes(query) ||
                    (p.teacher_name?.toLowerCase().includes(query) ?? false)
            )
        }

        return filtered
    }, [programs, searchQuery])

    // 내 신청 목록
    const myApplications = useMemo(() => {
        if (!applications) return []
        return applications.filter(a => isActiveApplicationStatus(a.status))
    }, [applications])

    // 내 신청 프로그램 (그리드용)
    const myApplicationPrograms = useMemo(() => {
        return myApplications
            .filter((app): app is typeof app & { class: NonNullable<typeof app.class> } => app.class !== null)
            .map(app => {
                // transformProgram과 동일한 변환 적용
                const classData = app.class
                return {
                    id: classData.id,
                    name: classData.name,
                    teacher_name: classData.teacher_name,
                    location: classData.location ? { name: classData.location.name } : null,
                    program_type: classData.program_type,
                    textbook_name: classData.textbook_name,
                    session_count: classData.session_count,
                    session_descriptions: classData.session_descriptions,
                    schedules: classData.schedules as RecurringSchedule[] | null,
                    target_grades: classData.target_grades,
                    min_students: null,
                    schedule_mode: normalizeScheduleMode(classData.schedule_mode) ?? 'recurring',
                    specific_dates: classData.specific_dates as SpecificDateSchedule[] | null,
                    periods_per_session: (classData as { periods_per_session?: number | null }).periods_per_session ?? null,
                }
            })
    }, [myApplications])

    // 전체 프로그램 (그리드용)
    const allTransformedPrograms = useMemo(() => {
        if (!programs) return []
        return programs.map(transformProgram)
    }, [programs])

    // PDF 생성 훅 (전체 프로그램 시간표 - 학생별 정보 없음)
    const { generatePdf, isGenerating } = useWeeklySchedulePdf({
        programs: allTransformedPrograms,
        periodPhase: activePeriod?.period_phase ?? 1,
    })

    // 프로그램 클릭 핸들러 - 상세 페이지로 이동
    const handleProgramClick = (programId: string) => {
        router.push(`/m/afterschool/${programId}`)
    }

    const isLoading = profileLoading || studentLoading || periodLoading || programsLoading || applicationsLoading || eligibilityLoading

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* 헤더 */}
            <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
                <div className="flex items-center gap-3">
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 -ml-2 rounded-lg hover:bg-gray-100"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                    )}
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold text-gray-900">
                            방과후 신청
                            {activePeriod?.period_term_name && (
                                <span className="text-gray-500 font-normal ml-1">
                                    ({activePeriod.period_term_name})
                                </span>
                            )}
                        </h1>
                    </div>
                </div>
            </div>

            {/* 신청 불가 상태 안내 */}
            {!enrollmentStatus.isOpen && (
                <div className="mx-4 mt-4 rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-gray-100">
                            <AlertCircle className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">신청 불가</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {enrollmentStatus.message}
                            </p>
                            {'reason' in enrollmentStatus && enrollmentStatus.reason && (
                                <p className="mt-1 text-xs text-gray-400">
                                    {enrollmentStatus.reason}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 2차 신청 안내 (대상자) */}
            {enrollmentStatus.isOpen && enrollmentStatus.phase === 2 && 'cancelledPrograms' in enrollmentStatus && enrollmentStatus.cancelledPrograms && enrollmentStatus.cancelledPrograms.length > 0 && (
                <div className="mx-4 mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-blue-100">
                            <AlertCircle className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-medium text-blue-900">2차 신청 안내</h3>
                            <p className="mt-1 text-sm text-blue-700">
                                아래 프로그램이 폐강되어 2차 신청이 가능합니다:
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1">
                                {enrollmentStatus.cancelledPrograms.map((prog) => (
                                    <span
                                        key={prog.classId}
                                        className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded"
                                    >
                                        {prog.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 탭 & 컨텐츠 */}
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex-1 flex flex-col"
            >
                <TabsList className="mx-4 mt-4 grid w-auto grid-cols-2">
                    <TabsTrigger value="available" className="gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        프로그램 목록
                    </TabsTrigger>
                    <TabsTrigger value="my" className="gap-1.5">
                        내 신청 목록
                        {myApplications.length > 0 && (
                            <span className="ml-1 rounded-full bg-indigo-100 px-1.5 py-0.5 text-xs text-indigo-600">
                                {myApplications.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="available" className="flex-1 mt-4 px-4 pb-4">
                    {/* 헤더: 검색/토글/PDF버튼 */}
                    <div className="mb-4 flex items-center gap-2">
                        {/* 검색 (목록 뷰에서만) */}
                        {viewMode === 'list' && (
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="프로그램명, 선생님 검색"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        )}

                        {/* 그리드 뷰에서 제목 */}
                        {viewMode === 'grid' && (
                            <div className="flex-1 text-sm font-medium text-gray-700">
                                주간 시간표
                            </div>
                        )}

                        {/* 뷰 토글 버튼 */}
                        <div className="flex items-center border rounded-lg p-0.5 bg-gray-100">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode('list')}
                                className={`h-8 px-2 ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode('grid')}
                                className={`h-8 px-2 ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                            >
                                <CalendarDays className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* PDF 다운로드 버튼 (그리드 뷰에서만) */}
                        {viewMode === 'grid' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={generatePdf}
                                disabled={isGenerating}
                                className="h-8 px-2"
                            >
                                {isGenerating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="h-4 w-4" />
                                )}
                            </Button>
                        )}
                    </div>

                    {/* 목록 뷰 */}
                    {viewMode === 'list' && (
                        <ScrollArea className="flex-1 -mx-4 px-4">
                            <div className="space-y-3 pb-20">
                                {filteredPrograms.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        {searchQuery
                                            ? '검색 결과가 없습니다'
                                            : '신청 가능한 프로그램이 없습니다'}
                                    </div>
                                ) : (
                                    filteredPrograms.map(program => {
                                        const transformed = transformProgram(program)
                                        const programEnrolledCount = enrollmentCounts?.get(program.id)
                                        return (
                                            <ProgramCard
                                                key={program.id}
                                                program={{
                                                    ...transformed,
                                                    max_capacity: (program as { max_capacity?: number | null }).max_capacity ?? null,
                                                }}
                                                isApplied={appliedProgramIds.has(program.id)}
                                                hasConflict={conflictingProgramIds.has(program.id)}
                                                applicationStatus={
                                                    applicationStatusMap.get(program.id)?.status as import('@/hooks/useStudentApplications').AfterschoolApplicationStatus | null
                                                }
                                                priority={priorityMap.get(program.id) ?? null}
                                                enrolledCount={programEnrolledCount}
                                                conflictingCourseNames={conflictingCourseNamesMap.get(program.id)}
                                                isPhase2={enrollmentStatus.phase === 2}
                                                onClick={() => handleProgramClick(program.id)}
                                            />
                                        )
                                    })
                                )}
                            </div>
                        </ScrollArea>
                    )}

                    {/* 그리드 뷰 */}
                    {viewMode === 'grid' && (
                        <div className="pb-20 overflow-auto">
                            <AvailableProgramsGrid
                                programs={allTransformedPrograms}
                                appliedClassIds={appliedProgramIds}
                                applicationStatusMap={applicationStatusMap}
                                onProgramClick={(program) => handleProgramClick(program.id)}
                                enrollmentCounts={enrollmentCounts}
                                programMaxCapacities={programs}
                                isPhase2={isPhase2}
                            />
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="my" className="flex-1 mt-4 px-4 pb-4 overflow-auto">
                    {myApplications.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            신청한 프로그램이 없습니다
                        </div>
                    ) : (
                        <div className="pb-20 space-y-4">
                            {/* 신청 요약 카드 */}
                            <ApplicationSummary applications={myApplications} />

                            {/* 1차 신청 중에만 우선순위 조정 표시 */}
                            {enrollmentStatus.phase === 1 && studentId && (
                                <PriorityRanker
                                    applications={myApplications}
                                    studentId={studentId}
                                    onPrioritiesChanged={() => {
                                        // 실시간 구독이 자동으로 데이터를 갱신함
                                    }}
                                />
                            )}

                            {/* 2차 신청인 경우: 우선순위 없이 목록만 표시 */}
                            {enrollmentStatus.phase === 2 && (
                                <div className="rounded-xl border border-purple-200 bg-purple-50 p-3 mb-2">
                                    <p className="text-sm text-purple-700">
                                        2차 신청에서는 우선순위 조정이 불가합니다.
                                    </p>
                                </div>
                            )}

                            {/* 주별 아코디언 그리드 */}
                            <WeeklyAccordionGrid
                                programs={myApplicationPrograms}
                                appliedClassIds={appliedProgramIds}
                                applicationStatusMap={applicationStatusMap}
                                onProgramClick={(program) => handleProgramClick(program.id)}
                            />
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
