'use client'

import { mockOvernightRecords } from '@/lib/mock-data'
import { toast } from 'sonner'

export type OvernightCategory = 'family' | 'sick' | 'field_trip' | 'competition' | 'other'

export const STUDENT_OVERNIGHT_CATEGORIES: { value: OvernightCategory; label: string }[] = [
  { value: 'family', label: '귀가 (가족)' },
  { value: 'sick', label: '병원 진료' },
  { value: 'field_trip', label: '현장학습' },
  { value: 'competition', label: '대회 참가' },
  { value: 'other', label: '기타' },
]

export function useStudentOvernight() {
  const overnightRequests = mockOvernightRecords
  const pendingRequests = overnightRequests.filter((r) => r.approval_status === 'pending')
  const currentOvernight = overnightRequests.find((r) => r.approval_status === 'approved') ?? null

  return {
    overnightRequests,
    currentOvernight,
    pendingRequests,
    hasPendingRequest: pendingRequests.length > 0,
    isLoading: false,

    submitOvernight: async () => {
      toast.success('외박 신청이 완료되었습니다. (데모)')
      return { success: true }
    },
    isSubmitting: false,
    submitError: null,

    cancelOvernight: async () => {
      toast.success('외박 신청이 취소되었습니다. (데모)')
      return { success: true }
    },
    isCancelling: false,
    cancelError: null,
  }
}
