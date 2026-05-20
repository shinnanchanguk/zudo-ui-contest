'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn, Moon, MessageSquare, LogOut, QrCode, BookOpen, Shield, Pill, Sparkles, Utensils } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProfile, useSignOut } from '@/hooks/useAuth'
import { ZudoLogo } from '@/components/logo/ZudoLogo'
import { EnrollmentBanner } from '@/components/mobile/afterschool/EnrollmentBanner'
import { LateNotificationPopup } from '@/components/mobile/LateNotificationPopup'
import { RecommendationCapsules } from '@/components/mobile/RecommendationCapsules'
import { PullToQr } from '@/components/mobile/PullToQr'
import { SkeletonFrame } from '@/components/ui/SkeletonFrame'
import { DynamicHeader } from '@/components/mobile/DynamicHeader'
import { WelcomeOverlay } from '@/components/mobile/WelcomeOverlay'
import { CurrentLocationStatus } from '@/components/mobile/CurrentLocationStatus'

const FEATURE_CARDS = [
  {
    title: 'QR 스캔',
    icon: QrCode,
    href: '/m/qr',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    title: '조기입실 신청',
    icon: LogIn,
    href: '/m/entry',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    title: '연장학습 신청',
    icon: BookOpen,
    href: '/m/extended-study',
    color: 'from-pink-500 to-rose-500',
  },
  {
    title: '외박 신청',
    icon: Moon,
    href: '/m/overnight',
    color: 'from-violet-500 to-purple-500',
  },
  {
    title: '안전 제보',
    icon: Shield,
    href: '/m/safety-report',
    color: 'from-orange-500 to-amber-500',
  },
  {
    title: '알약 & BCR',
    icon: Pill,
    href: '/m/pills',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    title: '오늘의 급식',
    icon: Utensils,
    href: '/m/meal',
    color: 'from-amber-400 to-orange-500',
  },
]

export default function StudentMobilePage() {
  const router = useRouter()
  const { data: profile, isLoading: profileLoading } = useProfile()
  const signOut = useSignOut()
  const [isNavigating, setIsNavigating] = useState(false)
  const [activeCardType, setActiveCardType] = useState<string | null>(null)

  const studentName = profile?.full_name || '학생'

  const handleNavigate = (href: string) => {
    setIsNavigating(true)
    setTimeout(() => {
      router.push(href)
    }, 400)
  }

  if (profileLoading || isNavigating) {
    return (
      <div className="min-h-dvh bg-[#f8fafc] dark:bg-[#0f172a]">
        <div className="h-safe-top" />
        <SkeletonFrame />
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col relative overflow-hidden bg-transparent">
      {/* Dynamic Adaptive Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{
            backgroundColor: activeCardType === 'weather' ? '#3b82f6' : 
                            activeCardType === 'pill' ? '#ef4444' :
                            activeCardType === 'entry' ? '#8b5cf6' :
                            activeCardType === 'qr' ? '#6366f1' : 'rgba(255,255,255,0)'
          }}
          transition={{ duration: 1 }}
          className="absolute -top-40 -left-40 w-96 h-96 blur-[120px] opacity-[0.08]" 
        />
        <motion.div 
          animate={{
            backgroundColor: activeCardType === 'weather' ? '#60a5fa' : 
                            activeCardType === 'pill' ? '#f87171' :
                            activeCardType === 'entry' ? '#a78bfa' :
                            activeCardType === 'qr' ? '#818cf8' : 'rgba(255,255,255,0)'
          }}
          transition={{ duration: 1.2, delay: 0.1 }}
          className="absolute -bottom-40 -right-40 w-96 h-96 blur-[120px] opacity-[0.08]" 
        />
      </div>

      <WelcomeOverlay />
      <PullToQr />

      <div className="h-safe-top shrink-0" />

      <div className="flex-1 overflow-y-auto no-scrollbar relative z-10">
        <div className="p-5 flex flex-col gap-6">
          {/* Top Compact Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-start gap-3 pt-2 px-1"
          >
            <DynamicHeader />
            <CurrentLocationStatus />
          </motion.div>

          {/* Dynamic Recommendations (Capsules) */}
          <RecommendationCapsules onActiveCardChange={setActiveCardType} />

          {/* Banners */}
          <div className="space-y-3">
            <EnrollmentBanner />
            <LateNotificationPopup />
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-4 pb-20">
            {FEATURE_CARDS.map((card, index) => {
              const Icon = card.icon
              return (
                <motion.button
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigate(card.href)}
                  className="glass-card aspect-[4/3] rounded-[2rem] flex flex-col items-center justify-center gap-4 group relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-[15px] font-bold text-gray-800 dark:text-gray-200">{card.title}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom Floating Logout */}
      <div className="fixed bottom-6 left-6 right-6 z-20">
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => signOut.mutateAsync()}
          className="w-full glass-card py-4 rounded-2xl flex items-center justify-center gap-3 text-red-500 font-bold hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors shadow-2xl"
        >
          <LogOut className="w-5 h-5" />
          로그아웃
        </motion.button>
      </div>
    </div>
  )
}
