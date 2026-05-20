// @ts-nocheck
'use client'

import { Loader2, Pill, Sigma } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePillSummary, useStudentPillRecords } from '@/hooks/usePill'
import { useProfile } from '@/hooks/useAuth'

export function PillsView() {
  const { data: profile } = useProfile()
  const studentId = profile?.student_id ?? undefined

  const { data: summary, isLoading: summaryLoading } = usePillSummary(studentId)
  const { data: records, isLoading: recordsLoading } = useStudentPillRecords(studentId, { limit: 20 })

  const meritTotal = summary?.merit_total ?? 0
  const demeritTotal = summary?.demerit_total ?? 0
  const netTotal = summary?.net_total ?? 0

  const getNetTotalColor = () => {
    if (netTotal > 0) return 'text-green-600'
    if (netTotal < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getPillTypeBadgeColor = (pillType: string) => {
    return pillType === 'merit'
      ? 'bg-green-50 text-green-700'
      : 'bg-red-50 text-red-700'
  }

  const formatDateShort = (dateString: string | null) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const formatPillType = (pillType: string) => {
    return pillType === 'merit' ? '상점' : '벌점'
  }

  return (
    <div className="p-5 pb-safe space-y-6">
      {/* 순위 정보 */}
      <div className="glass-card rounded-2xl p-6 flex items-center justify-between overflow-hidden relative group">
        <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors" />
        <div className="relative">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">현재 순위</p>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
            {summary?.current_rank ?? '-'}<span className="text-lg font-bold text-gray-400 ml-1">위</span>
          </p>
        </div>
        <div className="relative text-right">
          <p className="text-xs text-gray-400">전체 {summary?.total_students ?? '-'}명 중</p>
          <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: summary?.total_students ? `${((summary.total_students - summary.current_rank) / summary.total_students) * 100}%` : 0 }}
              className="h-full bg-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* 요약 섹션 - 3열 그리드 */}
      <div className="grid grid-cols-3 gap-3">
        {/* 초록 알약 (상점) */}
        <motion.div
          whileHover={{ y: -5 }}
          className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border-green-500/10"
        >
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center shadow-lg shadow-green-200">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{meritTotal}</p>
          <span className="text-[10px] font-bold text-green-600">초록 알약</span>
        </motion.div>

        {/* 빨간 알약 (벌점) */}
        <motion.div
          whileHover={{ y: -5 }}
          className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border-red-500/10"
        >
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-200">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{demeritTotal}</p>
          <span className="text-[10px] font-bold text-red-600">붉은 알약</span>
        </motion.div>

        {/* 알짜 알약 (합계) */}
        <motion.div
          whileHover={{ y: -5 }}
          className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border-amber-500/10"
        >
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-100">
            <Sigma className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{netTotal}</p>
          <span className="text-[10px] font-bold text-amber-600">알짜 점수</span>
        </motion.div>
      </div>

      {/* 구분선 */}
      <div className="h-px bg-gray-200" />

      {/* 이력 섹션 */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <Pill className="w-4 h-4 text-indigo-500" />
          최근 이력
        </h2>

        {recordsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : (records ?? []).length === 0 ? (
          <div className="py-8 text-center">
            <Pill className="w-12 h-12 mx-auto text-indigo-500 opacity-30 mb-3" />
            <p className="text-sm text-gray-500">이력이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(records ?? []).map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
              >
                {/* 상단: 날짜 + 유형 배지 */}
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">
                    {formatDateShort(record.recorded_at)}
                  </p>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${getPillTypeBadgeColor(
                      record.pill_type
                    )}`}
                  >
                    {formatPillType(record.pill_type)}
                  </span>
                </div>

                {/* 중간: 사유 + 점수 */}
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-gray-800 flex-1">{record.reason}</p>
                  <p
                    className={`text-sm font-semibold whitespace-nowrap ${
                      record.pill_type === 'merit'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {record.pill_type === 'merit' ? '+' : '-'}
                    {record.points}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
