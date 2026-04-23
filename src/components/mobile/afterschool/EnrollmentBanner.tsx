// @ts-nocheck
'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap, ChevronRight, CheckCircle2, Clock } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '@/hooks/useAuth'
import { useActiveEnrollmentPeriod } from '@/hooks/useEnrollmentPeriods'
import { parseISO, differenceInDays, isBefore } from 'date-fns'
import { cn } from '@/lib/utils'
import {
    isWithinEnrollmentPeriod,
    getEnrollmentStartTime,
    formatEnrollmentDateTime,
} from '@/lib/afterschool/enrollmentPeriod'

interface BannerConfig {
    message: string
    bgClass: string
    shadowClass: string
    icon: 'graduation' | 'clock' | 'check'
    show: boolean
    dday?: string
    ddayUrgent?: boolean
}

const HIDDEN_BANNER_CONFIG: BannerConfig = {
    show: false,
    message: '방과후 프로그램 준비 중',
    bgClass: 'bg-gray-200',
    shadowClass: 'shadow-gray-300/50',
    icon: 'clock',
}

/**
 * 방과후 수강신청 배너 컴포넌트
 * 워크플로우 상태에 따라 다른 메시지와 스타일을 표시
 * 신청 기간 중에만 활성 표시, 클릭 시 /m/afterschool로 이동
 */
export function EnrollmentBanner() {
    const router = useRouter()
    const supabase = createClient()
    const { data: profile } = useProfile()
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
        retry: 1,
        refetchOnWindowFocus: false,
    })
    const studentGrade = studentData?.grade ?? null
    const { data: activePeriod, isLoading: periodLoading } = useActiveEnrollmentPeriod({
        gradeLevel: studentGrade,
    })

    // 배너 설정 계산
    const bannerConfig = useMemo(() => {
        if (!activePeriod?.period_is_active) {
            return HIDDEN_BANNER_CONFIG
        }

        const now = new Date()
        const end = parseISO(activePeriod.period_end_date)
        const enrollmentStart = getEnrollmentStartTime(activePeriod.period_start_date)
        const phaseText = activePeriod.period_phase === 1 ? '1차' : '2차'

        // 시작 전: 오픈 예정 안내
        if (isBefore(now, enrollmentStart)) {
            const startDateTime = formatEnrollmentDateTime(activePeriod.period_start_date)
            return {
                show: true,
                message: `방과후 ${phaseText} 수강신청 ${startDateTime} 오픈`,
                bgClass: 'bg-amber-200',
                shadowClass: 'shadow-amber-300/50',
                icon: 'clock' as const,
            }
        }

        // 신청 기간 내
        if (isWithinEnrollmentPeriod(activePeriod.period_start_date, activePeriod.period_end_date)) {
            const daysLeft = differenceInDays(end, now)
            const ddayText = daysLeft === 0
                ? 'D-Day'
                : `D-${daysLeft}`
            const endDateTime = formatEnrollmentDateTime(activePeriod.period_end_date)

            return {
                show: true,
                message: `방과후 ${phaseText} 수강신청 진행 중 (~${endDateTime})`,
                bgClass: activePeriod.period_phase === 1
                    ? 'bg-[#4ade80]'
                    : 'bg-purple-300',
                shadowClass: activePeriod.period_phase === 1
                    ? 'shadow-green-300/50'
                    : 'shadow-purple-300/50',
                icon: 'graduation' as const,
                dday: ddayText,
                ddayUrgent: daysLeft <= 3,
            }
        }

        return HIDDEN_BANNER_CONFIG
    }, [activePeriod])

    // 로딩 중이거나 표시 조건 미충족 시 렌더링하지 않음
    if (periodLoading || studentLoading || !bannerConfig.show) {
        return null
    }

    const handleClick = () => {
        router.push('/m/afterschool')
    }

    const IconComponent = bannerConfig.icon === 'check'
        ? CheckCircle2
        : bannerConfig.icon === 'clock'
            ? Clock
            : GraduationCap

    return (
        <button
            type="button"
            onClick={handleClick}
            className={cn(
                'w-full rounded-2xl px-4 py-3',
                'shadow-lg active:scale-[0.98] transition-transform',
                'flex items-center',
                bannerConfig.bgClass,
                bannerConfig.shadowClass,
            )}
        >
            {/* 아이콘 */}
            <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-5 h-5 text-gray-900" />
            </div>

            {/* 텍스트 */}
            <div className="flex-1 ml-3 text-left">
                <p className="text-base font-bold text-gray-900">
                    {bannerConfig.message}
                </p>
            </div>

            {/* D-day 뱃지 */}
            {bannerConfig.dday && (
                <div className={cn(
                    'px-2.5 py-1 rounded-lg text-sm font-extrabold flex-shrink-0',
                    bannerConfig.ddayUrgent
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-black/15 text-gray-900',
                )}>
                    {bannerConfig.dday}
                </div>
            )}

            {/* 화살표 */}
            <ChevronRight className="w-5 h-5 text-gray-900/70 flex-shrink-0" />
        </button>
    )
}
