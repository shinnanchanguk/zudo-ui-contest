'use client'

import { mockExtendedStudyStatus, mockExtendedStudyPeriod } from '@/lib/mock-data'
import { toast } from 'sonner'

export function useStudentExtendedStudy() {
  return {
    status: mockExtendedStudyStatus,
    isPeriodActive: true,
    activePeriod: mockExtendedStudyPeriod,
    canSubmit: true,
    canCancel: false,
    timeCheck: {
      canRequest: true,
      currentTime: '17:30',
      cutoffTime: '18:00',
      message: null,
    },
    isLoading: false,
    error: null,

    submitExtendedStudy: async () => {
      toast.success('연장학습 신청이 완료되었습니다. (데모)')
      return { success: true }
    },
    cancelExtendedStudy: async () => {
      toast.success('연장학습 신청이 취소되었습니다. (데모)')
      return { success: true }
    },
    isSubmitting: false,
    isCancelling: false,
  }
}
