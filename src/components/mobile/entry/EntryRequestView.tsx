// @ts-nocheck
'use client'

import { useState, useMemo } from 'react'
import { LogIn, CheckCircle2, Loader2, Clock, XCircle, Info, AlertCircle } from 'lucide-react'
import { useStudentEntry } from '@/hooks/useStudentEntry'

interface EntryRequestViewProps {
  onClose?: () => void
}

type Step = 'idle' | 'checking' | 'success' | 'pending' | 'error' | 'already_done' | 'cancelling' | 'cancelled'

export function EntryRequestView({ onClose }: EntryRequestViewProps) {
  const [localStep, setLocalStep] = useState<Step>('idle')
  const {
    monthlyCount,
    todayEntry,
    canAutoApprove,
    remainingFreeEntries,
    isLoading,
    submitEntry,
    isSubmitting,
    submitError,
    // 취소 관련
    canCancel,
    isCancellationTimeExpired,
    cancelEntry,
    isCancelling,
    // 운영 기간 관련
    hasOperationalOverride,
    operationalPeriodName,
    operationalRequireApproval,
    effectiveAutoApprovalLimit,
    // 무료 입실 시간 관련
    isAfterCutoff,
    freeEntryCutoffTime,
  } = useStudentEntry()

  // 이미 오늘 조기입실한 경우 상태를 파생 상태로 처리
  const step = useMemo<Step>(() => {
    // 로컬 상태가 특정 액션 중이면 우선 사용 (submit/cancel 후 즉각적인 피드백)
    if (localStep === 'checking' || localStep === 'success' || localStep === 'cancelling' || localStep === 'cancelled') {
      return localStep
    }

    // todayEntry 기반 상태
    if (todayEntry) {
      if (todayEntry.approval_status === 'pending') {
        return 'pending'
      } else if (
        todayEntry.approval_status === 'approved' ||
        todayEntry.approval_status === 'auto_approved'
      ) {
        return 'already_done'
      } else if (todayEntry.approval_status === 'rejected') {
        return 'error'
      }
    }

    // 기본 상태
    return localStep
  }, [todayEntry, localStep])

  // setStep을 localStep setter로 대체
  const setStep = setLocalStep

  const handleSubmit = async () => {
    setStep('checking')

    try {
      const result = await submitEntry()

      // 결과에 따라 상태 설정
      if (result.status === 'auto_approved') {
        setStep('success')
      } else if (result.status === 'pending') {
        setStep('pending')
      }
    } catch {
      setStep('error')
    }
  }

  const handleCancel = async () => {
    setStep('cancelling')

    try {
      await cancelEntry()
      setStep('cancelled')
    } catch {
      // 취소 실패 시 이전 상태로 복귀
      setStep('idle')
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#6866F1] animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* 운영 기간 배너 */}
      {hasOperationalOverride && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-amber-600" />
            <p className="text-xs font-bold text-amber-900">
              {operationalPeriodName || '운영 기간'} 적용 중
            </p>
          </div>
          <p className="text-xs text-amber-700">
            {operationalRequireApproval
              ? '현재 운영 기간 중 모든 조기입실에 사감 선생님 승인이 필요합니다.'
              : effectiveAutoApprovalLimit !== undefined
                ? `자동 승인 한도: ${effectiveAutoApprovalLimit}회`
                : '운영 기간 설정이 적용되어 있습니다.'}
          </p>
        </div>
      )}

      {/* 무료 입실 시간 안내 배너 */}
      {isAfterCutoff && freeEntryCutoffTime && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-green-600" />
            <p className="text-xs font-bold text-green-900">무료 입실 시간</p>
          </div>
          <p className="text-xs text-green-700">
            <span className="font-bold">{freeEntryCutoffTime.slice(0, 5)}</span> 이후 입실이므로
            프리패스 횟수가 차감되지 않습니다.
          </p>
        </div>
      )}

      {/* 월별 현황 표시 */}
      <div className="mb-6">
        <div className="bg-indigo-50 rounded-2xl p-4">
          <p className="text-xs text-indigo-600 font-bold mb-2">이번 달 조기입실 현황</p>
          <div className="flex items-center gap-3">
            {/* 프로그레스 바 */}
            <div className="flex-1 h-2 bg-indigo-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6866F1] rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (monthlyCount / Math.max(effectiveAutoApprovalLimit || 4, 1)) * 100)}%` }}
              />
            </div>
            <span className="text-sm font-bold text-gray-900">
              {monthlyCount}/{effectiveAutoApprovalLimit || 4}회
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {remainingFreeEntries > 0
              ? `자동 승인 ${remainingFreeEntries}회 남음`
              : '자동 승인 횟수를 모두 사용했습니다'}
          </p>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Idle 상태 */}
        {step === 'idle' && (
          <>
            <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <LogIn className="w-12 h-12 text-[#6866F1]" />
            </div>
            <h3 className="text-lg font-bold mb-6">조기입실 신청</h3>

            <div className="bg-indigo-50 rounded-2xl p-5 mb-8 border border-indigo-100 space-y-3 text-left">
              <div className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#6866F1] text-white text-xs font-bold">
                  1
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  예를 들어, 학기 초부터 시험 기간 2주 전까지의 기간이 <span className="font-bold text-indigo-700">N주</span>라면, 그 기간에 총 <span className="font-bold text-indigo-700">N번</span>의 조기입실이 가능합니다.
                </p>
              </div>

              <div className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#6866F1] text-white text-xs font-bold">
                  2
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-orange-700">N번을 초과</span>하여 조기 입실을 신청한 경우 학부모에게 알림이 가고, 사감팀장 승인 후에 조기입실이 가능합니다.
                </p>
              </div>
            </div>
            {!canAutoApprove && (
              <div className="bg-orange-50 text-orange-700 text-xs p-3 rounded-xl mb-4 w-full">
                <Clock className="w-4 h-4 inline-block mr-1" />
                자동 승인 횟수 초과로 사감 선생님 승인이 필요합니다.
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-[#6866F1] text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              조기입실 신청
            </button>
          </>
        )}

        {/* 확인 중 */}
        {step === 'checking' && (
          <>
            <Loader2 className="w-16 h-16 text-[#6866F1] animate-spin mb-6" />
            <h3 className="text-lg font-bold mb-2">조기입실 신청 중...</h3>
            <p className="text-gray-500 text-sm">잠시만 기다려주세요.</p>
          </>
        )}

        {/* 성공 (자동 승인) */}
        {step === 'success' && (
          <>
            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">조기입실 신청 완료!</h3>
            <p className="text-gray-500 text-sm mb-2">
              조기입실 신청이 완료되었습니다. 별도의 승인이 필요 없습니다
            </p>
            <p className="text-orange-600 text-xs mb-6">
              취소하려면 아래 버튼을 누르세요
            </p>
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="w-full bg-gray-100 text-red-600 py-4 rounded-xl font-bold active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed mb-3"
            >
              신청 취소하기
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold active:scale-95 transition-transform"
            >
              확인
            </button>
          </>
        )}

        {/* 승인 대기 */}
        {step === 'pending' && (
          <>
            <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Clock className="w-16 h-16 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">승인 대기 중</h3>
            <p className="text-gray-500 text-sm mb-2">
              조기입실 신청이 접수되었습니다.
              <br />
              사감 선생님 승인을 기다리고 있습니다.
            </p>
            <p className="text-orange-600 text-xs mb-6">
              사감 선생님 승인 전까지 취소가 가능합니다
            </p>
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="w-full bg-gray-100 text-red-600 py-4 rounded-xl font-bold active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed mb-3"
            >
              신청 취소하기
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-bold active:scale-95 transition-transform"
            >
              확인
            </button>
          </>
        )}

        {/* 이미 조기입실 완료 */}
        {step === 'already_done' && (
          <>
            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">
              {todayEntry?.approval_status === 'auto_approved' ? '조기입실 신청 완료' : '오늘 조기입실 완료'}
            </h3>
            <p className="text-gray-500 text-sm mb-2">
              {todayEntry?.approval_status === 'auto_approved'
                ? '조기입실 신청이 완료되었습니다. 별도의 승인이 필요 없습니다'
                : '오늘 조기입실 처리가 완료되었습니다.'}
            </p>
            {canCancel ? (
              <>
                <p className="text-orange-600 text-xs mb-6">
                  취소하려면 아래 버튼을 누르세요
                </p>
                <button
                  onClick={handleCancel}
                  disabled={isCancelling}
                  className="w-full bg-gray-100 text-red-600 py-4 rounded-xl font-bold active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                >
                  신청 취소하기
                </button>
              </>
            ) : (
              <p className="text-xs text-gray-400 mb-6">
                {isCancellationTimeExpired
                  ? '18:50 이후에는 조기입실을 취소할 수 없습니다'
                  : '사감 선생님이 승인하여 취소할 수 없습니다'}
              </p>
            )}
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-bold active:scale-95 transition-transform"
            >
              돌아가기
            </button>
          </>
        )}

        {/* 에러 / 거절됨 */}
        {step === 'error' && (
          <>
            <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-16 h-16 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">
              {todayEntry?.approval_status === 'rejected' ? '조기입실 거절됨' : '오류 발생'}
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              {todayEntry?.rejection_reason ||
                (submitError as Error)?.message ||
                '조기입실 신청 중 문제가 발생했습니다.'}
            </p>
            {todayEntry?.approval_status !== 'rejected' && (
              <button
                onClick={() => setStep('idle')}
                className="w-full bg-[#6866F1] text-white py-4 rounded-xl font-bold active:scale-95 transition-transform mb-3"
              >
                다시 시도
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-bold active:scale-95 transition-transform"
            >
              돌아가기
            </button>
          </>
        )}

        {/* 취소 중 */}
        {step === 'cancelling' && (
          <>
            <Loader2 className="w-16 h-16 text-[#6866F1] animate-spin mb-6" />
            <h3 className="text-lg font-bold mb-2">취소 중...</h3>
            <p className="text-gray-500 text-sm">잠시만 기다려주세요.</p>
          </>
        )}

        {/* 취소 완료 */}
        {step === 'cancelled' && (
          <>
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-16 h-16 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">취소 완료</h3>
            <p className="text-gray-500 text-sm mb-8">
              조기입실 신청이 취소되었습니다.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-bold active:scale-95 transition-transform"
            >
              돌아가기
            </button>
          </>
        )}
      </div>
    </div>
  )
}
