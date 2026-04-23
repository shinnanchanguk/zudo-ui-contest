'use client'

import { toast } from 'sonner'

export function useStudentEntry() {
  return {
    usageCount: 2,
    maxFree: 5,
    remaining: 3,
    isUnlimited: false,
    periodName: '2026학년도 1학기 1차',
    periodEnd: '2026-07-15',
    examStart: null,
    hasActivePeriod: true,
    isAfterCutoff: false,
    freeEntryCutoffTime: '18:00',

    monthlyCount: 2,
    todayEntry: null,
    canAutoApprove: true,
    remainingFreeEntries: 3,

    hasOperationalOverride: false,
    operationalPeriodName: null,
    operationalRequireApproval: false,
    operationalAutoLimit: null,
    effectiveAutoApprovalLimit: 5,

    isLoading: false,

    submitEntry: async () => {
      toast.success('조기입실 신청이 완료되었습니다. (데모)')
      return { success: true, autoApproved: true }
    },
    isSubmitting: false,
    submitError: null,

    canCancel: false,
    isCancellationTimeExpired: false,
    cancelEntry: async () => {
      toast.success('조기입실 신청이 취소되었습니다. (데모)')
      return { success: true }
    },
    isCancelling: false,
    cancelError: null,
  }
}
