'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Utensils, Coffee, Sun, Moon } from 'lucide-react'
import { MealInfo } from '@/lib/fetchMeal'

export function MealView({ initialData }: { initialData: MealInfo[] }) {
  const [selectedIdx, setSelectedIdx] = useState(0)

  if (!initialData || initialData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Utensils className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium">급식 정보를 불러올 수 없습니다.</p>
      </div>
    )
  }

  const selectedMeal = initialData[selectedIdx]

  return (
    <div className="flex flex-col w-full h-full relative z-10">
      {/* Date Selector */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6 pb-2 -mx-2 px-2 snap-x">
        {initialData.map((meal, idx) => (
          <button
            key={meal.date}
            onClick={() => setSelectedIdx(idx)}
            className={`px-4 py-2.5 rounded-2xl whitespace-nowrap text-[15px] font-bold transition-all snap-center ${
              idx === selectedIdx 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 scale-105'
                : 'bg-white/60 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-white/80'
            }`}
          >
            {meal.date}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedMeal?.date || 'empty'}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex flex-col gap-4 pb-10"
        >
          <MealCard 
            title="아침" 
            icon={<Coffee className="w-5 h-5" />} 
            items={selectedMeal?.morning || []} 
            color="from-amber-400 to-orange-500" 
          />
          <MealCard 
            title="점심" 
            icon={<Sun className="w-5 h-5" />} 
            items={selectedMeal?.lunch || []} 
            color="from-emerald-400 to-teal-500" 
          />
          <MealCard 
            title="저녁" 
            icon={<Moon className="w-5 h-5" />} 
            items={selectedMeal?.dinner || []} 
            color="from-indigo-400 to-purple-500" 
          />
        </motion.div>
      </AnimatePresence>

      {/* Data Source Footer */}
      <div className="mt-4 mb-8 text-center text-[12px] text-gray-400 dark:text-gray-500/80 font-medium">
        데이터 출처: http://kagdakj.us.to/timetable/meal
      </div>
    </div>
  )
}

function MealCard({ title, icon, items, color }: { title: string, icon: React.ReactNode, items: string[], color: string }) {
  if (!items || items.length === 0) return null

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[2rem] bg-white/40 dark:bg-black/40 border border-white/50 dark:border-white/10 shadow-xl backdrop-blur-xl p-5 group"
    >
      <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${color} opacity-20 blur-3xl rounded-full group-hover:scale-110 transition-transform duration-500`} />
      
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${color} text-white flex items-center justify-center shadow-lg shadow-black/5`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h3>
      </div>

      <div className="flex flex-col gap-2 relative z-10">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 mt-2 shrink-0" />
            <div className="text-[15px] font-medium text-gray-700 dark:text-gray-200 leading-snug">
              {item.replace(/[#$]/g, '')}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
