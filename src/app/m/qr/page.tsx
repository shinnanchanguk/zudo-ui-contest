'use client'

import { useState, useCallback } from 'react'
import { ArrowLeft, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/hooks/useAuth'
import { useStudentQrCode, useGenerateQrCode } from '@/hooks/useQR'
import { StudentQrCode } from '@/components/qr/StudentQrCode'
import { motion, AnimatePresence } from 'framer-motion'
import { mockStudentInfo } from '@/lib/mock-data'

export default function QrPage() {
  const router = useRouter()
  const { data: profile, isLoading: profileLoading } = useProfile()
  const studentId = profile?.id

  const [downloadFn, setDownloadFn] = useState<(() => Promise<void>) | null>(null)

  const handleDownloadReady = useCallback((fn: () => Promise<void>) => {
    setDownloadFn(() => fn)
  }, [])

  const handleDownload = useCallback(async () => {
    if (downloadFn) {
      await downloadFn()
    }
  }, [downloadFn])

  const {
    data: qrCode,
    isLoading: codeLoading,
    error: codeError,
  } = useStudentQrCode(studentId ?? undefined)

  const generateQrCode = useGenerateQrCode()

  const handleBack = () => {
    router.back()
  }

  const handleRefresh = () => {
    // Mock에서는 데이터가 항상 존재하므로 알림만 표시
    alert('QR 코드를 갱신했습니다! (데모)')
  }

  const isLoading = profileLoading || codeLoading || generateQrCode.isPending
  const error = codeError

  return (
    <motion.div 
      className="min-h-dvh flex flex-col relative overflow-hidden bg-black"
    >
      {/* Sunray Background Overlay (Cyan/Blue Tinted) */}
      <div className="sunray-bg pointer-events-none opacity-50 scale-150 grayscale sepia hue-rotate-180" />

      {/* Laser Beam Overlays */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
              x: [-1000, 1500], 
              opacity: [0, 0.8, 0],
              backgroundColor: ['#00ffff', '#ff00ff', '#00ffff']
          }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
          className="absolute h-2 w-full blur-md z-0"
          style={{ top: `${15 + i * 15}%`, rotate: i % 2 === 0 ? '30deg' : '-30deg' } as any}
        />
      ))}

      {/* Floating Kitsch Emojis */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [1000, -200], 
              x: [Math.random() * 400, Math.random() * 400],
              rotate: [0, 360] 
            }}
            transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, ease: 'linear' }}
            className="absolute text-4xl opacity-40"
          >
            {['💎', '✨', '🛰️', '👨‍🎤', '🔦'][i % 5]}
          </motion.div>
        ))}
      </div>

      <div className="h-safe-top shrink-0" />

      {/* Marquee Security Banner */}
      <div className="bg-cyan-400 py-2 border-y-4 border-black relative z-20">
         <motion.div 
            animate={{ x: [800, -1200] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap font-black text-black italic text-sm flex gap-10"
         >
            <span>🚨 [SECURITY ALERT] ZUDO CYBER TROUT SYSTEM ACTIVE 🚨</span>
            <span>🔐 [인증 대기 중] 조속히 스캐너에 신분증을 제시하십시오! 🔐</span>
            <span>✨ [신분 확인] 당신의 전생은 전설의 트로트 가수였습니다 ✨</span>
         </motion.div>
      </div>

      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-6 relative z-30 bg-black/80 backdrop-blur-xl border-b-8 border-cyan-400 shadow-2xl">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-3 rounded-full bg-cyan-400 text-black border-2 border-white shadow-lg active:scale-90"
          >
            <ArrowLeft className="w-8 h-8 font-bold" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter [text-shadow:4px_4px_0_#00ffff] uppercase">
                사이버 스캔
            </h1>
            {profile?.full_name && (
              <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest animate-pulse border-t border-cyan-900 mt-1">
                ACCESS GRANTED: {profile.full_name} 👨‍🎤
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-black border-4 border-cyan-400 shadow-[0_0_20px_#00ffff] active:rotate-180 transition-all duration-500"
        >
          <span className="text-3xl animate-spin">🔄</span>
        </button>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-3 py-10 pb-safe relative z-20">
        <div className="relative p-10">
          {/* Scanning Box Effect */}
          <motion.div 
            animate={{ 
              boxShadow: [
                '0 0 50px #00ffff, inset 0 0 50px #00ffff',
                '0 0 100px #ff00ff, inset 0 0 100px #ff00ff',
                '0 0 50px #00ffff, inset 0 0 50px #00ffff'
              ],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 border-8 border-white rounded-[3rem]"
          />
          
          <div className="bg-white p-6 rounded-[2rem] shadow-inner relative overflow-hidden border-4 border-black">
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/20 to-transparent pointer-events-none" />
            <AnimatePresence mode="wait">
              {!studentId && !profileLoading ? (
                <div className="text-center p-12 font-black text-red-600 bg-black/5 rounded-3xl">
                  <span className="text-6xl mx-auto mb-4 animate-bounce block">🛡️</span>
                  <p className="text-2xl italic">[ERROR] 인증 불가</p>
                </div>
              ) : (
                <StudentQrCode
                  studentId={studentId || ''}
                  qrCode={qrCode ?? null}
                  studentName={profile?.full_name || undefined}
                  studentNumber={mockStudentInfo.student_number}
                  isLoading={isLoading}
                  error={error}
                  onRefresh={handleRefresh}
                  onDownloadReady={handleDownloadReady}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* QR 코드 다운로드 버튼 */}
        <AnimatePresence>
          {downloadFn && !isLoading && qrCode && (
            <motion.button
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              whileHover={{ scale: 1.2, rotate: [0, 5, -5, 0] }}
              onClick={handleDownload}
              className="mt-16 px-12 py-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 text-black font-black text-3xl 
                         rounded-full shadow-[0_15px_0_#1e3a8a] border-4 border-white
                         flex items-center gap-4 transition-all active:translate-y-2 active:shadow-none"
            >
              <Download className="w-10 h-10 animate-bounce" />
              QR 코드 납치! 🚀
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-6 left-0 w-full text-center pointer-events-none opacity-40 z-30">
        <p className="text-[10px] font-black text-white tracking-[0.5em] bg-black/20 backdrop-blur-sm inline-block px-4 py-1 rounded-full border border-white/20 uppercase">
            Zudo Cyber Security Protocol v8.0 Hardened Edition
        </p>
      </div>
    </motion.div>
  )
}
