// @ts-nocheck
'use client'

import { AlertCircle, ChevronLeft, Pill, X, ZoomIn, ZoomOut } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useMemo, useState, useCallback } from 'react'
import { useMyBcrHistory, useBcrImageUrl, useBcrChecklistItems } from '@/hooks/useBcr'
import { BCR_STATUS_LABELS, BCR_STATUS_STYLES, isBcrStatusPoor, isBcrStatusNeedsChecklist } from '@/types/bcr'
import { cn } from '@/lib/utils'

function BcrPhotoItem({ path, onClick }: { path: string; onClick: () => void }) {
  const { data: signedUrl, isLoading } = useBcrImageUrl(path)

  if (isLoading) {
    return (
      <div className="aspect-square bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
        <span className="text-gray-400 text-sm">로딩중...</span>
      </div>
    )
  }

  if (!signedUrl) {
    return (
      <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
        <span className="text-gray-400 text-sm">이미지 없음</span>
      </div>
    )
  }

  return (
    <button
      onClick={onClick}
      className="aspect-square bg-gray-100 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <img
        src={signedUrl}
        alt="BCR 사진"
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </button>
  )
}

function PhotoViewer({
  photos,
  initialIndex,
  onClose,
}: {
  photos: string[]
  initialIndex: number
  onClose: () => void
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const { data: signedUrl } = useBcrImageUrl(photos[currentIndex])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))
    setScale(1)
  }, [photos.length])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))
    setScale(1)
  }, [photos.length])

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.5, 3))
  }, [])

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.5, 1))
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="h-safe-top shrink-0 bg-black" />
      <header className="flex items-center justify-between px-4 py-3 bg-black/80">
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        <span className="text-white text-sm font-medium">
          {currentIndex + 1} / {photos.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            disabled={scale <= 1}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <ZoomOut className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={handleZoomIn}
            disabled={scale >= 3}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <ZoomIn className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      {/* Image */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        {signedUrl ? (
          <img
            src={signedUrl}
            alt={`BCR 사진 ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{ transform: `scale(${scale})` }}
          />
        ) : (
          <div className="text-white text-center">
            <p>이미지를 불러오는 중...</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      {photos.length > 1 && (
        <div className="flex items-center justify-center gap-4 py-4 bg-black/80">
          <button
            onClick={handlePrev}
            className="px-6 py-2 bg-white/10 rounded-full text-white text-sm font-medium hover:bg-white/20 transition-colors"
          >
            이전
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-white/10 rounded-full text-white text-sm font-medium hover:bg-white/20 transition-colors"
          >
            다음
          </button>
        </div>
      )}
      <div className="h-safe-bottom shrink-0 bg-black" />
    </div>
  )
}

export default function BcrHistoryDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { data: items, isLoading } = useMyBcrHistory()
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerIndex, setViewerIndex] = useState(0)

  const item = useMemo(() => {
    return items?.find((i) => i.id === id) ?? null
  }, [items, id])

  // 체크리스트 조회 (보통/불량/매우 불량 상태일 때)
  const isPoor = item ? isBcrStatusPoor(item.status) : false
  const needsChecklist = item ? isBcrStatusNeedsChecklist(item.status) : false
  const { data: checklistItems, isLoading: loadingChecklist } = useBcrChecklistItems(
    needsChecklist ? id : null
  )

  const handlePhotoClick = useCallback((index: number) => {
    setViewerIndex(index)
    setViewerOpen(true)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-white flex items-center justify-center">
        <span className="text-gray-500">불러오는 중...</span>
      </div>
    )
  }

  if (!item) {
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
            <h1 className="flex-1 text-center text-lg font-bold text-gray-900">BCR 상세</h1>
            <div className="w-10" />
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">기록을 찾을 수 없습니다.</p>
        </div>
        <div className="h-safe-bottom shrink-0" />
      </div>
    )
  }

  const style = BCR_STATUS_STYLES[item.status] ?? { bg: 'bg-gray-100', text: 'text-gray-700' }
  const hasPill = item.pill_points && item.pill_points > 0

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
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900">BCR 상세</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 pb-safe space-y-6">
          {/* Info Card */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold text-gray-900">
                {item.room_number}호
              </div>
              <span
                className={cn('text-xs font-semibold px-3 py-1.5 rounded-full', style.bg, style.text)}
              >
                {BCR_STATUS_LABELS[item.status]}
              </span>
            </div>
            <div className="text-sm text-gray-600">{item.date}</div>
            {item.reason && (
              <p className="text-sm text-gray-700 bg-white rounded-xl p-3">{item.reason}</p>
            )}
          </div>

          {/* 알약 정보 카드 */}
          {hasPill && (
            <div className={cn(
              'rounded-xl p-4 flex items-center justify-between',
              item.pill_type === 'merit' ? 'bg-green-50' : 'bg-red-50'
            )}>
              <div className="flex items-center gap-2">
                <Pill className={cn(
                  'w-5 h-5',
                  item.pill_type === 'merit' ? 'text-green-600' : 'text-red-600'
                )} />
                <span className="text-sm font-medium text-gray-900">부여된 알약</span>
              </div>
              <span className={cn(
                'font-bold',
                item.pill_type === 'merit' ? 'text-green-600' : 'text-red-600'
              )}>
                {item.pill_type === 'merit' ? '초록' : '붉은'} 알약 +{item.pill_points}
              </span>
            </div>
          )}

          {/* 체크리스트 항목 목록 */}
          {needsChecklist && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className={cn('w-4 h-4', isPoor ? 'text-orange-500' : 'text-amber-500')} />
                <h2 className="text-sm font-semibold text-gray-900">
                  {isPoor ? '불량 항목' : '개선 필요 항목'}
                </h2>
              </div>
              {loadingChecklist ? (
                <div className="text-sm text-gray-500">불러오는 중...</div>
              ) : checklistItems && checklistItems.length > 0 ? (
                <div className="space-y-2">
                  {checklistItems.map((ci) => (
                    <div
                      key={ci.id}
                      className={cn(
                        'rounded-lg p-3 text-sm font-medium',
                        isPoor ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                      )}
                    >
                      {ci.checklist_label}
                      {ci.note && (
                        <p className={cn(
                          'text-xs mt-1 font-normal',
                          isPoor ? 'text-red-600' : 'text-amber-600'
                        )}>{ci.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  {isPoor ? '불량 항목 정보가 없습니다.' : '개선 필요 항목 정보가 없습니다.'}
                </div>
              )}
            </div>
          )}

          {/* Photos */}
          {item.photos.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-900">
                첨부 사진 ({item.photos.length}장)
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {item.photos.map((photo, index) => (
                  <BcrPhotoItem
                    key={photo}
                    path={photo}
                    onClick={() => handlePhotoClick(index)}
                  />
                ))}
              </div>
            </div>
          )}

          {item.photos.length === 0 && !isPoor && (
            <div className="text-center py-8 text-gray-500">
              첨부된 사진이 없습니다.
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 h-safe-bottom bg-white" />

      {/* Full Screen Photo Viewer */}
      {viewerOpen && (
        <PhotoViewer
          photos={item.photos}
          initialIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  )
}
