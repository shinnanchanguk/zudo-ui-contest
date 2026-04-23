'use client'

import { useParams } from 'next/navigation'
import { ProgramDetailPage } from '@/components/mobile/afterschool/ProgramDetailPage'

export default function MobileAfterschoolDetailPage() {
    const params = useParams()
    const id = params.id as string

    return <ProgramDetailPage programId={id} />
}
