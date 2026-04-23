'use client'

export interface MessageAcknowledgment {
  id: string
  message_id: string
  acknowledged_by: string
  acknowledged_at: string
}

export function useMessageAcknowledgments(channelId: string | null) {
  void channelId
  return {
    data: [] as MessageAcknowledgment[],
    isLoading: false,
    isError: false,
    error: null,
  }
}
