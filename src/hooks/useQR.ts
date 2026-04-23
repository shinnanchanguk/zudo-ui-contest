'use client'

import { mockQrCode } from '@/lib/mock-data'

export function useStudentQrCode(studentId: string | undefined) {
  return {
    data: studentId ? mockQrCode : null,
    isLoading: false,
    isError: false,
    error: null,
  }
}

export function useGenerateQrCode(options?: { onSuccess?: () => void; onError?: (error: Error) => void }) {
  void options
  return {
    mutateAsync: async (_studentId: string) => {
      return { qr_code: mockQrCode }
    },
    isPending: false,
    error: null,
    isSuccess: false,
  }
}
