'use client'

import { QRCodeSVG } from 'qrcode.react'

interface StudentQrCodeProps {
  studentId: string
  qrCode: string | null
  studentName?: string
  studentNumber?: string
  isLoading?: boolean
  error?: string | null
  onRefresh?: () => void
  onDownloadReady?: (downloadFn: () => Promise<void>) => void
}

export function StudentQrCode({
  qrCode,
  studentNumber,
  isLoading = false,
  error = null,
}: StudentQrCodeProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-[280px] h-[280px]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !qrCode) {
    return (
      <div className="flex items-center justify-center w-[280px] h-[280px] bg-gray-100 rounded-2xl">
        <p className="text-sm text-gray-500">{error ?? 'QR 코드를 불러올 수 없습니다'}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="bg-white p-4 rounded-2xl shadow-sm">
        <QRCodeSVG value={qrCode} size={240} level="H" />
      </div>
      {studentNumber && (
        <p className="text-sm text-gray-500 font-medium">{studentNumber}</p>
      )}
    </div>
  )
}
