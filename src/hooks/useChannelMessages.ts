'use client'

import { mockMessages } from '@/lib/mock-data'

export interface ChatMessage {
  id: string
  channel_id: string
  sender_id: string | null
  content: string
  content_type: string
  is_pinned: boolean
  created_at: string
  updated_at: string
  sender: {
    id: string
    full_name: string
    role: string
    student_id?: string | null
    student?: { student_number: string; room_number: string | null } | null
  } | null
  reactions?: { emoji: string; count: number; user_reacted: boolean }[]
  thread_count?: number
}

export function useChannelMessages(channelId: string | null, options?: { limit?: number; threadParentId?: string | null }) {
  const messages = channelId
    ? mockMessages.filter((m) => m.channel_id === channelId) as ChatMessage[]
    : []

  void options // unused in mock

  return {
    data: messages,
    isLoading: false,
    isError: false,
    error: null,
    loadMoreMessages: async () => [] as ChatMessage[],
  }
}
