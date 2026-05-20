'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { QrCode, ChevronDown, X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useStudentQrCode } from '@/hooks/useQR'
import { useProfile } from '@/hooks/useAuth'

export function PullToQr() {
  const { data: profile } = useProfile()
  const { data: qrData } = useStudentQrCode(profile?.student_id)
  const [isTutorialVisible, setIsTutorialVisible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const y = useMotionValue(0)
  const opacity = useTransform(y, [0, 150], [0, 1])
  const scale = useTransform(y, [0, 150], [0.8, 1])
  const rotate = useTransform(y, [0, 150], [-10, 0])

  useEffect(() => {
    const tutorialSeen = localStorage.getItem('qr_tutorial_seen')
    if (!tutorialSeen) {
      setIsTutorialVisible(true)
    }

    let startY = 0
    let isPulling = false

    // --- Touch Events (Mobile) ---
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY <= 5) {
        startY = e.touches[0].clientY
        isPulling = true
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return
      
      const deltaY = e.touches[0].clientY - startY
      
      // Prevent browser scroll as early as possible when pulling down
      if (deltaY > 0 && e.cancelable) {
        e.preventDefault()
      }
      
      if (deltaY > 10) {
        y.set(deltaY * 0.7)
      } else if (deltaY < -10) {
        isPulling = false
        animate(y, 0)
      }
    }

    const handleTouchEnd = () => {
      if (!isPulling) return
      isPulling = false
      
      const finalY = y.get()
      if (finalY > 100) {
        setIsOpen(true)
        localStorage.setItem('qr_tutorial_seen', 'true')
        setIsTutorialVisible(false)
      }
      animate(y, 0, { type: 'spring', stiffness: 400, damping: 30 })
    }

    // --- Mouse Events (Desktop testing) ---
    const handleMouseDown = (e: MouseEvent) => {
      if (window.scrollY <= 5) {
        startY = e.clientY
        isPulling = true
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPulling) return
      
      const deltaY = e.clientY - startY
      
      if (deltaY > 10) {
        y.set(deltaY * 0.7)
        if (e.cancelable) e.preventDefault()
      } else if (deltaY < -10) {
        isPulling = false
        animate(y, 0)
      }
    }

    const handleMouseUp = () => {
      if (!isPulling) return
      isPulling = false
      
      const finalY = y.get()
      if (finalY > 100) {
        setIsOpen(true)
        localStorage.setItem('qr_tutorial_seen', 'true')
        setIsTutorialVisible(false)
      }
      animate(y, 0, { type: 'spring', stiffness: 400, damping: 30 })
    }

    // Bind Touch
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('touchcancel', handleTouchEnd)

    // Bind Mouse
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove, { passive: false })
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)

      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [y])

  return (
    <>
      {/* Tutorial Hint */}
      {isTutorialVisible && !isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-24 left-0 right-0 text-center pointer-events-none z-[60]"
        >
          <span className="text-gray-400 text-sm font-medium">
            화면 어디든 아래로 당겨서 QR 꺼내기
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown className="w-5 h-5 mx-auto text-gray-300" />
          </motion.div>
        </motion.div>
      )}

      {/* Pull Indicator Area */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pointer-events-none">
        <motion.div 
          style={{ y, opacity, scale, rotate }}
          className="bg-white/80 backdrop-blur-2xl p-6 mt-10 rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center gap-3"
        >
          <div className="w-12 h-1 bg-gray-200 rounded-full mb-2" />
          <div className="p-3 bg-indigo-50 rounded-2xl">
            <QrCode className="w-8 h-8 text-indigo-600" />
          </div>
          <span className="text-sm font-bold text-gray-900">QR 코드를 꺼내는 중...</span>
        </motion.div>
      </div>

      {/* Full QR Overlay */}
      {isOpen && (
        <motion.div
          drag="y"
          dragConstraints={{ top: -500, bottom: 0 }}
          dragElastic={0.4}
          onDragEnd={(_, info) => {
            if (info.offset.y < -100 || info.velocity.y < -500) {
              setIsOpen(false)
            }
          }}
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          className="fixed inset-0 bg-white/60 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center p-8 touch-none"
        >
          {/* Close Handle */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300/50 rounded-full" />

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(false)}
            className="absolute top-12 right-6 w-10 h-10 bg-gray-100 dark:bg-black/20 rounded-full flex items-center justify-center border border-white/20"
          >
            <X className="w-5 h-5 text-gray-500" />
          </motion.button>

          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">나의 QR 코드</h2>
            <p className="text-gray-500 dark:text-gray-400">학생증 대용으로 사용 가능합니다</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 relative group">
            <div className="absolute -inset-4 bg-indigo-500/10 rounded-[3rem] blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500" />
            <div className="relative">
              <QRCodeSVG
                value={qrData || 'ZUDO-STUDENT'}
                size={220}
                level="H"
                includeMargin={false}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-4">
             <div className="px-6 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-200">
               스캔 대기 중
             </div>
             <p className="text-xs text-gray-400 dark:text-gray-500">보안을 위해 30초마다 갱신됩니다</p>
          </div>

          <div className="mt-auto mb-4 text-gray-400 text-xs font-medium">
            위로 밀어서 닫기
          </div>
        </motion.div>
      )}
    </>
  )
}
