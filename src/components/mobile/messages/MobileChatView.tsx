// @ts-nocheck
'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import {
  ArrowLeft,
  Send,
  Loader2,
  MessageSquare,
  MoreVertical,
  Hash,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChannels } from '@/hooks/useChannels'
import { useChannelMessages, ChatMessage } from '@/hooks/useChannelMessages'
import { useSendMessage } from '@/hooks/useSendMessage'
import { useProfile } from '@/hooks/useAuth'
import { useMarkChannelRead } from '@/hooks/useChannels'
import { useMessageAcknowledgments } from '@/hooks/useMessageAcknowledgment'

interface MobileChatViewProps {
  onBack: () => void
}

export function MobileChatView({ onBack }: MobileChatViewProps) {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasInitialScrollRef = useRef(false)

  const { data: profile } = useProfile()
  const { data: channels, isLoading: channelsLoading } = useChannels()
  const { mutateAsync: sendMessage, isPending: isSending } = useSendMessage()
  const { mutate: markRead } = useMarkChannelRead()

  // 학생 채널 찾기
  const studentChannel = channels?.find((ch) => ch.slug === 'student')
  const channelId = studentChannel?.id || null

  const {
    data: messages,
    isLoading: messagesLoading,
  } = useChannelMessages(channelId)

  // 확인된 메시지 조회
  const { data: acknowledgments } = useMessageAcknowledgments(channelId)
  const acknowledgedIds = useMemo(() => {
    return new Set(acknowledgments?.map(a => a.message_id) || [])
  }, [acknowledgments])

  // 채널 입장 시 읽음 처리
  useEffect(() => {
    if (channelId) {
      markRead(channelId)
    }
  }, [channelId, markRead])

  // 초기 로드 시 맨 아래로 스크롤
  useEffect(() => {
    if (messages && messages.length > 0 && !hasInitialScrollRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
      hasInitialScrollRef.current = true
    }
  }, [messages])

  // 새 메시지 시 스크롤 (사용자가 맨 아래에 있을 때만)
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container || !hasInitialScrollRef.current) return

    // 이미 맨 아래에 있는지 확인 (100px 여유)
    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100

    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // iOS에서 입력창이 키보드 위에 보이도록 (visualViewport API 사용)
  useEffect(() => {
    const input = inputRef.current
    if (!input) return

    const handleFocus = () => {
      // iOS에서 visual viewport API 사용하여 키보드 위치 확인
      if (window.visualViewport) {
        setTimeout(() => {
          const viewport = window.visualViewport!
          const inputRect = input.getBoundingClientRect()
          // 입력창이 뷰포트 안에 있으면 스크롤 불필요
          if (inputRect.bottom <= viewport.height) return
          input.scrollIntoView({ behavior: 'instant', block: 'end' })
        }, 100)
      }
    }

    input.addEventListener('focus', handleFocus)
    return () => input.removeEventListener('focus', handleFocus)
  }, [])

  const handleSend = async () => {
    if (!inputValue.trim() || !channelId || isSending) return

    const content = inputValue.trim()
    setInputValue('')

    try {
      await sendMessage({
        channelId,
        content,
      })
      // 전송 후 읽음 처리
      markRead(channelId)
    } catch (error) {
      console.error('Failed to send message:', error)
      setInputValue(content) // 실패 시 입력값 복원
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // 날짜 구분선을 위한 날짜 포맷
  const formatDateDivider = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return '오늘'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '어제'
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }
  }

  // 시간 포맷 (24시간제)
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  // 메시지를 날짜별로 그룹화
  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { date: string; messages: ChatMessage[] }[] = []

    messages.forEach((msg) => {
      const dateKey = new Date(msg.created_at || '').toDateString()
      const lastGroup = groups[groups.length - 1]

      if (lastGroup && new Date(lastGroup.date).toDateString() === dateKey) {
        lastGroup.messages.push(msg)
      } else {
        groups.push({ date: msg.created_at || '', messages: [msg] })
      }
    })

    return groups
  }

  const isLoading = channelsLoading || messagesLoading

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-[#6866F1] animate-spin" />
      </div>
    )
  }

  if (!studentChannel) {
    return (
      <div className="fixed inset-0 flex flex-col bg-white">
        {/* Safe area for notch */}
        <div
          className="shrink-0 bg-white"
          style={{ height: 'env(safe-area-inset-top)' }}
        />
        <div className="shrink-0 flex h-14 items-center border-b px-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">채널을 찾을 수 없습니다.</p>
        </div>
      </div>
    )
  }

  const messageGroups = groupMessagesByDate(messages || [])

  return (
    <div className="fixed inset-0 flex flex-col bg-white">
      {/* Safe area for notch */}
      <div
        className="shrink-0 bg-white"
        style={{ height: 'env(safe-area-inset-top)' }}
      />

      {/* Header */}
      <div className="shrink-0 flex h-14 items-center justify-between border-b px-4 bg-white">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
            <Hash className="w-5 h-5 text-[#6866F1]" />
          </div>
          <div className="min-w-0 flex items-center">
            <h2 className="text-sm font-semibold text-gray-900 truncate">
              {studentChannel.name}
            </h2>
          </div>
        </div>
        <button className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded-md">
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-2"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {!messages || messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">아직 메시지가 없습니다.</p>
            <p className="text-gray-400 text-xs mt-1">첫 메시지를 보내보세요!</p>
          </div>
        ) : (
          messageGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {/* Date Divider */}
              <div className="flex items-center gap-4 py-4">
                <div className="flex-1 border-t border-gray-200" />
                <span className="text-xs font-medium text-gray-500">
                  {formatDateDivider(group.date)}
                </span>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              {/* Messages in group */}
              {group.messages.map((msg, index) => {
                const isOwnMessage = msg.sender_id !== null && msg.sender_id === profile?.id
                const prevMsg = group.messages[index - 1]
                const isGrouped = msg.sender_id !== null && prevMsg && prevMsg.sender_id === msg.sender_id

                // 삭제된 메시지인지 확인
                const isDeleted = msg.is_deleted

                // 확인된 메시지인지 확인
                const isAcknowledged = acknowledgedIds.has(msg.id)

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      'group relative flex gap-3 py-1 hover:bg-gray-50 -mx-4 px-4 transition-colors',
                      isGrouped ? 'mt-0' : 'mt-4',
                      // 확인된 메시지 스타일 (본인 메시지만)
                      isOwnMessage && isAcknowledged && 'bg-green-50/60 border-l-2 border-green-400 hover:bg-green-50'
                    )}
                  >
                    {/* Avatar Area */}
                    {!isGrouped ? (
                      <div
                        className={cn(
                          'w-9 h-9 rounded flex items-center justify-center text-white font-bold text-sm shrink-0',
                          isOwnMessage ? 'bg-[#6866F1]' : 'bg-gray-400'
                        )}
                      >
                        {msg.sender?.full_name?.charAt(0) || '?'}
                      </div>
                    ) : (
                      <div className="w-9 shrink-0 text-[10px] text-gray-400 text-right pt-1">
                        {formatTime(msg.created_at || '')}
                      </div>
                    )}

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      {!isGrouped && (
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span
                            className={cn(
                              'font-bold text-[15px]',
                              isOwnMessage ? 'text-[#6866F1]' : 'text-gray-900'
                            )}
                          >
                            {msg.sender?.full_name || '삭제된 사용자'}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {!msg.sender_id
                              ? ''
                              : msg.sender?.role === 'student'
                              ? '학생'
                              : msg.sender?.role === 'teacher'
                              ? '선생님'
                              : msg.sender?.role === 'dormitory_supervisor'
                              ? '사감교사'
                              : ''}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTime(msg.created_at || '')}
                          </span>
                        </div>
                      )}
                      <div
                        className={cn(
                          'text-[15px] leading-relaxed whitespace-pre-wrap break-words',
                          isDeleted ? 'text-gray-400 italic' : 'text-gray-800'
                        )}
                      >
                        {msg.content}
                      </div>
                      {msg.is_edited && !isDeleted && (
                        <span className="text-[10px] text-gray-400">(수정됨)</span>
                      )}
                      {/* 확인 표시 (본인이 보낸 메시지에만) */}
                      {isOwnMessage && isAcknowledged && !isDeleted && (
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          <span className="text-[11px] text-green-600 font-medium">사감교사 확인</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="p-3 border-t border-gray-100 bg-white shrink-0"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 12px)' }}
      >
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-100 rounded-[20px] px-4 py-2.5 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지 보내기"
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none p-0 text-base placeholder:text-gray-400"
              style={{ fontSize: '16px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending}
            className={cn(
              'p-2.5 rounded-full shrink-0 transition-colors',
              inputValue.trim() && !isSending
                ? 'text-[#6866F1] hover:bg-indigo-50'
                : 'text-gray-300'
            )}
          >
            {isSending ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
