'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft,
  Check,
  Clock,
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
  type SafetyReportCategory,
} from '@/types/safety-report'
import { motion } from 'framer-motion'

const CATEGORY_OPTIONS: {
  value: SafetyReportCategory
  label: string
  icon: string
}[] = [
  { value: 'fire_hazard', label: '화재 위험', icon: '🔥' },
  { value: 'electrical', label: '전기 위험', icon: '⚡' },
  { value: 'structural', label: '구조물 위험', icon: '🏗️' },
  { value: 'water_leak', label: '누수', icon: '💧' },
  { value: 'broken_facility', label: '시설 파손', icon: '🛠️' },
  { value: 'security', label: '보안 위험', icon: '🛡️' },
  { value: 'other', label: '기타', icon: '❓' },
]

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
       console.error(error)
       setSelectedImage(file)
       setImagePreview(URL.createObjectURL(file))
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
    if (!location.trim() || !description.trim() || !selectedImage) return
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
    <div className="min-h-dvh bg-[#330000] flex flex-col relative overflow-hidden">
      {/* Sunray Background Overlay (Red Tinted) */}
      <div className="sunray-bg pointer-events-none opacity-40 scale-150 grayscale sepia hue-rotate-0" />

      <div className="h-safe-top shrink-0" />

      <header className="sticky top-0 z-20 bg-black text-white border-b-8 border-red-600 shadow-2xl h-20 flex items-center px-4">
        <button
          onClick={() => router.back()}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-red-600 border-2 border-white mr-4"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
        <div className="flex-1 text-center">
            <motion.h1 
                animate={{ x: [-2, 2, -2] }}
                transition={{ duration: 0.1, repeat: Infinity }}
                className="text-4xl font-black italic [text-shadow:4px_4px_0_#ff0000] tracking-tighter"
            >
                🚨 긴급 안전 제보 🚨
            </motion.h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto relative z-10 p-5">
        <div className="pb-safe space-y-10">
          {/* Submit Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
             <motion.div 
                initial={{ rotate: 1 }}
                animate={{ rotate: 0 }}
                className="bg-white/95 backdrop-blur-xl rounded-[3rem] p-8 shadow-[0_0_50px_rgba(255,0,0,0.4)] border-8 border-red-600"
             >
                <div className="text-center mb-8 bg-red-600 text-white py-3 rounded-full border-4 border-white shadow-lg">
                    <span className="font-black text-2xl italic">특수요원 제보 모드</span>
                </div>

                <div className="space-y-4">
                  <label className="text-xl font-black text-black flex items-center gap-2 underline decoration-red-600 decoration-4">
                    📢 제보 유형 선택
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {CATEGORY_OPTIONS.map((opt) => {
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setCategory(opt.value)}
                          className={`h-14 rounded-2xl text-sm font-black transition-all active:scale-90 flex items-center justify-center gap-2 border-4 shadow-[5px_5px_0_#000] ${
                            category === opt.value
                              ? 'bg-red-600 border-white text-white'
                              : 'bg-white border-red-100 text-red-500'
                          }`}
                        >
                          <span className="text-xl">{opt.icon}</span>
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <label className="text-xl font-black text-black flex items-center gap-2">
                    📍 발생 위치
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="침투 위치를 적으세요!"
                    className="w-full h-14 px-5 rounded-2xl border-4 border-red-100 bg-white text-black font-black placeholder:text-gray-300 focus:ring-4 focus:ring-red-400 outline-none"
                    required
                  />
                </div>

                <div className="space-y-3 mt-6">
                  <label className="text-xl font-black text-black flex items-center gap-2">
                    📝 상세 보고
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="어떤 위급 상황인가요?"
                    rows={3}
                    className="w-full px-5 py-4 rounded-3xl border-4 border-red-100 bg-white text-black font-black placeholder:text-gray-300 focus:ring-4 focus:ring-red-400 outline-none"
                    required
                  />
                </div>

                <div className="space-y-3 mt-6">
                    <label className="text-xl font-black text-black flex items-center gap-2">
                        📷 증거 사진 (필수!!)
                    </label>
                    {imagePreview ? (
                        <div className="relative border-8 border-red-100 rounded-3xl overflow-hidden shadow-inner">
                            <img src={imagePreview} className="w-full h-48 object-cover" />
                            <button onClick={clearImage} className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full">
                                <span className="text-xl">❌</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-40 border-8 border-dashed border-red-100 rounded-[3rem] flex flex-col items-center justify-center gap-3 bg-red-50 hover:bg-red-100 transition-all active:scale-95 text-red-600"
                        >
                            <span className="text-5xl animate-pulse">📸</span>
                            <span className="font-black text-xl italic uppercase">Tap to Capture Evidence</span>
                        </button>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || isCompressing || !selectedImage}
                    className="w-full h-24 mt-8 rounded-[3rem] bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white font-black text-3xl shadow-[0_15px_0_#800] border-4 border-white flex items-center justify-center gap-4 active:translate-y-2 active:shadow-none transition-all disabled:opacity-50"
                >
                    {isSubmitting ? <span className="animate-spin text-4xl">⏳</span> : '⚔️ 즉시 제보하기 ⚔️'}
                </button>
             </motion.div>
          </form>

          {/* My Reports List */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white italic [text-shadow:3px_3px_0_#000] flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-400" />
              나의 첩보 리포트
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <span className="text-5xl animate-spin">⏳</span>
              </div>
            ) : !myReports?.length ? (
               <div className="py-12 bg-white/10 rounded-[3rem] border-4 border-dashed border-white/30 text-center">
                  <span className="text-6xl opacity-20 block mb-4">🛡️</span>
                  <p className="text-2xl font-black text-white/40 italic">평화로운 상태입니다...</p>
               </div>
            ) : (
              <div className="space-y-4">
                {myReports.map((report) => {
                  return (
                    <motion.div
                      key={report.id}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white rounded-[2rem] p-6 border-8 border-black shadow-[12px_12px_0_#000]"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-orange-500 text-white px-4 py-1 rounded-full font-black text-xs border-2 border-white">
                          {SAFETY_REPORT_CATEGORY_LABELS[report.category]}
                        </span>
                        <span className="text-sm font-black bg-black text-white px-4 py-1 rounded-full border-2 border-red-600">
                          {SAFETY_REPORT_STATUS_LABELS[report.status].toUpperCase()}
                        </span>
                      </div>
                      <p className="text-2xl font-black text-black underline decoration-red-600 decoration-4 mb-2">
                        {report.location}
                      </p>
                      <p className="text-sm font-black text-gray-500 italic">"{report.description}"</p>
                    </motion.div>
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
