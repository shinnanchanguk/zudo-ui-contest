'use client'

import { mockStudentApplications } from '@/lib/mock-data'
import { toast } from 'sonner'

export type AfterschoolApplicationStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn' | 'cancelled' | 'waitlist'

export function isActiveApplicationStatus(status: string | null | undefined): boolean {
  return status === 'pending' || status === 'approved' || status === 'waitlist'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function checkScheduleConflicts(selectedClassIds: string[], allPrograms: any[]) {
  void selectedClassIds
  void allPrograms
  return { hasConflict: false, conflicts: [] }
}

export function useStudentApplications(studentId: string | null, _periodId?: string, _termId?: string | null) {
  return {
    data: studentId ? mockStudentApplications : [],
    isLoading: false,
    isError: false,
    error: null,
  }
}

export function useSubmitApplication() {
  return {
    mutateAsync: async () => {
      toast.success('방과후 수업 신청이 완료되었습니다. (데모)')
      return { success: true }
    },
    isPending: false,
    error: null,
    isSuccess: false,
  }
}

export function useCancelApplication() {
  return {
    mutateAsync: async () => {
      toast.success('방과후 수업 신청이 취소되었습니다. (데모)')
      return { success: true }
    },
    isPending: false,
    error: null,
    isSuccess: false,
  }
}

export function useUpdateApplicationPriorities() {
  return {
    mutateAsync: async () => {
      toast.success('우선순위가 변경되었습니다. (데모)')
    },
    isPending: false,
    error: null,
    isSuccess: false,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useApplyToProgram() {
  return {
    mutateAsync: async () => {
      toast.success('방과후 수업에 신청되었습니다. (데모)')
      return { success: true }
    },
    isPending: false,
    error: null,
    isSuccess: false,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAvailablePrograms(_termId: string | null, _options?: any) {
  const { mockAfterschoolPrograms } = require('@/lib/mock-data')
  return {
    data: mockAfterschoolPrograms ?? [],
    isLoading: false,
    isError: false,
    error: null,
  }
}

export function useClassEnrollmentCounts(_termId: string | null, _enabled?: boolean) {
  return {
    data: new Map<string, number>([
      ['as-001', 15],
      ['as-002', 22],
      ['as-003', 12],
    ]),
    isLoading: false,
    isError: false,
    error: null,
  }
}
