'use client'

import { ArrowLeft, Star, Heart, Trophy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { EntryRequestView } from '@/components/mobile/entry/EntryRequestView'
import { motion, AnimatePresence } from 'framer-motion'

export default function EntryPage() {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-dvh bg-gradient-to-tr from-[#FFD700] via-[#FF8C00] to-[#FFD700] flex flex-col relative overflow-hidden"
    >
      {/* Golden Rain Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -50, x: Math.random() * 500 }}
            animate={{ 
              y: 1000, 
              rotate: 360,
              scale: [1, 1.5, 1] 
            }}
            transition={{ 
              duration: 3 + Math.random() * 4, 
              repeat: Infinity, 
              ease: "linear",
              delay: i * 0.5 
            }}
            className="absolute text-white/50"
          >
            {i % 3 === 0 ? <Star fill="white" /> : i % 3 === 1 ? <Heart fill="white" /> : <Trophy />}
          </motion.div>
        ))}
      </div>

      <div className="h-safe-top shrink-0" />

      <header className="flex items-center gap-4 px-6 py-5 bg-black/90 text-white border-b-8 border-yellow-300 relative z-10 shadow-2xl">
        <button
          onClick={handleBack}
          className="p-3 rounded-full bg-yellow-400 text-black hover:bg-yellow-300 transition-all active:scale-95"
        >
          <ArrowLeft className="w-8 h-8" />
        </button>
        <div>
          <motion.h1 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-3xl font-black italic tracking-tighter text-yellow-400"
          >
            V.I.P 조기입실
          </motion.h1>
          <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-0.5">Premium Access Only</p>
        </div>
      </header>

      <div className="flex-1 min-h-0 p-6 pb-safe relative z-10 overflow-y-auto">
        <motion.div 
          initial={{ y: 100, rotate: -5 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ type: "spring", damping: 12 }}
          className="bg-white/95 backdrop-blur-lg rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-black"
        >
          <div className="flex justify-center -mt-14 mb-6">
            <div className="bg-black p-4 rounded-full border-4 border-yellow-400 shadow-xl">
              <Trophy className="w-12 h-12 text-yellow-400 animate-bounce" />
            </div>
          </div>
          
          <h2 className="text-center text-2xl font-black text-black mb-8 underline decoration-yellow-400 decoration-4">
            입실 신청서 작성
          </h2>
          
          <EntryRequestView onClose={handleBack} />
        </motion.div>
        
        <div className="mt-10 mb-6 text-center">
          <p className="inline-block px-6 py-2 bg-black text-yellow-400 font-bold rounded-full text-sm animate-pulse border-2 border-yellow-400">
            ⭐ 대기 시간 0초! 광속 입실 보장! ⭐
          </p>
        </div>
      </div>
    </motion.div>
  )
}
