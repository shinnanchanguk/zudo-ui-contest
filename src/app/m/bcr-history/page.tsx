'use client'

import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMyBcrHistory } from '@/hooks/useBcr'
import { BCR_STATUS_LABELS, BCR_STATUS_STYLES, BCR_STATUS_PILL_MAP } from '@/types/bcr'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function StudentBcrHistoryPage() {
  const router = useRouter()
  const { data, isLoading } = useMyBcrHistory()

  const items = useMemo(() => data ?? [], [data])

  return (
    <div className="min-h-dvh bg-[#001a33] flex flex-col relative overflow-hidden">
      {/* Sunray Background Overlay (Blue Tinted) */}
      <div className="sunray-bg pointer-events-none opacity-40 scale-150 grayscale sepia hue-rotate-180" />

      <div className="h-safe-top shrink-0" />

      <header className="sticky top-0 z-20 bg-black text-white border-b-8 border-blue-500 shadow-2xl h-20 flex items-center px-4">
        <button
          onClick={() => router.back()}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 border-2 border-white mr-4 shadow-lg"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
        <div className="flex-1 text-center">
            <motion.h1 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-3xl font-black italic [text-shadow:4px_4px_0_#0000ff] tracking-tight"
            >
                💎 BCR 영광의 기록 💎
            </motion.h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto relative z-10 p-5">
        <div className="pb-safe space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-white text-5xl animate-spin">
                ⏳
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center bg-white/10 rounded-[3rem] border-4 border-dashed border-white/30 backdrop-blur-md">
                <span className="text-6xl opacity-20 block mb-4">🏆</span>
                <p className="text-2xl font-black text-white/50 italic">기록이 전설이 됩니다...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item, idx) => {
                const isClean = item.status === 'clean'
                return (
                  <motion.button
                    key={item.id}
                    initial={{ x: idx % 2 === 0 ? -50 : 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    onClick={() => router.push(`/m/bcr-history/${item.id}`)}
                    className="w-full text-left bg-white rounded-[2.5rem] border-8 border-black shadow-[15px_15px_0_#000] p-6 relative overflow-hidden"
                  >
                    {isClean && (
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-black px-4 py-1 font-black text-xs rotate-12 border-2 border-black shadow-md z-10">
                            CLEAN AWARD 🏆
                        </div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-black text-black underline decoration-blue-500 decoration-8 underline-offset-2">
                             {item.date} 🏟️
                          </div>
                          <span className={cn(
                            'text-sm font-black px-4 py-1 rounded-full border-2 border-white shadow-md',
                            isClean ? 'bg-green-500 text-white' : 'bg-red-600 text-white'
                          )}>
                             {BCR_STATUS_LABELS[item.status]}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-black text-blue-600 border-2 border-blue-500">
                                {item.room_number.slice(0, 1)}
                            </div>
                            <span className="text-lg font-black text-gray-900 tracking-tighter">
                                {item.room_number}호의 전설
                            </span>
                        </div>

                        {item.pills_awarded && item.pills_awarded > 0 && (
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full border-2 border-yellow-500 text-yellow-700 font-black text-sm">
                            알약 획득: +{item.pills_awarded}개! 💊
                          </div>
                        )}

                        {item.reason && (
                           <p className="text-sm font-black text-gray-500 italic p-3 bg-gray-50 rounded-2xl border-l-4 border-blue-500">
                             "{item.reason}"
                           </p>
                        )}
                        
                        {item.photo_count > 0 && (
                          <div className="flex items-center gap-2 text-xs font-black text-blue-500 uppercase tracking-widest">
                            <ImageIcon className="w-4 h-4" />
                            Security Photo x{item.photo_count} Captured
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-8 h-8 text-blue-500 self-center" />
                    </div>
                  </motion.button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
