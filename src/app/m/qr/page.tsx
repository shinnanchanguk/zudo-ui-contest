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
import { MobileSubPageLayout } from '@/components/mobile/MobileSubPageLayout'

export default function QrPage() {
  const router = useRouter()
  const { data: profile, isLoading: profileLoading } = useProfile()
  const studentId = profile?.student_id

  const [downloadFn, setDownloadFn] = useState<(() => Promise<void>) | null>(null)

  const handleDownloadReady = useCallback((fn: () => Promise<void>) => {
    setDownloadFn(() => fn)
  }, [])

  const handleDownload = useCallback(async () => {
    if (downloadFn) {
      await downloadFn()
    }
  }, [downloadFn])

  const { data: studentInfo } = useQuery({
    queryKey: ['student-info', studentId],
    queryFn: async () => {
      if (!studentId) return null
      return { student_number: '00000' }
    },
    enabled: !!studentId,
  })

  const {
    data: qrCode,
    isLoading: codeLoading,
    isFetching: codeRefetching,
    error: codeError,
    refetch: refetchQrCode,
  } = useStudentQrCode(studentId ?? undefined)

  const generateQrCode = useGenerateQrCode({
    onSuccess: () => {},
    onError: (error: Error) => {
      toast.error('QR 코드 조회 실패')
    },
  })

  const generationAttemptedRef = useRef(false)

  useEffect(() => {
    generationAttemptedRef.current = false
  }, [studentId])

  useEffect(() => {
    if (generationAttemptedRef.current) return
    if (!studentId || codeLoading || generateQrCode.isPending) return
    if (qrCode) return
    generationAttemptedRef.current = true
    generateQrCode.mutate(studentId)
  }, [studentId, codeLoading, qrCode, generateQrCode.isPending])

  const handleRefresh = () => {
    if (studentId) {
      refetchQrCode()
    }
  }

  const isLoading = profileLoading || codeLoading || generateQrCode.isPending
  const error = codeError?.message || (generateQrCode.error instanceof Error ? generateQrCode.error.message : null) || null

  return (
    <MobileSubPageLayout 
      title="QR 스캔" 
      accentColor="indigo-500"
      headerRight={
        <button
          onClick={handleRefresh}
          disabled={isLoading || !studentId}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/40 dark:bg-black/40 border border-white/20 hover:bg-gray-100 transition-colors"
        >
          <RefreshCw className={`w-5 h-5 text-indigo-600 ${codeRefetching ? 'animate-spin' : ''}`} />
        </button>
      }
    >
      <div className="flex flex-col items-center">
        {!studentId && !profileLoading ? (
          <div className="text-center text-muted-foreground py-10">
            <p>학생 정보를 찾을 수 없습니다.</p>
          </div>
        ) : (
          <div className="w-full">
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
          </div>
        )}

        {downloadFn && !isLoading && !error && qrCode && (
          <button
            onClick={handleDownload}
            className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-all flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            QR 코드 다운로드
          </button>
        )}
      </div>
    </MobileSubPageLayout>
  )
}
