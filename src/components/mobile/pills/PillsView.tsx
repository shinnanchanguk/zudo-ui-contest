// @ts-nocheck
'use client'

import { Loader2, Pill, Sigma } from 'lucide-react'
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
      {/* 요약 섹션 - 3열 그리드 */}
      <div className="grid grid-cols-3 gap-3">
        {/* 초록 알약 (상점) */}
        <div
          className="rounded-2xl p-4 flex flex-col items-center justify-center gap-2"
          style={{ backgroundColor: '#2E5C5A' }}
        >
          <Pill className="w-8 h-8 text-white" />
          <p className="text-3xl font-bold text-white">{meritTotal}</p>
        </div>

        {/* 빨간 알약 (벌점) */}
        <div
          className="rounded-2xl p-4 flex flex-col items-center justify-center gap-2"
          style={{ backgroundColor: '#9B2226' }}
        >
          <Pill className="w-8 h-8 text-white" />
          <p className="text-3xl font-bold text-white">{demeritTotal}</p>
        </div>

        {/* 알짜 알약 (합계) */}
        <div
          className="rounded-2xl p-4 flex flex-col items-center justify-center gap-2"
          style={{ backgroundColor: '#E9D8A6' }}
        >
          <Sigma className="w-8 h-8 text-gray-800" />
          <p className="text-3xl font-bold text-gray-800">{netTotal}</p>
        </div>
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
