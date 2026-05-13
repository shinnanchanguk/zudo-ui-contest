'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PillsView } from '@/components/mobile/pills'
import { motion } from 'framer-motion'

export default function PillsPage() {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <motion.div 
      initial={{ x: '100vw' }}
      animate={{ x: 0 }}
      exit={{ x: '-100vw' }}
      className="min-h-dvh bg-[#004d00] flex flex-col relative overflow-hidden"
    >
      {/* Sunray Background Overlay (Green Tinted) */}
      <div className="sunray-bg pointer-events-none opacity-40 scale-150 grayscale sepia hue-rotate-120" />

      {/* Decorative Floating Emojis */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [1000, -300], 
              x: [Math.random() * 400, Math.random() * 400],
              rotate: [0, 360] 
            }}
            transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: 'linear', delay: Math.random() * 2 }}
            className="absolute text-5xl opacity-40"
          >
            {['💰', '💊', '🍀', '✨', '💎'][i % 5]}
          </motion.div>
        ))}
      </div>

      <div className="h-safe-top shrink-0" />

      <header className="sticky top-0 z-20 bg-black text-white border-b-8 border-yellow-400 shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
        <div className="flex items-center h-20 px-4">
          <button
            onClick={handleBack}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-400 border-2 border-white shadow-lg mr-4 active:scale-90 transition-all"
          >
            <ChevronLeft className="w-8 h-8 text-black" />
          </button>
          <div className="flex-1 text-center">
            <motion.h1 
              animate={{ 
                scale: [1, 1.2, 1],
                color: ['#ffffff', '#ffff00', '#00ff00', '#ffffff'] 
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-3xl font-black italic tracking-widest [text-shadow:4px_4px_0_#000000]"
            >
              🎰 알약 잭팟 🎰
            </motion.h1>
          </div>
          <div className="text-3xl animate-bounce">
            📈
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto relative z-10 p-5">
        <motion.div 
          initial={{ scale: 0.8, rotate: -2 }}
          animate={{ scale: 1, rotate: 0 }}
          className="bg-white/95 rounded-[3.5rem] shadow-[0_0_80px_rgba(0,255,0,0.4)] border-8 border-black p-4 mb-10 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-red-600 via-yellow-400 to-red-600 py-3 text-center font-black text-xl italic uppercase tracking-[0.2em] border-b-8 border-black text-white [text-shadow:2px_2px_0_#000]">
            V.I.P AL-YAK BOARD
          </div>
          <div className="p-4">
            <PillsView />
          </div>
        </motion.div>
        
        <div className="pb-20 text-center">
          <motion.div 
            animate={{ scale: [1, 1.15, 1], rotate: [-2, 2, -2] }} 
            transition={{ repeat: Infinity, duration: 1 }}
            className="inline-flex flex-col gap-2 px-10 py-6 bg-red-600 text-white font-black rounded-[2rem] shadow-[0_15px_0_#800] border-4 border-white active:translate-y-2 transition-all cursor-pointer"
          >
            <span className="text-4xl">✨💎✨</span>
            <span className="text-2xl italic">벌점은 NO! 상점은 YES!</span>
            <span className="text-3xl font-black [text-shadow:2px_2px_0_#000]">대박 나세요 학생님!!</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
