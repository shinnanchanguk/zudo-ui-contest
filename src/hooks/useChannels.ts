'use client'

import { mockChannels } from '@/lib/mock-data'

export function useChannels() {
  return {
    data: mockChannels,
    isLoading: false,
    isError: false,
    error: null,
  }
}

export function useMarkChannelRead() {
  return {
    mutateAsync: async (_channelId: string) => {
      // Mock: no-op
    },
    isPending: false,
    error: null,
    isSuccess: false,
  }
}
