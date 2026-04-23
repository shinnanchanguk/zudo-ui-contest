// @ts-nocheck
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Calendar, Clock, FileText, Check, AlertCircle, Loader2, Moon } from 'lucide-react'
import { useStudentOvernight, STUDENT_OVERNIGHT_CATEGORIES } from '@/hooks/useStudentOvernight'
import { getCategoryStyle, type OvernightCategory } from '@/components/shared/overnight-types'
import { getTodayKst, addKstDays } from '@/lib/kst'

// 날짜 형식 변환 함수
function formatDateForDisplay(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
        weekday: 'short',
    })
}

// 오늘 날짜 (YYYY-MM-DD, KST 기준)
function getTodayString(): string {
    return getTodayKst()
}

// 내일 날짜 (YYYY-MM-DD, KST 기준)
function getTomorrowString(): string {
    return addKstDays(new Date(), 1)
}

export default function OvernightPage() {
    const router = useRouter()
    const {
        overnightRequests,
        isLoading,
        submitOvernight,
        isSubmitting,
    } = useStudentOvernight()

    // 폼 상태
    const [startDate, setStartDate] = useState(getTodayString())
    const [returnDate, setReturnDate] = useState(getTomorrowString())
    const [reasonCategory, setReasonCategory] = useState<OvernightCategory>('other')
    const [reasonDetail, setReasonDetail] = useState('')
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitError(null)

        if (!reasonDetail.trim()) {
            setSubmitError('상세 사유를 입력해주세요.')
            return
        }

        try {
            await submitOvernight({
                startDate,
                returnDate,
                reasonCategory,
                reason: reasonDetail.trim(),
            })
            setSubmitSuccess(true)
            // 폼 리셋
            setStartDate(getTodayString())
            setReturnDate(getTomorrowString())
            setReasonCategory('other')
            setReasonDetail('')

            // 3초 후 성공 메시지 숨김
            setTimeout(() => setSubmitSuccess(false), 3000)
        } catch (error) {
            setSubmitError((error as Error).message)
        }
    }

    return (
        <div className="min-h-dvh bg-white flex flex-col">
            {/* 상태바 공간 */}
            <div className="h-safe-top shrink-0" />

            {/* 헤더 */}
            <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
                <div className="flex items-center h-14 px-4">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors -ml-2"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-900" />
                    </button>
                    <h1 className="flex-1 text-center text-lg font-bold text-gray-900">
                        외박 신청
                    </h1>
                    <div className="w-10" /> {/* 균형을 위한 빈 공간 */}
                </div>
            </header>

            {/* 스크롤 가능한 메인 영역 */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-5 pb-safe space-y-6">
                    {/* 신청 폼 */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* 날짜 선택 */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#6866F1]" />
                                외박 기간
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <span className="text-xs text-gray-500">시작일</span>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        min={getTodayString()}
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 text-center font-medium focus:outline-none focus:ring-2 focus:ring-[#6866F1] focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <span className="text-xs text-gray-500">복귀일</span>
                                    <input
                                        type="date"
                                        value={returnDate}
                                        onChange={(e) => setReturnDate(e.target.value)}
                                        min={startDate || getTodayString()}
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 text-center font-medium focus:outline-none focus:ring-2 focus:ring-[#6866F1] focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 사유 카테고리 */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-[#6866F1]" />
                                외박 사유
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {STUDENT_OVERNIGHT_CATEGORIES.map((category) => {
                                    const style = getCategoryStyle(category.value)
                                    const isSelected = reasonCategory === category.value
                                    return (
                                        <button
                                            key={category.value}
                                            type="button"
                                            onClick={() => setReasonCategory(category.value)}
                                            className={`h-11 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
                                                isSelected
                                                    ? `${style.bg} ${style.border} border-2`
                                                    : 'bg-white border border-gray-200'
                                            }`}
                                        >
                                            {category.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* 상세 사유 */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">
                                상세 사유
                            </label>
                            <textarea
                                value={reasonDetail}
                                onChange={(e) => setReasonDetail(e.target.value)}
                                placeholder="외박 사유를 상세히 입력해주세요"
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#6866F1] focus:border-transparent"
                                required
                            />
                        </div>

                        {/* 에러 메시지 */}
                        {submitError && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{submitError}</p>
                            </div>
                        )}

                        {/* 성공 메시지 */}
                        {submitSuccess && (
                            <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
                                <Check className="w-5 h-5 text-green-500" />
                                <p className="text-sm text-green-700 font-medium">외박 신청이 완료되었습니다</p>
                            </div>
                        )}

                        {/* 제출 버튼 */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 rounded-2xl bg-[#6866F1] text-white font-bold text-base transition-colors hover:bg-[#5855E0] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    신청 중...
                                </>
                            ) : (
                                '외박 신청하기'
                            )}
                        </button>
                    </form>

                    {/* 구분선 */}
                    <div className="h-px bg-gray-200" />

                    {/* 외박 내역 */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#6866F1]" />
                            최근 외박 내역
                        </h2>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-[#6866F1]" />
                            </div>
                        ) : overnightRequests.length === 0 ? (
                            <div className="py-8 text-center">
                                <Moon className="w-12 h-12 mx-auto text-[#6866F1] opacity-30 mb-3" />
                                <p className="text-sm text-gray-500">
                                    외박 신청 내역이 없습니다
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {overnightRequests.map((overnight) => {
                                    const categoryStyle = getCategoryStyle(overnight.reason_category as OvernightCategory)
                                    const status = overnight.approval_status as string
                                    const statusText = status === 'approved'
                                        ? '승인됨'
                                        : status === 'rejected'
                                        ? '반려됨'
                                        : status === 'cancelled'
                                        ? '취소됨'
                                        : '대기중'
                                    const statusColor = status === 'approved'
                                        ? 'text-green-600 bg-green-50'
                                        : status === 'rejected'
                                        ? 'text-red-600 bg-red-50'
                                        : status === 'cancelled'
                                        ? 'text-gray-500 bg-gray-100'
                                        : 'text-amber-600 bg-amber-50'

                                    return (
                                        <div
                                            key={overnight.id}
                                            className={`bg-white rounded-2xl p-4 border-l-4 border border-gray-100 ${categoryStyle.border}`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryStyle.badgeText}`}>
                                                    {categoryStyle.text}
                                                </span>
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor}`}>
                                                    {statusText}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900 mb-1">
                                                {formatDateForDisplay(overnight.start_date)}{overnight.return_date ? ` ~ ${formatDateForDisplay(overnight.return_date)}` : ''}
                                            </p>
                                            {overnight.reason && (
                                                <p className="text-xs text-gray-500 line-clamp-2">
                                                    {overnight.reason}
                                                </p>
                                            )}
                                            {/* 거절 사유 표시 */}
                                            {overnight.approval_status === 'rejected' && overnight.rejection_reason && (
                                                <div className="mt-2 p-2 bg-red-50 rounded-lg">
                                                    <p className="text-xs text-red-600">
                                                        <span className="font-medium">거절 사유:</span>{' '}
                                                        {overnight.rejection_reason}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
