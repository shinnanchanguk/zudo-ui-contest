'use client'

import { mockEnrollmentPeriod } from '@/lib/mock-data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useActiveEnrollmentPeriod(options?: any) {
  void options
  return {
    data: mockEnrollmentPeriod,
    isLoading: false,
    isError: false,
    error: null,
  }
}

export function usePhase2Eligibility(studentId: string | null, periodId: string | null) {
  void studentId
  void periodId
  return {
    data: { isEligible: false, cancelledPrograms: [] },
    isLoading: false,
    isError: false,
    error: null,
  }
}
