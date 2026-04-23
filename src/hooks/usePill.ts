'use client'

import { mockPillSummary, mockPillRecords } from '@/lib/mock-data'

export function usePillSummary(studentId: string | undefined) {
  return {
    data: studentId ? mockPillSummary : null,
    isLoading: false,
    isError: false,
    error: null,
  }
}

export function useStudentPillRecords(studentId: string | undefined, options?: { limit?: number }) {
  const limit = options?.limit ?? 50
  return {
    data: studentId ? mockPillRecords.slice(0, limit) : [],
    isLoading: false,
    isError: false,
    error: null,
  }
}
