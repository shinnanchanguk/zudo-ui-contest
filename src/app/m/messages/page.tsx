'use client'

import { useRouter } from 'next/navigation'
import { MobileChatView } from '@/components/mobile/messages/MobileChatView'
import { motion } from 'framer-motion'

export default function MessagesPage() {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="fixed inset-0 bg-[#33001a] overflow-hidden">
      {/* Sunray Background Overlay (Pink Tinted) */}
      <div className="sunray-bg pointer-events-none opacity-40 scale-150 grayscale sepia hue-rotate-320" />
      
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        className="relative h-full w-full flex flex-col z-10"
      >
        <MobileChatView onBack={handleBack} />
      </motion.div>
    </div>
  )
}
