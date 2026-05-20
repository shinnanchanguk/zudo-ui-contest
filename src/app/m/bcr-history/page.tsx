// @ts-nocheck
'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Image as ImageIcon, Pill, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useMyBcrHistory } from '@/hooks/useBcr'
import { BCR_STATUS_LABELS, BCR_STATUS_STYLES, BCR_STATUS_PILL_MAP } from '@/types/bcr'
import { cn } from '@/lib/utils'

export default function StudentBcrHistoryPage() {
  const router = useRouter()
  const { data, isLoading } = useMyBcrHistory()
  const [selectedPhotos, setSelectedPhotos] = useState<string[] | null>(null)

  const items = useMemo(() => data ?? [], [data])

  return (
    <div className="min-h-dvh flex flex-col relative overflow-hidden bg-transparent">

      <div className="h-safe-top shrink-0" />

      <header className="sticky top-0 z-20 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-b border-white/20 dark:border-white/10">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/40 dark:bg-black/40 border border-white/20 hover:bg-gray-100 transition-colors -ml-2"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-white">BCR & 알약 통합 내역</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto z-10">
        <div className="p-4 pb-safe space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 font-medium">내역을 불러오는 중...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center gap-4">
               <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Pill className="w-10 h-10 text-gray-300" />
               </div>
               <p className="text-gray-500 font-medium">기록이 아직 없어요</p>
            </div>
          ) : (
            items.map((item, index) => {
              const style = BCR_STATUS_STYLES[item.status] ?? { bg: 'bg-gray-100', text: 'text-gray-700' }
              const hasPill = item.pills_awarded && item.pills_awarded !== 0

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-[2rem] p-5 flex flex-col gap-4 relative group active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.date}</span>
                       <span className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{item.room_number}호 점검</span>
                    </div>
                    <span
                      className={cn('text-xs font-bold px-3 py-1.5 rounded-full shadow-sm', style.bg, style.text)}
                    >
                      {BCR_STATUS_LABELS[item.status]}
                    </span>
                  </div>

                  {/* Combined Pill Info */}
                  {hasPill && (
                    <div className={cn(
                      'flex items-center gap-2 p-3 rounded-2xl bg-opacity-10',
                      item.pills_type === 'merit' ? 'bg-green-500 text-green-600' : 'bg-red-500 text-red-600'
                    )}>
                      <div className={cn(
                         'w-8 h-8 rounded-xl flex items-center justify-center',
                         item.pills_type === 'merit' ? 'bg-green-500 text-white' : 'bg-red-600 text-white'
                      )}>
                        <Pill className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] font-bold opacity-70">{item.pills_type === 'merit' ? '상점' : '벌점'} 수여</span>
                         <span className="text-sm font-extrabold">{item.pills_type === 'merit' ? '초록' : '붉은'} 알약 {item.pills_awarded > 0 ? '+' : ''}{item.pills_awarded}개</span>
                      </div>
                    </div>
                  )}

                  {item.reason && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50/50 dark:bg-gray-900/30 p-3 rounded-xl border border-gray-100/50 dark:border-white/5">
                       {item.reason}
                    </p>
                  )}

                  {item.photos.length > 0 && (
                    <button 
                      onClick={() => setSelectedPhotos(item.photos)}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/20 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-white dark:hover:bg-white/10 transition-colors"
                    >
                      <ImageIcon className="w-4 h-4" />
                      점검 사진 {item.photos.length}장 보기
                    </button>
                  )}
                </motion.div>
              )
            })
          )}
        </div>
      </div>

      {/* Photo Preview Modal */}
      <AnimatePresence>
        {selectedPhotos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col p-6"
          >
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => setSelectedPhotos(null)}
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar">
              {selectedPhotos.map((photo, i) => (
                <motion.div 
                  key={i}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-full aspect-square bg-gray-800 rounded-3xl overflow-hidden relative"
                >
                   {/* In a real app, use <Image src={photo} /> */}
                   <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold italic">
                      [PHOTO: {photo}]
                   </div>
                </motion.div>
              ))}
            </div>
            
            <p className="text-center text-gray-400 text-sm mt-4">위로 올려서 닫기</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
