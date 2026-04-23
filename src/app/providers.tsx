'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-right"
        closeButton
        richColors
        toastOptions={{
          duration: 2600,
          className: 'gradient-border-toast',
        }}
        style={{ zIndex: 99999 }}
      />
    </QueryClientProvider>
  )
}
