// @ts-nocheck
'use client'

// 학생 모바일 안전 제보 페이지
// Student Mobile Safety Report Page

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft,
  MapPin,
  FileText,
  Camera,
  X,
  Check,
  AlertCircle,
  Loader2,
  Shield,
  Clock,
  Flame,
  Zap,
  Building2,
  Droplets,
  Wrench,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react'
import {
  useMyReports,
  useSubmitSafetyReport,
  useUploadSafetyReportImage,
} from '@/hooks/useSafetyReport'
import { compressImage } from '@/lib/imageCompression'
import {
  SAFETY_REPORT_CATEGORY_LABELS,
  SAFETY_REPORT_STATUS_LABELS,
  SAFETY_REPORT_STATUS_COLORS,
  type SafetyReportCategory,
} from '@/types/safety-report'

// Category options with icons
const CATEGORY_OPTIONS: {
  value: SafetyReportCategory
  label: string
  icon: React.ElementType
}[] = [
  { value: 'fire_hazard', label: '화재 위험', icon: Flame },
  { value: 'electrical', label: '전기 위험', icon: Zap },
  { value: 'structural', label: '구조물 위험', icon: Building2 },
  { value: 'water_leak', label: '누수', icon: Droplets },
  { value: 'broken_facility', label: '시설 파손', icon: Wrench },
  { value: 'security', label: '보안 위험', icon: ShieldAlert },
  { value: 'other', label: '기타', icon: HelpCircle },
]

export default function SafetyReportPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [category, setCategory] = useState<SafetyReportCategory>('other')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)

  // Hooks
  const { data: myReports, isLoading } = useMyReports()
  const submitReport = useSubmitSafetyReport()
  const uploadImage = useUploadSafetyReportImage()

  const isSubmitting = submitReport.isPending || uploadImage.isPending

  // Handle image selection with client-side compression
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSubmitError(null)
    setIsCompressing(true)

    try {
      // 개발 로깅 (원본 크기)
      console.log(`[이미지 압축] 원본: ${(file.size / 1024 / 1024).toFixed(2)}MB`)

      // 클라이언트 단 이미지 압축
      // - iOS HEIC 자동 변환
      // - JPEG 출력 (PNG보다 3-5배 작음)
      // - 최대 1MB, 1920px, 80% 품질
      const compressedFile = await compressImage(file)

      console.log(`[이미지 압축] 압축 후: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`)
      console.log(`[이미지 압축] 절감률: ${Math.round((1 - compressedFile.size / file.size) * 100)}%`)

      setSelectedImage(compressedFile)
      setImagePreview(URL.createObjectURL(compressedFile))
    } catch (error) {
      console.error('[이미지 압축] 압축 실패:', error)
      // 압축 실패 시 원본 사용 (폴백) - 5MB 이하인 경우만
      if (file.size <= 5 * 1024 * 1024) {
        setSelectedImage(file)
        setImagePreview(URL.createObjectURL(file))
      } else {
        setSubmitError('이미지 처리에 실패했습니다. 더 작은 이미지로 다시 시도해주세요.')
      }
    } finally {
      setIsCompressing(false)
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    // Validate form
    if (!location.trim()) {
      setSubmitError('위치를 입력해주세요.')
      return
    }

    if (!description.trim()) {
      setSubmitError('상세 설명을 입력해주세요.')
      return
    }

    if (!selectedImage) {
      setSubmitError('사진을 첨부해주세요.')
      return
    }

    try {
      // Upload image first
      const imagePath = await uploadImage.mutateAsync(selectedImage)

      // Submit report
      await submitReport.mutateAsync({
        category,
        location_text: location.trim(),
        description: description.trim(),
        image_path: imagePath,
      })

      // Success
      setSubmitSuccess(true)
      setCategory('other')
      setLocation('')
      setDescription('')
      clearImage()

      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (error) {
      setSubmitError((error as Error).message)
    }
  }

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <div className="h-safe-top shrink-0" />

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors -ml-2"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900">안전 제보</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 pb-safe space-y-6">
          {/* Submit Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange-500" />
                제보 유형
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORY_OPTIONS.map((opt) => {
                  const Icon = opt.icon
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setCategory(opt.value)}
                      className={`h-12 rounded-xl text-sm font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                        category === opt.value
                          ? 'bg-orange-100 border-2 border-orange-400 text-orange-700'
                          : 'bg-white border border-gray-200 text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                위치
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="예: 3층 복도, 201호 앞, 공용화장실"
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                상세 설명
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="어떤 위험 상황인지 자세히 설명해주세요"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                required
              />
            </div>

            {/* Image Upload (Required) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-orange-500" />
                사진 첨부
                <span className="text-red-500 text-xs">*필수</span>
              </label>

              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="첨부 이미지"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ) : isCompressing ? (
                <div className="w-full h-32 border-2 border-dashed border-orange-300 rounded-xl flex flex-col items-center justify-center gap-2 bg-orange-50">
                  <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                  <span className="text-sm font-medium text-orange-600">이미지 압축 중...</span>
                  <span className="text-xs text-orange-400">잠시만 기다려주세요</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-orange-300 rounded-xl flex flex-col items-center justify-center gap-2 text-orange-500 hover:border-orange-400 hover:bg-orange-50 transition-colors"
                >
                  <Camera className="w-8 h-8" />
                  <span className="text-sm font-medium">탭하여 사진 추가</span>
                  <span className="text-xs text-gray-400">자동 압축됨</span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {/* Error message */}
            {submitError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            )}

            {/* Success message */}
            {submitSuccess && (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <p className="text-sm text-green-700 font-medium">
                  제보가 완료되었습니다. 검토 후 알약이 지급될 수 있습니다.
                </p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || isCompressing || !selectedImage}
              className="w-full h-14 rounded-2xl bg-orange-500 text-white font-bold text-base transition-colors hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  제출 중...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  제보하기
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="h-px bg-gray-200" />

          {/* My Reports List */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              내 제보 내역
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
              </div>
            ) : !myReports?.length ? (
              <div className="py-8 text-center">
                <Shield className="w-12 h-12 mx-auto text-orange-500 opacity-30 mb-3" />
                <p className="text-sm text-gray-500">제보 내역이 없습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myReports.map((report) => {
                  const statusStyle = SAFETY_REPORT_STATUS_COLORS[report.status]
                  return (
                    <div
                      key={report.id}
                      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-50 text-orange-600">
                          {SAFETY_REPORT_CATEGORY_LABELS[report.category]}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}
                        >
                          {SAFETY_REPORT_STATUS_LABELS[report.status]}
                          {report.reward_points && ` (+${report.reward_points}점)`}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">{report.location_text}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{report.description}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(report.created_at).toLocaleDateString('ko-KR', {
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
