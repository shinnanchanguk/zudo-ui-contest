'use client'

import { mockProfile } from '@/lib/mock-data'

type Profile = typeof mockProfile

export function useProfile() {
  return {
    data: mockProfile as Profile | null,
    isLoading: false,
    isError: false,
    error: null,
  }
}

export function useSignOut() {
  return {
    mutateAsync: async () => {
      // Mock: 실제 로그아웃 없음
      alert('로그아웃 (데모)')
    },
    isPending: false,
    error: null,
    isSuccess: false,
  }
}

export function emailToUsername(email: string): string {
  return email.replace(/@.*$/, '')
}
