// @ts-nocheck
'use client'

import { useState } from 'react'
import { Calendar, Loader2, X } from 'lucide-react'
import { useStudentOvernight, STUDENT_OVERNIGHT_CATEGORIES } from '@/hooks/useStudentOvernight'
import { cn } from '@/lib/utils'
import { getTodayKst } from '@/lib/kst'
import { Database } from '@/types/supabase'

type OvernightCategory = Database['public']['Enums']['overnight_category']

interface OvernightFormViewProps {
  onClose: () => void
  onSuccess?: () => void
}

export function OvernightFormView({ onClose, onSuccess }: OvernightFormViewProps) {
  const [formData, setFormData] = useState({
    startDate: '',
    returnDate: '',
    reasonCategory: '' as OvernightCategory | '',
    reason: '',
  })
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { submitOvernight, isSubmitting } = useStudentOvernight()

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

      // 성공 시 콜백 호출
      onSuccess?.()
      onClose()
    } catch (error) {
      setSubmitError((error as Error).message)
    }
  }

  return (
    <div className="flex-1 flex flex-col px-4 py-3">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <h3 className="text-lg font-bold">새 외박 신청</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 폼 */}
      <div className="flex-1 flex flex-col gap-3">
        {/* 날짜 선택 */}
        <div className="bg-indigo-50 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold">
            <Calendar className="w-4 h-4" />
            외박 기간
          </div>

          <div className="grid grid-cols-2 gap-2">
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
                    returnDate:
                      prev.returnDate && prev.returnDate < e.target.value
                        ? ''
                        : prev.returnDate,
                  }))
                }}
                className="w-full px-3 py-2 rounded-lg border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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
                className="w-full px-3 py-2 rounded-lg border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* 사유 카테고리 선택 */}
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1.5 block">사유 분류</label>
          <div className="grid grid-cols-2 gap-2">
            {STUDENT_OVERNIGHT_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, reasonCategory: cat.value }))
                }
                className={cn(
                  'px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
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
        <div className="flex-1 flex flex-col min-h-0">
          <label className="text-sm font-bold text-gray-700 mb-1.5 block shrink-0">상세 사유</label>
          <textarea
            value={formData.reason}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, reason: e.target.value }))
            }
            placeholder="외박 사유를 상세히 입력해주세요"
            className="flex-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm min-h-[60px]"
          />
        </div>

        {/* 에러 메시지 */}
        {submitError && (
          <div className="bg-red-50 text-red-700 text-sm p-2 rounded-lg shrink-0">
            {submitError}
          </div>
        )}
      </div>

      {/* 제출 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-[#6866F1] text-white py-3 rounded-lg font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed mt-3 shrink-0"
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
