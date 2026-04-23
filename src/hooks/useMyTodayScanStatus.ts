'use client'

import { mockTodayScans } from '@/lib/mock-data'

export function useMyTodayScanStatus() {
  return {
    data: mockTodayScans,
    isLoading: false,
    isError: false,
    error: null,
  }
}
