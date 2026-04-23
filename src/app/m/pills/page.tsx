'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PillsView } from '@/components/mobile/pills'

export default function PillsPage() {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <div className="h-safe-top shrink-0" />

      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors -ml-2"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900">알약</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <PillsView />
      </div>
    </div>
  )
}
