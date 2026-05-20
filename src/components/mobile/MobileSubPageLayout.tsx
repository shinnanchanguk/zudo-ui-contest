'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface MobileSubPageLayoutProps {
  title: string
  children: React.ReactNode
  className?: string
  contentClassName?: string
  showBack?: boolean
  headerRight?: React.ReactNode
  accentColor?: string
}

export function MobileSubPageLayout({
  title,
  children,
  className,
  contentClassName,
  showBack = true,
  headerRight,
  accentColor = 'indigo-500',
}: MobileSubPageLayoutProps) {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isAtTop, setIsAtTop] = useState(true)
  
  const dragY = useMotionValue(0)
  const opacity = useTransform(dragY, [0, 200], [1, 0.5])
  const scale = useTransform(dragY, [0, 200], [1, 0.95])

  const handleScroll = () => {
    if (scrollRef.current) {
      setIsAtTop(scrollRef.current.scrollTop <= 0)
    }
  }

  return (
    <motion.div 
      style={{ y: dragY, opacity, scale }}
      drag="y"
      dragDirectionLock
      dragListener={isAtTop}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={(_, info) => {
        // Lower threshold and add velocity check for snappier feel
        if (info.offset.y > 100 || (info.velocity.y > 500 && info.offset.y > 50)) {
          router.back()
        } else {
          animate(dragY, 0, { type: 'spring', damping: 30, stiffness: 400 })
        }
      }}
      className={cn(
        "flex-1 flex flex-col min-h-0 bg-transparent relative", 
        isAtTop ? "touch-pan-x touch-pan-down" : "touch-pan-y",
        className
      )}
    >
      {/* Top Drag Handle */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-300/40 dark:bg-white/20 rounded-full z-30" />

      {/* Accent Glow */}
      <div className={cn(
        "absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 blur-[120px] opacity-20 pointer-events-none z-0",
        `bg-${accentColor}`
      )} />

      <header className="sticky top-0 z-20 bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-b border-white/20 dark:border-white/10">
        <div className="flex items-center h-16 px-4">
          {showBack ? (
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/40 dark:bg-black/40 border border-white/20 hover:bg-white/60 transition-colors -ml-2"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>
          ) : (
            <div className="w-10" />
          )}
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {headerRight || <div className="w-10" />}
        </div>
      </header>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={cn("flex-1 overflow-y-auto no-scrollbar p-5 pb-safe relative z-10", contentClassName)}
      >
        <div className="glass-card rounded-[2.5rem] p-6 min-h-full border border-white/40 shadow-2xl">
          {children}
        </div>
      </div>
    </motion.div>
  )
}
