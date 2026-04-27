'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { AfterschoolRequestView } from '@/components/mobile/afterschool/AfterschoolRequestView'
import { AfterschoolSkeleton } from '@/components/mobile/NavigationSkeletons'

export default function MobileAfterschoolPage() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleBack = () => {
        startTransition(() => {
            router.push('/m')
        })
    }

    if (isPending) return <AfterschoolSkeleton />

    return (
        <AfterschoolRequestView onClose={handleBack} />
    )
}
