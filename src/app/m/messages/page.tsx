'use client'

import { useRouter } from 'next/navigation'
import { MobileChatView } from '@/components/mobile/messages/MobileChatView'

export default function MessagesPage() {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return <MobileChatView onBack={handleBack} />
}
