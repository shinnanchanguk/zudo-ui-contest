// @ts-nocheck
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Calendar, Clock, FileText, Check, AlertCircle, Loader2, Moon } from 'lucide-react'
import { useStudentOvernight, STUDENT_OVERNIGHT_CATEGORIES } from '@/hooks/useStudentOvernight'
import { getCategoryStyle, type OvernightCategory } from '@/components/shared/overnight-types'
import { getTodayKst, addKstDays } from '@/lib/kst'
import { motion } from 'framer-motion'

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
        <div className="min-h-dvh bg-[#1a0033] flex flex-col relative overflow-hidden">
            {/* Sunray Background Overlay (Purple Tinted) */}
            <div className="sunray-bg pointer-events-none opacity-40 scale-150 grayscale sepia hue-rotate-280" />

            {/* 상태바 공간 */}
            <div className="h-safe-top shrink-0" />

            {/* 헤더 */}
            <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b-8 border-purple-500 shadow-2xl">
                <div className="flex items-center h-20 px-4">
                    <button
                        onClick={() => router.back()}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all -ml-2"
                    >
                        <ChevronLeft className="w-8 h-8 text-white" />
                    </button>
                    <div className="flex-1 text-center">
                        <motion.h1 
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-3xl font-black italic text-white [text-shadow:4px_4px_0_#ff00ff]"
                        >
                            🌙 나이트 외박 신청 🌙
                        </motion.h1>
                    </div>
                </div>
            </header>

            {/* 스크롤 가능한 메인 영역 */}
            <div className="flex-1 overflow-y-auto relative z-10 p-5">
                <div className="pb-safe space-y-8">
                    {/* 신청 폼 */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(139,92,246,0.3)] border-8 border-purple-400"
                        >
                            <div className="text-center mb-6">
                                <span className="bg-red-600 text-white px-6 py-2 rounded-full font-black text-xl animate-bounce inline-block border-2 border-white">
                                    특급 외박 모집!
                                </span>
                            </div>

                            {/* 날짜 선택 */}
                            <div className="space-y-4">
                                <label className="text-xl font-black text-black flex items-center gap-2 italic">
                                    <Calendar className="w-6 h-6 text-purple-600" />
                                    외박 스케줄
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <span className="text-xs font-black text-purple-900">떠나는 날 ✈️</span>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            min={getTodayString()}
                                            className="w-full h-14 px-4 rounded-2xl border-4 border-purple-200 bg-white text-black font-black text-center focus:ring-4 focus:ring-purple-400 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-xs font-black text-purple-900">돌아오는 날 🏠</span>
                                        <input
                                            type="date"
                                            value={returnDate}
                                            onChange={(e) => setReturnDate(e.target.value)}
                                            min={startDate || getTodayString()}
                                            className="w-full h-14 px-4 rounded-2xl border-4 border-purple-200 bg-white text-black font-black text-center focus:ring-4 focus:ring-purple-400 outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 사유 카테고리 */}
                            <div className="space-y-4 mt-6">
                                <label className="text-xl font-black text-black flex items-center gap-2 italic">
                                    <FileText className="w-6 h-6 text-purple-600" />
                                    나의 화려한 사유
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {STUDENT_OVERNIGHT_CATEGORIES.map((category) => {
                                        const isSelected = reasonCategory === category.value
                                        return (
                                            <button
                                                key={category.value}
                                                type="button"
                                                onClick={() => setReasonCategory(category.value)}
                                                className={`h-14 rounded-2xl text-base font-black transition-all active:scale-90 border-4 shadow-[5px_5px_0_#000] ${
                                                    isSelected
                                                        ? 'bg-purple-600 border-white text-white'
                                                        : 'bg-white border-purple-100 text-purple-400'
                                                }`}
                                            >
                                                {category.label}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* 상세 사유 */}
                            <div className="space-y-3 mt-6">
                                <label className="text-xl font-black text-black">
                                    상세 사유 리스트
                                </label>
                                <textarea
                                    value={reasonDetail}
                                    onChange={(e) => setReasonDetail(e.target.value)}
                                    placeholder="자세하고 화려하게 입력하세요!"
                                    rows={3}
                                    className="w-full px-5 py-4 rounded-3xl border-4 border-purple-100 bg-white text-black placeholder:text-gray-300 font-black focus:ring-4 focus:ring-purple-400 outline-none"
                                    required
                                />
                            </div>

                            {/* 버튼 영역 */}
                            <div className="mt-8">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-20 rounded-[2rem] bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white font-black text-2xl shadow-[0_10px_0_#4a0088] border-4 border-white flex items-center justify-center gap-3 active:translate-y-2 active:shadow-none transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                    ) : (
                                        '🚀 외박 납치하기 🚀'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </form>

                    {/* 외박 내역 */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-black text-white italic [text-shadow:3px_3px_0_#000] flex items-center gap-3">
                            <Clock className="w-8 h-8 text-yellow-400" />
                            영광의 외박 히스토리
                        </h2>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="w-12 h-12 animate-spin text-white" />
                            </div>
                        ) : overnightRequests.length === 0 ? (
                            <div className="py-12 text-center bg-white/10 rounded-[3rem] border-4 border-dashed border-white/30 backdrop-blur-md">
                                <Moon className="w-20 h-20 mx-auto text-white opacity-20 mb-4 animate-pulse" />
                                <p className="text-2xl font-black text-white/50 italic">
                                    아직 전설이 시작되지 않았습니다
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {overnightRequests.map((overnight) => {
                                    const categoryStyle = getCategoryStyle(overnight.reason_category as OvernightCategory)
                                    const status = overnight.approval_status as string
                                    return (
                                        <motion.div
                                            key={overnight.id}
                                            whileHover={{ scale: 1.05 }}
                                            className={`bg-white rounded-[2rem] p-6 border-8 border-black shadow-[10px_10px_0_#000] relative overflow-hidden`}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <span className="bg-blue-600 text-white px-4 py-1 rounded-full font-black text-xs border-2 border-white">
                                                    {categoryStyle.text}
                                                </span>
                                                <span className={`text-sm font-black px-4 py-1 rounded-full border-2 border-white shadow-md ${
                                                    status === 'approved' ? 'bg-green-500 text-white' : 'bg-red-600 text-white'
                                                }`}>
                                                    {status === 'approved' ? '✅ 성공' : '❌ 반려'}
                                                </span>
                                            </div>
                                            <p className="text-xl font-black text-black underline decoration-yellow-400 decoration-4 mb-2">
                                                {formatDateForDisplay(overnight.start_date)} ~ {formatDateForDisplay(overnight.return_date)}
                                            </p>
                                            <p className="text-sm font-black text-gray-500 italic">
                                                "{overnight.reason}"
                                            </p>
                                        </motion.div>
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
