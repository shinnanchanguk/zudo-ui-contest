'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { MobileChatView } from '@/components/mobile/messages/MobileChatView'
import { StudentMobilePageSkeleton } from '@/components/mobile/NavigationSkeletons'

export default function MessagesPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleBack = () => {
    startTransition(() => {
      router.push('/m')
    })
  }

  if (isPending) return <StudentMobilePageSkeleton />

  return <MobileChatView onBack={handleBack} />
}
