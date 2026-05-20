'use client'

import { motion } from 'framer-motion'
import { ZudoLogo } from '../logo/ZudoLogo'
import { Bell } from 'lucide-react'
import { useProfile } from '@/hooks/useAuth'

export function DynamicHeader() {
  const { data: profile } = useProfile()
  const studentName = profile?.full_name || '학생'

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <ZudoLogo size="mobile" />
        <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
        <span className="text-[15px] font-extrabold text-gray-800 dark:text-gray-200 tracking-tight">
          반가워요, {studentName}님
        </span>
      </div>
      
      <motion.button 
        whileTap={{ scale: 0.95 }}
        className="w-9 h-9 rounded-full bg-white/60 dark:bg-black/40 flex items-center justify-center backdrop-blur-xl shadow-sm border border-white/40 dark:border-white/10"
      >
        <Bell className="w-[18px] h-[18px] text-gray-700 dark:text-gray-300" />
      </motion.button>
    </div>
  )
}
