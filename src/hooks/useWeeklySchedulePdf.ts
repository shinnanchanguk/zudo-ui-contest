'use client'

import { toast } from 'sonner'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useWeeklySchedulePdf(_props: { programs: any[]; periodPhase: number }) {
  return {
    generatePdf: async () => {
      toast.info('PDF 다운로드 (데모)')
    },
    isGenerating: false,
  }
}
