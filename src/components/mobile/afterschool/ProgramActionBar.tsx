// @ts-nocheck
'use client'

import { Button } from '@/components/ui/button'
import { Loader2, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    isActiveApplicationStatus,
    type AfterschoolApplicationStatus,
} from '@/hooks/useStudentApplications'

type ApplicationStatus = AfterschoolApplicationStatus | null

interface ProgramActionBarProps {
    isApplied: boolean
    applicationStatus: ApplicationStatus
    hasConflict: boolean
    conflictMessage?: string
    isApplicationAvailable?: boolean
    isWithinEnrollmentPeriod: boolean
    isPhase2?: boolean
    remainingCapacity?: number
    onApply: () => void
    onCancel: () => void
    isApplying: boolean
    isCancelling: boolean
}

export function ProgramActionBar({
    isApplied,
    applicationStatus,
    hasConflict,
    conflictMessage,
    isApplicationAvailable = true,
    isWithinEnrollmentPeriod,
    isPhase2 = false,
    remainingCapacity,
    onApply,
    onCancel,
    isApplying,
    isCancelling,
}: ProgramActionBarProps) {
    // Phase 2 전용 차단 조건
    const isPhase2Full = isPhase2 && remainingCapacity !== undefined && remainingCapacity <= 0
    const isPhase2Conflict = isPhase2 && hasConflict

    const canApply = !isApplied && isApplicationAvailable && isWithinEnrollmentPeriod
        && !isPhase2Full && !isPhase2Conflict
    const canCancel = isApplied &&
        isActiveApplicationStatus(applicationStatus) &&
        isWithinEnrollmentPeriod

    return (
        <div className="sticky bottom-0 border-t bg-white px-4 py-4 pb-safe">
            {isApplied ? (
                <div className="flex items-center gap-3">
                    {/* 상태 배지 */}
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

                    {/* 취소 버튼 */}
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
                <div className="space-y-2">
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
                        ) : isPhase2Full ? (
                            '정원이 마감되었습니다'
                        ) : isPhase2Conflict ? (
                            '시간이 겹쳐 신청할 수 없습니다'
                        ) : !isApplicationAvailable ? (
                            '현재 신청 가능한 강좌가 아닙니다'
                        ) : !isWithinEnrollmentPeriod ? (
                            '신청 기간이 아닙니다'
                        ) : hasConflict ? (
                            '경고 확인 후 신청하기'
                        ) : (
                            '신청하기'
                        )}
                    </Button>

                    {/* Phase 2: 차단 사유 메시지 */}
                    {isPhase2Conflict && (
                        <p className="text-xs leading-5 text-red-600">
                            {conflictMessage ?? '확정된 강좌와 시간이 겹칩니다. 기존 강좌를 취소하면 신청 가능합니다.'}
                        </p>
                    )}

                    {/* Phase 1: 충돌 경고 (신청은 가능) */}
                    {!isPhase2 && hasConflict && canApply && (
                        <p className="text-xs leading-5 text-amber-700">
                            {conflictMessage ?? '이미 신청한 강좌와 시간이 겹칩니다. 신청은 가능하지만, 최종 조정에서 우선순위가 낮은 강좌는 취소될 수 있습니다.'}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
