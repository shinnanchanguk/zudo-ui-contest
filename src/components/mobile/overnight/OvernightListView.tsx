// @ts-nocheck
'use client'

import { Moon, Clock, Loader2, Plus } from 'lucide-react'
import { useStudentOvernight, STUDENT_OVERNIGHT_CATEGORIES } from '@/hooks/useStudentOvernight'
import { cn } from '@/lib/utils'

interface OvernightListViewProps {
  onNewRequest: () => void
  onClose?: () => void
}

export function OvernightListView({ onNewRequest }: OvernightListViewProps) {
  const {
    overnightRequests,
    pendingRequests,
    isLoading,
    cancelOvernight,
    isCancelling,
  } = useStudentOvernight()

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

  const handleCancel = async (recordId: string) => {
    try {
      await cancelOvernight(recordId)
    } catch (error) {
      alert((error as Error).message)
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-[#6866F1] animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col p-6">
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
        onClick={onNewRequest}
        className="w-full bg-[#6866F1] text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-transform flex items-center justify-center gap-2 mb-6"
      >
        <Plus className="w-5 h-5" />
        새 외박 신청
      </button>

      {/* 신청 내역 */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
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
