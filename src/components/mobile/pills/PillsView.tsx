// @ts-nocheck
'use client'

import { Loader2 } from 'lucide-react'
import { usePillSummary, useStudentPillRecords } from '@/hooks/usePill'
import { useProfile } from '@/hooks/useAuth'
import { motion } from 'framer-motion'

export function PillsView() {
  const { data: profile } = useProfile()
  const studentId = profile?.student_id ?? undefined

  const { data: summary, isLoading: summaryLoading } = usePillSummary(studentId)
  const { data: records, isLoading: recordsLoading } = useStudentPillRecords(studentId, { limit: 20 })

  const meritTotal = summary?.merit_total ?? 0
  const demeritTotal = summary?.demerit_total ?? 0
  const netTotal = summary?.net_total ?? 0

  const formatDateShort = (dateString: string | null) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const formatPillType = (pillType: string) => {
    return pillType === 'merit' ? '상점' : '벌점'
  }

  return (
    <div className="p-2 space-y-8">
      {/* 요약 섹션 - 3열 그리드 (뽕짝 잭팟 버전) */}
      <div className="grid grid-cols-3 gap-2">
        {/* 상점 (Lucky Green) */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="rounded-3xl p-4 flex flex-col items-center justify-center gap-1 border-4 border-white shadow-[0_5px_0_#1a3d3c] bg-[#1a3d3c]"
        >
          <span className="text-3xl">💊</span>
          <p className="text-sm font-black text-white/70 italic uppercase tracking-tighter">GOOD</p>
          <p className="text-4xl font-black text-[#00ff00] [text-shadow:2px_2px_0_#000]">{meritTotal}</p>
        </motion.div>

        {/* 벌점 (Angry Red) */}
        <motion.div
          animate={{ x: [-1, 1, -1] }}
          transition={{ duration: 0.1, repeat: Infinity }}
          className="rounded-3xl p-4 flex flex-col items-center justify-center gap-1 border-4 border-white shadow-[0_5px_0_#5a0000] bg-[#5a0000]"
        >
          <span className="text-3xl">💥</span>
          <p className="text-sm font-black text-white/70 italic uppercase tracking-tighter">BAD</p>
          <p className="text-4xl font-black text-[#ff0000] [text-shadow:2px_2px_0_#000]">{demeritTotal}</p>
        </motion.div>

        {/* 합계 (Jackpot Gold) */}
        <motion.div
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 0.2, repeat: Infinity }}
          className="rounded-3xl p-4 flex flex-col items-center justify-center gap-1 border-4 border-black shadow-[0_5px_0_#888] bg-yellow-400"
        >
          <span className="text-3xl">🎰</span>
          <p className="text-sm font-black text-black/70 italic uppercase tracking-tighter">TOTAL</p>
          <p className="text-4xl font-black text-black [text-shadow:2px_2px_0_#fff]">{netTotal}</p>
        </motion.div>
      </div>

      {/* 히든 보너스 텍스트 */}
      <div className="bg-black py-2 overflow-hidden border-y-4 border-yellow-400">
         <motion.div 
            animate={{ x: [400, -800] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap font-black text-yellow-400 italic text-sm"
         >
            🎊 인생은 한방! 벌점은 사방! 상점은 내방! 인생 역전 알약 잭팟!! 🎊
         </motion.div>
      </div>

      {/* 이력 섹션 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-black italic flex items-center gap-2 underline decoration-yellow-400 decoration-8 underline-offset-4">
          📜 최근 기록 일지
        </h2>

        {recordsLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-10 h-10 animate-spin text-green-600" />
          </div>
        ) : (records ?? []).length === 0 ? (
          <div className="py-12 text-center bg-black/5 rounded-[2rem] border-4 border-dashed border-black/20">
            <p className="text-xl font-black text-black/30">기록이 전무합니다...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {(records ?? []).map((record) => (
              <motion.div
                key={record.id}
                whileHover={{ scale: 1.02, x: 5 }}
                className="bg-white rounded-3xl p-5 border-4 border-black shadow-[8px_8px_0_#000]"
              >
                <div className="flex items-center justify-between mb-3">
                    <span className="bg-black text-white px-3 py-1 rounded-full font-black text-[10px]">
                        {formatDateShort(record.recorded_at)}
                    </span>
                    <span className={`font-black text-sm px-4 py-1 rounded-full border-2 border-black ${
                        record.pill_type === 'merit' ? 'bg-green-400' : 'bg-red-500 text-white'
                    }`}>
                        {formatPillType(record.pill_type).toUpperCase()}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-black text-black leading-tight">
                    {record.reason}
                  </p>
                  <p className={`text-3xl font-black italic [text-shadow:2px_2px_0_#000] ${
                      record.pill_type === 'merit' ? 'text-green-500' : 'text-red-600'
                    }`}
                  >
                    {record.pill_type === 'merit' ? '+' : '-'}
                    {record.points}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
