'use client'

import { ArrowLeft, BookOpen, GraduationCap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ExtendedStudyRequestView } from '@/components/mobile/extended-study/ExtendedStudyRequestView'
import { motion } from 'framer-motion'

export default function ExtendedStudyPage() {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-dvh bg-[#003300] flex flex-col relative overflow-hidden">
      {/* Sunray Background Overlay (Green Tinted) */}
      <div className="sunray-bg pointer-events-none opacity-40 scale-150 grayscale sepia hue-rotate-90" />

      <div className="h-safe-top shrink-0" />

      <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b-8 border-green-500 shadow-2xl h-20 flex items-center px-4">
        <button
          onClick={handleBack}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 mr-4"
        >
          <ArrowLeft className="w-8 h-8 text-white" />
        </button>
        <div className="flex-1 text-center">
          <motion.h1 
            animate={{ scale: [1, 1.1, 1], rotate: [-1, 1, -1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-3xl font-black italic text-white [text-shadow:4px_4px_0_#00ff00] flex items-center justify-center gap-3"
          >
            📚 열공 연장학습 📚
          </motion.h1>
        </div>
      </header>

      <div className="flex-1 min-h-0 p-6 pb-safe relative z-10 overflow-y-auto">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/95 backdrop-blur-xl rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-8 border-green-400"
        >
          <div className="text-center mb-10">
             <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="inline-block p-4 bg-green-100 rounded-full border-4 border-green-500"
             >
                <GraduationCap className="w-12 h-12 text-green-600" />
             </motion.div>
             <h2 className="text-4xl font-black text-black mt-4 ppongjjak-text italic">오늘의 장원급제!</h2>
          </div>
          
          <ExtendedStudyRequestView onClose={handleBack} />
        </motion.div>
        
        <div className="mt-10 mb-6 text-center">
            <span className="bg-yellow-400 text-black px-8 py-3 rounded-full font-black text-xl border-4 border-black animate-pulse shadow-xl">
              🔥 1등 성적, 연장학습이 보장한다! 🔥
            </span>
        </div>
      </div>
    </div>
  )
}
