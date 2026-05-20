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

import { MobileSubPageLayout } from '@/components/mobile/MobileSubPageLayout'

export default function OvernightPage() {
    const router = useRouter()
    const {
        overnightRequests,
        isLoading,
        submitOvernight,
        isSubmitting,
    } = useStudentOvernight()

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
            setStartDate(getTodayString())
            setReturnDate(getTomorrowString())
            setReasonCategory('other')
            setReasonDetail('')
            setTimeout(() => setSubmitSuccess(false), 3000)
        } catch (error) {
            setSubmitError((error as Error).message)
        }
    }

    return (
        <MobileSubPageLayout title="외박 신청" accentColor="blue-500">
            <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-indigo-500" />
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
                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white text-center font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white text-center font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <FileText className="w-4 h-4 text-indigo-500" />
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
                                                ? `bg-indigo-600 text-white shadow-lg shadow-indigo-100`
                                                : 'bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400'
                                        }`}
                                    >
                                        {category.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <textarea
                            value={reasonDetail}
                            onChange={(e) => setReasonDetail(e.target.value)}
                            placeholder="상세 사유를 입력해주세요"
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {submitError && (
                        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p>{submitError}</p>
                        </div>
                    )}

                    {submitSuccess && (
                        <div className="p-4 rounded-xl bg-green-50 text-green-700 text-sm flex items-center gap-3">
                            <Check className="w-5 h-5" />
                            <p className="font-medium">신청이 완료되었습니다</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 rounded-2xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : '외박 신청하기'}
                    </button>
                </form>

                <div className="h-px bg-gray-100 dark:bg-white/5" />

                <div className="space-y-4">
                    <h2 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        최근 내역
                    </h2>

                    {isLoading ? (
                        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
                    ) : overnightRequests.length === 0 ? (
                        <div className="py-12 text-center text-gray-400 text-sm">내역이 없습니다</div>
                    ) : (
                        <div className="space-y-3">
                            {overnightRequests.map((overnight) => {
                                const status = overnight.approval_status as string
                                return (
                                    <div key={overnight.id} className="glass-card rounded-2xl p-4 border border-indigo-500/5">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">
                                                {overnight.reason_category}
                                            </span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                status === 'approved' ? 'bg-green-100 text-green-600' :
                                                status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                            }`}>
                                                {status === 'approved' ? '승인' : status === 'rejected' ? '반려' : '대기'}
                                            </span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                                            {formatDateForDisplay(overnight.start_date)} ~ {formatDateForDisplay(overnight.return_date)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{overnight.reason}</p>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </MobileSubPageLayout>
    )
}
