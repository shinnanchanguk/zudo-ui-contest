// @ts-nocheck
'use client'

// 학생 QR 스캔 모바일 페이지
// Student QR Scan Mobile Page

import { useEffect, useState, useCallback, useRef } from 'react'
import { ArrowLeft, RefreshCw, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useProfile } from '@/hooks/useAuth'
import { useStudentQrCode, useGenerateQrCode } from '@/hooks/useQR'
import { StudentQrCode } from '@/components/qr/StudentQrCode'
import { createClient } from '@/lib/supabase/client'

export default function QrPage() {
  const router = useRouter()
  const { data: profile, isLoading: profileLoading } = useProfile()
  const studentId = profile?.student_id

  // ⭐ 다운로드 함수 상태 (StudentQrCode에서 전달받음)
  const [downloadFn, setDownloadFn] = useState<(() => Promise<void>) | null>(null)

  // 다운로드 준비 완료 핸들러
  const handleDownloadReady = useCallback((fn: () => Promise<void>) => {
    setDownloadFn(() => fn)
  }, [])

  // 다운로드 버튼 클릭 핸들러
  const handleDownload = useCallback(async () => {
    if (downloadFn) {
      await downloadFn()
    }
  }, [downloadFn])

  // 학생 정보 (student_number) 조회
  const { data: studentInfo } = useQuery({
    queryKey: ['student-info', studentId],
    queryFn: async () => {
      if (!studentId) return null
      return { student_number: '00000' }
    },
    enabled: !!studentId,
  })

  // QR 코드 조회
  const {
    data: qrCode,
    isLoading: codeLoading,
    isFetching: codeRefetching,
    error: codeError,
    refetch: refetchQrCode,
  } = useStudentQrCode(studentId ?? undefined)

  // QR 코드 생성/조회
  const generateQrCode = useGenerateQrCode({
    onSuccess: () => {
      console.log('[QR] QR 코드 생성/조회 성공')
    },
    onError: (error: Error) => {
      console.error('[QR] QR 코드 생성 실패:', error)
      toast.error('QR 코드 조회 실패. 새로고침 버튼을 눌러 다시 시도하거나 관리자에게 문의하세요.')
    },
  })

  // QR 코드 자동 생성 시도 추적 (무한 루프 방지)
  const generationAttemptedRef = useRef(false)

  // studentId 변경 시 생성 시도 상태 리셋 (다른 학생으로 전환 시)
  useEffect(() => {
    generationAttemptedRef.current = false
  }, [studentId])

  // QR 코드가 없으면 자동 생성 시도 (1회)
  useEffect(() => {
    // 이미 생성 시도한 경우 재시도 방지
    if (generationAttemptedRef.current) return
    if (!studentId || codeLoading || generateQrCode.isPending) return

    if (qrCode) {
      console.log('[QR] QR 코드 로드 완료')
      return
    }

    // QR 코드가 없으면 생성 시도 (1회만)
    generationAttemptedRef.current = true
    console.log('[QR] QR 코드 생성 시도')
    generateQrCode.mutate(studentId)
  }, [studentId, codeLoading, qrCode, generateQrCode.isPending])

  const handleBack = () => {
    router.back()
  }

  const handleRefresh = () => {
    if (studentId) {
      console.log('[QR] 수동 새로고침')
      refetchQrCode()
    }
  }

  const isLoading = profileLoading || codeLoading || generateQrCode.isPending
  const error = codeError?.message || (generateQrCode.error instanceof Error ? generateQrCode.error.message : null) || null

  return (
    <div className="min-h-dvh bg-[#6866F1] flex flex-col">
      <div className="h-safe-top shrink-0" />

      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">QR 스캔</h1>
            {profile?.full_name && (
              <p className="text-sm text-white/80">{profile.full_name}</p>
            )}
          </div>
        </div>

        {/* 새로고침 버튼 */}
        <button
          onClick={handleRefresh}
          disabled={isLoading || !studentId}
          className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
          aria-label="새로고침"
        >
          <RefreshCw className={`w-5 h-5 text-white ${(codeRefetching || generateQrCode.isPending) ? 'animate-spin' : ''}`} />
        </button>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-3 py-4 pb-safe">
        {!studentId && !profileLoading ? (
          <div className="text-center text-muted-foreground">
            <p>학생 정보를 찾을 수 없습니다.</p>
            <p className="text-sm mt-2">관리자에게 문의하세요.</p>
          </div>
        ) : (
          <StudentQrCode
            studentId={studentId || ''}
            qrCode={qrCode ?? null}
            studentName={profile?.full_name || undefined}
            studentNumber={studentInfo?.student_number}
            isLoading={isLoading}
            error={error}
            onRefresh={handleRefresh}
            onDownloadReady={handleDownloadReady}
          />
        )}

        {/* QR 코드 다운로드 버튼 */}
        {downloadFn && !isLoading && !error && qrCode && (
          <button
            onClick={handleDownload}
            className="mt-8 px-6 py-3 bg-white/20 hover:bg-white/30 active:bg-white/40
                       rounded-xl text-white font-medium transition-colors
                       flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            QR 코드 다운로드
          </button>
        )}
      </div>
    </div>
  )
}
