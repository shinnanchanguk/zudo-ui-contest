'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PillsView } from '@/components/mobile/pills'
import { MobileSubPageLayout } from '@/components/mobile/MobileSubPageLayout'

export default function PillsPage() {
  return (
    <MobileSubPageLayout title="알약" contentClassName="p-0" accentColor="pink-500">
      <PillsView />
    </MobileSubPageLayout>
  )
}
