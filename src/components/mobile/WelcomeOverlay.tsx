'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, QrCode, PaintBucket, Zap } from 'lucide-react'

export function WelcomeOverlay() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if the user has already seen the welcome overlay
    const hasSeenWelcome = localStorage.getItem('zudo_welcome_seen')
    if (!hasSeenWelcome) {
      // Small delay for better UX (let the page load first)
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('zudo_welcome_seen', 'true')
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 relative"
          >
            {/* Background Decorations */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />

            <div className="p-8 relative z-10">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner mx-auto">
                <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white text-center mb-2">
                주도가 새롭게<br/>바뀌었어요! 🎉
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-8 text-sm font-medium">
                더 빠르고, 더 예쁘고, 더 편리해진 ZUDO를 지금 바로 만나보세요.
              </p>

              <div className="space-y-5 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <PaintBucket className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">새로워진 맞춤형 UI</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">상황에 맞게 변화하는 디자인</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <QrCode className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">화면을 내려서 QR 꺼내기</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">언제 어디서든 빠르고 간편하게</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <Zap className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">초고속 신청 시스템</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">외박, 연장학습도 터치 몇 번으로</p>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-colors"
              >
                시작하기
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
