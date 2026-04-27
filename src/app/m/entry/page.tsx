'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { EntryRequestView } from '@/components/mobile/entry/EntryRequestView'
import { StudentMobilePageSkeleton } from '@/components/mobile/NavigationSkeletons'

export default function EntryPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleBack = () => {
    startTransition(() => {
      router.push('/m')
    })
  }

  if (isPending) return <StudentMobilePageSkeleton />

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <div className="h-safe-top shrink-0" />

      <header className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">조기입실 신청</h1>
      </header>

      <div className="flex-1 min-h-0 p-6 pb-safe">
        <EntryRequestView onClose={handleBack} />
      </div>
    </div>
  )
}
