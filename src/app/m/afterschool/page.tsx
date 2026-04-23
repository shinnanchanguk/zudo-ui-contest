'use client'

import { useRouter } from 'next/navigation'
import { AfterschoolRequestView } from '@/components/mobile/afterschool/AfterschoolRequestView'

export default function MobileAfterschoolPage() {
    const router = useRouter()

    return (
        <AfterschoolRequestView onClose={() => router.push('/m')} />
    )
}
