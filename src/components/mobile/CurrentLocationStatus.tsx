'use client'

import { useState, useEffect } from 'react'
import { MapPin, Home, School, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useStudentEntry } from '@/hooks/useStudentEntry'
import { useStudentExtendedStudy } from '@/hooks/useStudentExtendedStudy'

type LocationType = 'school' | 'room'

interface LocationInfo {
  type: LocationType
  title: string
  description: string
  icon: React.ElementType
  color: string
  bgColor: string
}

export function CurrentLocationStatus() {
  const { todayEntry } = useStudentEntry()
  const { status: extendedStudyStatus } = useStudentExtendedStudy()
  
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null)

  useEffect(() => {
    const updateLocation = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const currentTimeMinutes = hours * 60 + minutes

      const isEarlyEntryApproved = todayEntry?.approval_status === 'approved' || todayEntry?.approval_status === 'auto_approved'
      const isExtendedStudyApproved = extendedStudyStatus.is_registered

      let type: LocationType = 'room'
      let description = ''

      if (currentTimeMinutes >= 0 && currentTimeMinutes < 2 * 60) {
        // 00:00 ~ 02:00
        if (isExtendedStudyApproved) {
          type = 'school'
          description = '연장학습 적용'
        } else {
          type = 'room'
          description = '심야시간'
        }
      } else if (currentTimeMinutes >= 2 * 60 && currentTimeMinutes < 8 * 60 + 10) {
        // 02:00 ~ 08:10
        type = 'room'
        description = '취침시간'
      } else if (currentTimeMinutes >= 8 * 60 + 10 && currentTimeMinutes < 18 * 60 + 50) {
        // 08:10 ~ 18:50
        type = 'school'
        description = '정규 일과'
      } else {
        // 18:50 ~ 24:00
        if (isEarlyEntryApproved) {
          type = 'room'
          description = '조기입실 적용'
        } else {
          type = 'school'
          description = '저녁시간'
        }
      }

      setLocationInfo({
        type,
        title: type === 'school' ? '교내' : '개인 호실',
        description,
        icon: type === 'school' ? School : Home,
        color: type === 'school' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400',
        bgColor: type === 'school' ? 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-200/50 dark:border-blue-800/30' : 'bg-purple-50/80 dark:bg-purple-900/20 border-purple-200/50 dark:border-purple-800/30'
      })
    }

    updateLocation()
    const interval = setInterval(updateLocation, 60000) // 1분마다 갱신
    return () => clearInterval(interval)
  }, [todayEntry, extendedStudyStatus.is_registered])

  if (!locationInfo) return null

  const Icon = locationInfo.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${locationInfo.bgColor} shadow-sm backdrop-blur-md w-max`}
    >
      <Icon className={`w-3.5 h-3.5 ${locationInfo.color}`} />
      <span className={`text-[13px] font-bold ${locationInfo.color}`}>
        지금은 {locationInfo.title}
      </span>
      <div className={`w-1 h-1 rounded-full ${locationInfo.color} opacity-40`} />
      <span className="text-[12px] font-semibold text-gray-500 dark:text-gray-400">
        {locationInfo.description}
      </span>
    </motion.div>
  )
}
