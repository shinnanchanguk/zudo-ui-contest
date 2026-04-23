'use client'

import { mockSafetyReports } from '@/lib/mock-data'
import { toast } from 'sonner'

export function useMyReports() {
  return {
    data: mockSafetyReports,
    isLoading: false,
    isError: false,
    error: null,
  }
}

export function useSubmitSafetyReport() {
  return {
    mutateAsync: async () => {
      toast.success('안전 제보가 접수되었습니다. (데모)')
      return { success: true }
    },
    isPending: false,
    error: null,
    isSuccess: false,
  }
}

export function useUploadSafetyReportImage() {
  return {
    mutateAsync: async (_file: File) => {
      return 'mock-image-path.jpg'
    },
    isPending: false,
    error: null,
    isSuccess: false,
  }
}
