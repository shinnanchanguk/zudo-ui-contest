// @ts-nocheck
'use client'

/**
 * @deprecated This component is deprecated and will be removed.
 * Use OvernightListView and OvernightFormView instead.
 * - OvernightListView: 외박 신청 목록 표시
 * - OvernightFormView: 새 외박 신청 폼
 */

import { useState } from 'react'
import {
  Moon,
  Calendar,
  Clock,
  Loader2,
  Plus,
  X,
} from 'lucide-react'
import { useStudentOvernight, STUDENT_OVERNIGHT_CATEGORIES } from '@/hooks/useStudentOvernight'
import { cn } from '@/lib/utils'
import { getTodayKst } from '@/lib/kst'
import { Database } from '@/types/supabase'

type OvernightCategory = Database['public']['Enums']['overnight_category']

interface OvernightRequestViewProps {
  onClose?: () => void
}

type ViewMode = 'list' | 'form'

/**
 * @deprecated Use OvernightListView and OvernightFormView instead.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function OvernightRequestView({ onClose }: OvernightRequestViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [formData, setFormData] = useState({
    startDate: '',
    returnDate: '',
    reasonCategory: '' as OvernightCategory | '',
    reason: '',
  })
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    overnightRequests,
    pendingRequests,
    isLoading,
    submitOvernight,
    isSubmitting,
    cancelOvernight,
    isCancelling,
  } = useStudentOvernight()

  // 오늘 날짜 (신청 시작일 최소값, KST 기준)
  const today = getTodayKst()

  const handleSubmit = async () => {
    setSubmitError(null)

    if (!formData.startDate || !formData.returnDate) {
      setSubmitError('날짜를 선택해주세요.')
      return
    }

    if (!formData.reasonCategory) {
      setSubmitError('사유를 선택해주세요.')
      return
    }

    if (!formData.reason.trim()) {
      setSubmitError('상세 사유를 입력해주세요.')
      return
    }

    try {
      await submitOvernight({
        startDate: formData.startDate,
        returnDate: formData.returnDate,
        reasonCategory: formData.reasonCategory,
        reason: formData.reason.trim(),
      })

      // 성공 시 폼 초기화 및 목록으로 이동
      setFormData({
        startDate: '',
        returnDate: '',
        reasonCategory: '',
        reason: '',
      })
      setViewMode('list')
    } catch (error) {
      setSubmitError((error as Error).message)
    }
  }

  const handleCancel = async (recordId: string) => {
    try {
      await cancelOvernight(recordId)
    } catch (error) {
      alert((error as Error).message)
    }
  }

  // 날짜 포맷
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    })
  }

  // 상태 배지
  const StatusBadge = ({
    status,
  }: {
    status?: 'pending' | 'approved' | 'rejected'
  }) => {
    const config = {
      pending: { bg: 'bg-orange-100', text: 'text-orange-700', label: '승인 대기' },
      approved: { bg: 'bg-green-100', text: 'text-green-700', label: '승인됨' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: '거절됨' },
    }

    const c = config[status || 'pending']

    return (
      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', c.bg, c.text)}>
        {c.label}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#6866F1] animate-spin" />
      </div>
    )
  }

  // 신청 폼 뷰
  if (viewMode === 'form') {
    return (
      <div className="h-full flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">새 외박 신청</h3>
          <button
            onClick={() => setViewMode('list')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 폼 */}
        <div className="flex-1 min-h-0 space-y-4 overflow-y-auto overscroll-contain">
          {/* 날짜 선택 */}
          <div className="bg-indigo-50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold mb-2">
              <Calendar className="w-4 h-4" />
              외박 기간
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">시작일</label>
                <input
                  type="date"
                  min={today}
                  value={formData.startDate}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                      // 시작일 변경 시 복귀일이 시작일보다 이전이면 초기화
                      returnDate:
                        prev.returnDate && prev.returnDate < e.target.value
                          ? ''
                          : prev.returnDate,
                    }))
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">복귀일</label>
                <input
                  type="date"
                  min={formData.startDate || today}
                  value={formData.returnDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, returnDate: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* 사유 카테고리 선택 */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">사유 분류</label>
            <div className="grid grid-cols-2 gap-2">
              {STUDENT_OVERNIGHT_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, reasonCategory: cat.value }))
                  }
                  className={cn(
                    'px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors',
                    formData.reasonCategory === cat.value
                      ? 'border-[#6866F1] bg-indigo-50 text-[#6866F1]'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 상세 사유 */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">상세 사유</label>
            <textarea
              value={formData.reason}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reason: e.target.value }))
              }
              placeholder="외박 사유를 상세히 입력해주세요"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* 에러 메시지 */}
          {submitError && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl">
              {submitError}
            </div>
          )}
        </div>

        {/* 제출 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-[#6866F1] text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              신청 중...
            </span>
          ) : (
            '외박 신청하기'
          )}
        </button>
      </div>
    )
  }

  // 목록 뷰
  return (
    <div className="h-full flex flex-col">
      {/* 승인 대기 중인 신청 */}
      {pendingRequests.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-bold text-gray-500 mb-2">승인 대기 중</h4>
          <div className="space-y-2">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-orange-50 rounded-2xl p-4 border border-orange-100"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <span className="font-bold text-gray-900">
                      {formatDate(request.start_date)} ~ {formatDate(request.return_date || request.start_date)}
                    </span>
                  </div>
                  <StatusBadge status={request.approval_status as 'pending' | 'approved' | 'rejected'} />
                </div>
                <p className="text-sm text-gray-600 mb-3">{request.reason}</p>
                <button
                  onClick={() => handleCancel(request.id)}
                  disabled={isCancelling}
                  className="text-sm text-red-600 font-medium hover:text-red-700"
                >
                  신청 취소
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 새 신청 버튼 */}
      <button
        onClick={() => setViewMode('form')}
        className="w-full bg-[#6866F1] text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-transform flex items-center justify-center gap-2 mb-6"
      >
        <Plus className="w-5 h-5" />
        새 외박 신청
      </button>

      {/* 신청 내역 */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <h4 className="text-sm font-bold text-gray-500 mb-2">신청 내역</h4>

        {overnightRequests.length === 0 ? (
          <div className="text-center py-12">
            <Moon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">외박 신청 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {overnightRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-2xl p-4 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-bold text-gray-900">
                      {formatDate(request.start_date)} ~ {formatDate(request.return_date || request.start_date)}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {STUDENT_OVERNIGHT_CATEGORIES.find(
                        (c) => c.value === request.reason_category
                      )?.label || request.reason_category}
                    </p>
                  </div>
                  <StatusBadge status={request.approval_status as 'pending' | 'approved' | 'rejected'} />
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{request.reason}</p>

                {/* 거절 사유 표시 */}
                {request.approval_status === 'rejected' && request.rejection_reason && (
                  <div className="mt-2 p-2 bg-red-50 rounded-lg">
                    <p className="text-xs text-red-600">
                      <span className="font-medium">거절 사유:</span>{' '}
                      {request.rejection_reason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
