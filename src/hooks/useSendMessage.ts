'use client'

import { toast } from 'sonner'

export function useSendMessage() {
  return {
    mutateAsync: async (_params: { channelId: string; content: string; contentType?: string; threadParentId?: string }) => {
      toast.success('메시지가 전송되었습니다. (데모)')
      return 'mock-msg-id'
    },
    isPending: false,
    error: null,
    isSuccess: false,
  }
}
