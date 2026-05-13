'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useProfile, useSignOut } from '@/hooks/useAuth'
import { ZudoLogo } from '@/components/logo/ZudoLogo'
import { EnrollmentBanner } from '@/components/mobile/afterschool/EnrollmentBanner'
import { LateNotificationPopup } from '@/components/mobile/LateNotificationPopup'
import { motion, AnimatePresence } from 'framer-motion'

const FEATURE_CARDS = [
  {
    title: 'QR 스캔',
    icon: '📸',
    href: '/m/qr',
    iconClass: 'bg-cyan-400 border-4 border-white shadow-[0_0_15px_#00ffff]',
  },
  {
    title: '조기입실 신청',
    icon: '🏃',
    href: '/m/entry',
    iconClass: 'bg-yellow-400 border-4 border-white shadow-[0_0_15px_#ffff00]',
  },
  {
    title: '연장학습 신청',
    icon: '📚',
    href: '/m/extended-study',
    iconClass: 'bg-green-500 border-4 border-white shadow-[0_0_15px_#00ff00]',
  },
  {
    title: '외박 신청',
    icon: '🌙',
    href: '/m/overnight',
    iconClass: 'bg-purple-600 border-4 border-white shadow-[0_0_15px_#8b5cf6]',
  },
  {
    title: '메시지',
    icon: '💌',
    href: '/m/messages',
    iconClass: 'bg-pink-500 border-4 border-white shadow-[0_0_15px_#ec4899]',
  },
  {
    title: '안전 제보',
    icon: '🚨',
    href: '/m/safety-report',
    iconClass: 'bg-red-600 border-4 border-white shadow-[0_0_15px_#ef4444]',
  },
  {
    title: 'BCR 확인',
    icon: '🔎',
    href: '/m/bcr-history',
    iconClass: 'bg-blue-600 border-4 border-white shadow-[0_0_15px_#3b82f6]',
  },
  {
    title: '알약',
    icon: '💊',
    href: '/m/pills',
    iconClass: 'bg-orange-500 border-4 border-white shadow-[0_0_15px_#f97316]',
  },
]

export default function StudentMobilePage() {
  const router = useRouter()
  const { data: profile } = useProfile()
  const signOut = useSignOut()
  const [logoutPos, setLogoutPos] = useState({ x: 0, y: 0 })

  const studentName = profile?.full_name || '학생'

  const handleNavigate = (href: string) => {
    router.push(href)
  }

  const handleLogout = () => {
    signOut.mutateAsync()
  }

  const escapeLogout = () => {
    const x = (Math.random() - 0.5) * 200
    const y = (Math.random() - 0.5) * 100
    setLogoutPos({ x, y })
  }

  return (
    <div className="min-h-dvh bg-blue-900 flex flex-col overflow-x-hidden relative">
      {/* Sunray Background Overlay */}
      <div className="sunray-bg pointer-events-none opacity-40 scale-150" />

      {/* Sparkles Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 400, 
              y: Math.random() * 800, 
              scale: 0,
              rotate: 0 
            }}
            animate={{ 
              scale: [0, 2, 0],
              rotate: [0, 180, 360],
              y: [null, Math.random() * -300]
            }}
            transition={{ 
              duration: 2 + Math.random() * 3, 
              repeat: Infinity, 
              delay: Math.random() * 5 
            }}
            className="absolute text-5xl"
          >
            {['✨', '⭐', '🌟', '🌈', '💖', '💥', '⚡', '🎉', '🎊'][i % 9]}
          </motion.div>
        ))}
      </div>

      <div className="h-safe-top shrink-0" />

      {/* Marquee Banner */}
      <div className="bg-gradient-to-r from-red-600 via-yellow-400 to-red-600 py-3 overflow-hidden border-y-8 border-black shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
        <motion.div 
          animate={{ x: [600, -1500] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="whitespace-nowrap font-black text-black text-2xl italic flex items-center gap-10"
        >
          <span>🇰🇷 대한민국 중년을 살맛나게 하는 힘!! 뽕짝이 좋아 에디션 출시! 🇰🇷</span>
          <span>🔥 벌점 대방출 축제! 지금 바로 입장하세요! 🔥</span>
          <span>🎊 모두가 즐거운 기숙사 나이트클럽 ZUDO 🎊</span>
        </motion.div>
      </div>

      {/* 스크롤 가능한 메인 영역 */}
      <div className="flex-1 overflow-y-auto relative z-10 px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* 로고 */}
          <div className="flex justify-center transform hover:scale-110 transition-transform">
            <ZudoLogo size="mobile" rounded="all" className="shadow-[15px_15px_0_#000] border-4 border-white" />
          </div>

          {/* 인사말 */}
          <div className="text-center bg-white/20 backdrop-blur-xl p-8 rounded-[3rem] border-8 border-white shadow-[0_0_40px_rgba(255,255,255,0.3)] relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/30 to-transparent pointer-events-none" />
            <motion.h1 
              className="ppongjjak-title-lg mb-2"
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: [-2, 2, -2]
              }}
              transition={{ duration: 0.3, repeat: Infinity }}
            >
              뽕짝이 좋아
            </motion.h1>
            <p className="text-3xl text-white font-black [text-shadow:_4px_4px_0_#000] italic uppercase tracking-tighter">
              오빠왔다, {studentName}님!
            </p>
            <div className="h-4 w-full bg-gradient-to-r from-red-600 via-white to-blue-600 mt-6 rounded-full shadow-inner" />
          </div>

          {/* 배너들 */}
          <EnrollmentBanner />
          <LateNotificationPopup />

          {/* Grid 2x4 버튼 레이아웃 */}
          <div className="grid grid-cols-2 gap-6">
            {FEATURE_CARDS.map((card, index) => {
              return (
                <div key={card.title} className="relative">
                  <motion.button
                    whileHover={{ 
                      scale: 1.2, 
                      zIndex: 50,
                      rotate: index % 2 === 0 ? 5 : -5
                    }}
                    onClick={() => handleNavigate(card.href)}
                    className="w-full aspect-square bg-white rounded-[2rem] border-8 border-black flex flex-col items-center justify-center gap-2 p-4 shadow-[10px_10px_0_#000] transition-all overflow-hidden active:scale-90"
                  >
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center text-5xl ${card.iconClass} mb-2`}
                    >
                      {card.icon}
                    </div>
                    <span className="text-xl font-black text-black leading-tight text-center ppongjjak-text">
                      {card.title}
                    </span>
                  </motion.button>
                  
                  {/* Hover Sparkle Burst */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-x-0 -top-10 flex justify-center pointer-events-none z-40"
                  >
                    <span className="text-5xl animate-bounce">✨💎✨</span>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 하단 고정 로그아웃 버튼 */}
      <div className="shrink-0 px-4 py-6 pb-safe bg-black border-t-8 border-yellow-400">
        <motion.div
          animate={logoutPos}
          onMouseEnter={escapeLogout}
          className="relative"
        >
          <button
            onClick={handleLogout}
            disabled={signOut.isPending}
            className="w-full py-6 bg-red-600 text-white rounded-full font-black text-3xl shadow-[0_10px_0_#800] border-4 border-white flex items-center justify-center gap-3 active:translate-y-2 active:shadow-none transition-all"
          >
            <LogOut className="w-10 h-10" />
            🚪 탈출하기 🚪
          </button>
        </motion.div>
      </div>
    </div>
  )
}
