// @ts-nocheck
'use client'

import { useState } from 'react'
import {
  BookOpen,
  CheckCircle2,
  Loader2,
  Clock,
  XCircle,
  AlertTriangle,
  CheckCheck,
} from 'lucide-react'
import { useStudentExtendedStudy } from '@/hooks/useStudentExtendedStudy'
import { formatExtendedStudyPeriodRange } from '@/utils/extendedStudy'

interface ExtendedStudyRequestViewProps {
  onClose?: () => void
}

type LocalStep = 'idle' | 'checking' | 'success' | 'cancelled'

export function ExtendedStudyRequestView({ onClose }: ExtendedStudyRequestViewProps) {
  const [localStep, setLocalStep] = useState<LocalStep>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    status,
    isPeriodActive,
    activePeriod,
    canSubmit,
    canCancel,
    timeCheck,
    isLoading,
    submitExtendedStudy,
    cancelExtendedStudy,
    isSubmitting,
    isCancelling,
  } = useStudentExtendedStudy()

  const handleSubmit = async () => {
    setLocalStep('checking')
    setErrorMessage(null)

    try {
      await submitExtendedStudy()
      setLocalStep('success')
    } catch (error) {
      setErrorMessage((error as Error).message || '신청에 실패했습니다.')
      setLocalStep('idle')
    }
  }

  const handleCancel = async () => {
    setLocalStep('checking')
    setErrorMessage(null)

    try {
      await cancelExtendedStudy()
      setLocalStep('cancelled')
    } catch (error) {
      setErrorMessage((error as Error).message || '취소에 실패했습니다.')
      setLocalStep('idle')
    }
  }

  // 로딩 중
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    )
  }

  // 연장학습 기간이 아닌 경우
  if (!isPeriodActive) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center mb-6">
          <BookOpen className="w-12 h-12 text-pink-400" />
        </div>
        <h3 className="text-lg font-bold text-pink-900 mb-2">연장학습 기간이 아닙니다</h3>
        <p className="text-pink-600 text-sm mb-8">
          현재 연장학습 신청 기간이 아닙니다.
          <br />
          기간이 시작되면 다시 시도해주세요.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-pink-100 text-pink-700 py-4 rounded-xl font-bold active:scale-95 transition-transform"
        >
          돌아가기
        </button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* 연장학습 기간 정보 */}
      <div className="mb-6">
        <div className="bg-pink-50 rounded-2xl p-4">
          <p className="text-xs text-pink-600 font-bold mb-2">연장학습 기간</p>
          <p className="text-sm font-bold text-gray-900 mb-1">
            {activePeriod?.name || '연장학습'}
          </p>
          {activePeriod && (
            <p className="text-xs text-gray-500">
              {formatExtendedStudyPeriodRange(
                activePeriod.study_start_date,
                activePeriod.study_end_date
              )}
            </p>
          )}
        </div>
      </div>

      {/* 시간 제한 경고 */}
      {!timeCheck.canRequest && (
        <div className="bg-orange-50 text-orange-700 text-xs p-3 rounded-xl mb-4 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{timeCheck.reason}</span>
        </div>
      )}

      {/* 에러 메시지 */}
      {errorMessage && (
        <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl mb-4 flex items-start gap-2">
          <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* 처리 중 */}
        {localStep === 'checking' && (
          <>
            <Loader2 className="w-16 h-16 text-pink-500 animate-spin mb-6" />
            <h3 className="text-lg font-bold mb-2">처리 중...</h3>
            <p className="text-gray-500 text-sm">잠시만 기다려주세요.</p>
          </>
        )}

        {/* 신청 성공 */}
        {localStep === 'success' && (
          <>
            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">신청 완료!</h3>
            <p className="text-gray-500 text-sm mb-8">
              연장학습 신청이 완료되었습니다.
              <br />
              사감 선생님 확인을 기다려주세요.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold active:scale-95 transition-transform"
            >
              확인
            </button>
          </>
        )}

        {/* 취소 성공 */}
        {localStep === 'cancelled' && (
          <>
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-16 h-16 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">취소 완료</h3>
            <p className="text-gray-500 text-sm mb-8">
              연장학습 신청이 취소되었습니다.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-bold active:scale-95 transition-transform"
            >
              돌아가기
            </button>
          </>
        )}

        {/* 기본 상태 (idle) */}
        {localStep === 'idle' && (
          <>
            {/* 미등록 상태 */}
            {!status?.is_registered && (
              <>
                <div className="w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="w-12 h-12 text-pink-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">연장학습 신청</h3>
                <p className="text-gray-500 text-sm mb-8">
                  오늘 연장학습을 신청합니다.
                  <br />
                  23:50까지 신청 가능합니다.
                </p>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isSubmitting}
                  className="w-full bg-pink-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-pink-200 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  연장학습 신청하기
                </button>
              </>
            )}

            {/* 등록됨 (미확인) */}
            {status?.is_registered && !status?.is_verified && (
              <>
                <div className="w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center mb-6">
                  <Clock className="w-16 h-16 text-pink-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">신청 완료</h3>
                <p className="text-gray-500 text-sm mb-2">
                  연장학습 신청이 완료되었습니다.
                </p>
                {status?.registered_at && (
                  <p className="text-xs text-gray-400 mb-6">
                    {new Date(status.registered_at).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}에 신청됨
                    {status.registered_by_self ? '' : ' (사감 등록)'}
                  </p>
                )}
                <p className="text-orange-600 text-xs mb-8">
                  사감 선생님 확인 전에는 취소가 가능합니다.
                </p>

                <button
                  onClick={handleCancel}
                  disabled={!canCancel || isCancelling}
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

            {/* 확인됨 */}
            {status?.is_registered && status?.is_verified && (
              <>
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCheck className="w-16 h-16 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">확인 완료</h3>
                <p className="text-gray-500 text-sm mb-8">
                  사감 선생님이 출석을 확인했습니다.
                  <br />
                  열심히 공부하세요!
                </p>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-bold active:scale-95 transition-transform"
                >
                  돌아가기
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
