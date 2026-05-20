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

import { MobileSubPageLayout } from '@/components/mobile/MobileSubPageLayout'

export default function SafetyReportPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [category, setCategory] = useState<SafetyReportCategory>('other')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)

  const { data: myReports, isLoading } = useMyReports()
  const submitReport = useSubmitSafetyReport()
  const uploadImage = useUploadSafetyReportImage()

  const isSubmitting = submitReport.isPending || uploadImage.isPending

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSubmitError(null)
    setIsCompressing(true)
    try {
      const compressedFile = await compressImage(file)
      setSelectedImage(compressedFile)
      setImagePreview(URL.createObjectURL(compressedFile))
    } catch (error) {
      if (file.size <= 5 * 1024 * 1024) {
        setSelectedImage(file)
        setImagePreview(URL.createObjectURL(file))
      } else {
        setSubmitError('이미지가 너무 큽니다.')
      }
    } finally {
      setIsCompressing(false)
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    if (!location.trim() || !description.trim() || !selectedImage) {
      setSubmitError('모든 필드를 입력하고 사진을 첨부해주세요.')
      return
    }
    try {
      const imagePath = await uploadImage.mutateAsync(selectedImage)
      await submitReport.mutateAsync({
        category,
        location_text: location.trim(),
        description: description.trim(),
        image_path: imagePath,
      })
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
    <MobileSubPageLayout title="안전 제보" accentColor="orange-500">
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-500" />
              제보 유형
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORY_OPTIONS.map((opt) => {
                const Icon = opt.icon
                const isSelected = category === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCategory(opt.value)}
                    className={`h-12 rounded-xl text-xs font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                        : 'bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="위치 (예: 3층 복도)"
              className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="상세 내용을 입력해주세요"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="space-y-2">
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-2xl" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-indigo-200 dark:border-indigo-900/30 rounded-2xl flex flex-col items-center justify-center gap-2 text-indigo-500 bg-white/30 dark:bg-black/30"
              >
                {isCompressing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Camera className="w-8 h-8" />}
                <span className="text-sm font-medium">{isCompressing ? '이미지 처리 중...' : '사진 첨부 (필수)'}</span>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
          </div>

          {submitError && <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm">{submitError}</div>}
          {submitSuccess && <div className="p-4 rounded-xl bg-green-50 text-green-700 text-sm">제보가 완료되었습니다</div>}

          <button
            type="submit"
            disabled={isSubmitting || isCompressing || !selectedImage}
            className="w-full h-14 rounded-2xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Shield className="w-5 h-5" />제보하기</>}
          </button>
        </form>

        <div className="h-px bg-gray-100 dark:bg-white/5" />

        <div className="space-y-4">
          <h2 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            내 제보 내역
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
          ) : !myReports?.length ? (
            <div className="py-12 text-center text-gray-400 text-sm">내역이 없습니다</div>
          ) : (
            <div className="space-y-3">
              {myReports.map((report) => (
                <div key={report.id} className="glass-card rounded-2xl p-4 border border-indigo-500/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {SAFETY_REPORT_CATEGORY_LABELS[report.category]}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {SAFETY_REPORT_STATUS_LABELS[report.status]}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{report.location_text}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{report.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MobileSubPageLayout>
  )
}
