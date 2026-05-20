'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, LogIn, Pill, ChevronRight, CloudRain, Sun, Zap, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { usePillSummary } from '@/hooks/usePill'
import { useProfile } from '@/hooks/useAuth'

export function RecommendationCapsules({ 
  onActiveCardChange 
}: { 
  onActiveCardChange?: (type: string | null) => void 
}) {
  const router = useRouter()
  const { data: profile } = useProfile()
  const { data: pillSummary } = usePillSummary(profile?.student_id)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const hour = currentTime.getHours()
  
  const recommendations: any[] = []

  // 1. Weather (Mocked for Demo)
  const isRaining = true // Simulated for now
  if (isRaining) {
    recommendations.push({
      id: 'weather',
      title: '비 예보가 있습니다',
      subtitle: '오후에 비 소식이 있어요. 외출 시 우산을 챙기세요!',
      icon: CloudRain,
      color: 'from-blue-600 to-blue-700',
      iconColor: 'text-blue-500',
      accent: 'bg-blue-400',
    })
  }

  // 2. BCR / Pill Status
  if (pillSummary?.has_pill_today) {
    const isDemerit = (pillSummary.today_pill_type as string) === 'demerit'
    recommendations.push({
      id: 'pill',
      title: isDemerit ? 'BCR 점검 결과 (벌점)' : 'BCR 점검 결과 (상점)',
      subtitle: isDemerit 
        ? '방 정리가 미흡하여 벌점이 부여되었습니다.'
        : '방 상태가 매우 깔끔합니다! 알약이 지급되었습니다.',
      icon: isDemerit ? AlertCircle : CheckCircle2,
      color: isDemerit ? 'from-red-600 to-orange-600' : 'from-green-600 to-emerald-700',
      iconColor: isDemerit ? 'text-red-500' : 'text-green-500',
      accent: isDemerit ? 'bg-red-400' : 'bg-green-400',
      href: '/m/pills',
    })
  }

  // 3. Time-based Suggestions
  if (hour >= 7 && hour < 9) {
    recommendations.push({
      id: 'qr',
      title: '일과 시작 QR 체크인',
      subtitle: '오늘 하루도 화이팅! QR을 스캔해주세요.',
      icon: QrCode,
      color: 'from-indigo-600 to-purple-700',
      iconColor: 'text-indigo-500',
      accent: 'bg-indigo-400',
      href: '/m/qr',
    })
  }

  if (hour >= 17 && hour < 22) {
    recommendations.push({
      id: 'entry',
      title: '조기입실 신청 시간',
      subtitle: '지금은 조기입실 신청 가능 시간입니다.',
      icon: LogIn,
      color: 'from-violet-600 to-fuchsia-700',
      iconColor: 'text-violet-500',
      accent: 'bg-violet-400',
      href: '/m/entry',
    })
  }

  useEffect(() => {
    if (recommendations.length > 0) {
      onActiveCardChange?.(recommendations[activeIndex]?.id || null)
    } else {
      onActiveCardChange?.(null)
    }
  }, [activeIndex, recommendations.length])

  if (recommendations.length === 0) return null

  return (
    <div className="relative w-full h-[110px] mb-6 perspective-1000">
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {recommendations.map((rec, index) => {
            if (index < activeIndex) return null
            
            const Icon = rec.icon
            const displayIndex = index - activeIndex
            
            // Only show top 3 in stack
            if (displayIndex > 2) return null 

            const isTop = displayIndex === 0
            
            return (
              <motion.div
                key={rec.id}
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -50 && activeIndex < recommendations.length - 1) {
                    setActiveIndex(prev => prev + 1)
                  } else if (info.offset.x > 50 && activeIndex > 0) {
                    setActiveIndex(prev => prev - 1)
                  }
                }}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  y: displayIndex * 14, 
                  x: 0,
                  scale: 1 - displayIndex * 0.06,
                  zIndex: recommendations.length - index,
                  rotateX: displayIndex * -3,
                }}
                exit={{ opacity: 0, x: -200, rotate: -20, transition: { duration: 0.3 } }}
                whileTap={isTop ? { scale: 0.98 } : {}}
                className={`absolute w-full flex items-center gap-4 p-4 rounded-[2.2rem] bg-gradient-to-br ${rec.color} border border-white/30 dark:border-white/10 shadow-2xl overflow-hidden group cursor-pointer touch-none text-white`}
                onClick={() => isTop && rec.href && router.push(rec.href)}
              >
                {/* Accent Glow */}
                <div className={`absolute -right-4 -top-4 w-24 h-24 ${rec.accent} opacity-30 blur-3xl`} />
                
                <div className={`w-12 h-12 rounded-2xl bg-white/20 dark:bg-black/20 flex items-center justify-center shadow-sm border border-white/20 shrink-0`}>
                  <Icon className={`w-6 h-6 text-white`} />
                </div>

                <div className={`flex-1 flex flex-col text-left overflow-hidden transition-opacity duration-300 ${isTop ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold truncate">{rec.title}</span>
                    {isTop && (
                      <span className="text-[9px] bg-white/30 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tighter">New</span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/80 font-medium line-clamp-1">
                    {rec.subtitle}
                  </p>
                </div>

                <div className={`ml-2 transition-opacity duration-300 ${isTop ? 'opacity-50' : 'opacity-0'}`}>
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
      
      {recommendations.length > 1 && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 items-center">
          {recommendations.map((_, i) => (
            <motion.div 
              key={i} 
              animate={{ 
                width: i === activeIndex ? 12 : 4,
                backgroundColor: i === activeIndex ? '#6366f1' : '#d1d5db'
              }}
              className="h-1 rounded-full transition-colors" 
            />
          ))}
        </div>
      )}
    </div>
  )
}
