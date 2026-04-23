// @ts-nocheck
'use client'

import { ChevronLeft, ChevronRight, Image as ImageIcon, Pill } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMyBcrHistory } from '@/hooks/useBcr'
import { BCR_STATUS_LABELS, BCR_STATUS_STYLES, BCR_STATUS_PILL_MAP } from '@/types/bcr'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'

export default function StudentBcrHistoryPage() {
  const router = useRouter()
  const { data, isLoading } = useMyBcrHistory()

  const items = useMemo(() => data ?? [], [data])

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <div className="h-safe-top shrink-0" />

      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors -ml-2"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900">BCR 내역</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 pb-safe space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-500">불러오는 중...</div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-gray-500">BCR 기록이 없습니다.</div>
          ) : (
            items.map((item) => {
              const style = BCR_STATUS_STYLES[item.status] ?? { bg: 'bg-gray-100', text: 'text-gray-700' }
              const pillInfo = BCR_STATUS_PILL_MAP[item.status]
              const hasPill = item.pill_points && item.pill_points > 0

              return (
                <button
                  key={item.id}
                  onClick={() => router.push(`/m/bcr-history/${item.id}`)}
                  className="w-full text-left bg-white border border-gray-100 shadow-sm rounded-2xl p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-gray-900">
                          {item.date} · {item.room_number}
                        </div>
                        <span
                          className={cn('text-xs font-semibold px-2 py-1 rounded-full', style.bg, style.text)}
                        >
                          {BCR_STATUS_LABELS[item.status]}
                        </span>
                      </div>

                      {/* 알약 정보 */}
                      {hasPill && (
                        <div className={cn(
                          'flex items-center gap-1.5 text-xs font-medium',
                          item.pill_type === 'merit' ? 'text-green-600' : 'text-red-600'
                        )}>
                          <Pill className="w-3.5 h-3.5" />
                          {item.pill_type === 'merit' ? '초록' : '붉은'} 알약 +{item.pill_points}
                        </div>
                      )}

                      {item.reason && <p className="text-sm text-gray-700">{item.reason}</p>}
                      {item.photos.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <ImageIcon className="w-4 h-4" />
                          사진 {item.photos.length}장 첨부
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      <div className="shrink-0 h-safe-bottom bg-white" />
    </div>
  )
}
