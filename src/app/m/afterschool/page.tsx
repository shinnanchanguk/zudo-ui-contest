'use client'

import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { AfterschoolRequestView } from '@/components/mobile/afterschool/AfterschoolRequestView'

export default function MobileAfterschoolPage() {
    const router = useRouter()

    const handleBack = () => {
        router.push('/m')
    }

    return (
        <div className="min-h-dvh bg-[#332200] flex flex-col relative overflow-hidden">
            {/* Sunray Background Overlay (Gold/Yellow Tinted) */}
            <div className="sunray-bg pointer-events-none opacity-40 scale-150 grayscale sepia hue-rotate-40" />

            <div className="h-safe-top shrink-0" />

            <header className="sticky top-0 z-20 bg-black/90 text-yellow-400 border-b-8 border-yellow-500 shadow-2xl h-20 flex items-center px-4">
                <button
                    onClick={handleBack}
                    className="p-3 rounded-full bg-yellow-400 text-black mr-4 shadow-lg active:scale-90"
                >
                    <ArrowLeft className="w-8 h-8 font-black" />
                </button>
                <div className="flex-1 text-center">
                    <motion.h1 
                        animate={{ scale: [1, 1.1, 1], rotate: [-1, 1, -1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="text-3xl font-black italic [text-shadow:4px_4px_0_#000] tracking-tighter"
                    >
                        🏆 방과후 수강신청 🏆
                    </motion.h1>
                </div>
                <span className="text-3xl animate-pulse">⭐</span>
            </header>

            <div className="flex-1 overflow-y-auto relative z-10">
                <div className="p-4 pb-safe">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/95 rounded-[3rem] p-2 border-8 border-yellow-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
                    >
                        <AfterschoolRequestView onClose={handleBack} />
                    </motion.div>
                </div>
            </div>
            
            <div className="fixed bottom-4 left-0 w-full text-center pointer-events-none z-30">
                <span className="bg-black text-yellow-400 px-6 py-2 rounded-full font-black text-xs border-2 border-yellow-400 animate-bounce shadow-xl">
                    🔥 인생은 선착순! 광클로 승리하라! 🔥
                </span>
            </div>
        </div>
    )
}
