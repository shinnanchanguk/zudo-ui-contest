// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { useMyTodayScanStatus } from '@/hooks/useMyTodayScanStatus'
import { getTodayKst } from '@/lib/kst'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'

const DISMISSED_KEY_PREFIX = 'late-popup-dismissed-'

function getDismissedKey(): string {
  return `${DISMISSED_KEY_PREFIX}${getTodayKst()}`
}

function isDismissedToday(): boolean {
  try {
    return localStorage.getItem(getDismissedKey()) === 'true'
  } catch {
    return false
  }
}

function dismissToday(): void {
  try {
    // 이전 날짜의 키 정리
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key?.startsWith(DISMISSED_KEY_PREFIX) && key !== getDismissedKey()) {
        localStorage.removeItem(key)
      }
    }
    localStorage.setItem(getDismissedKey(), 'true')
  } catch {
    // localStorage 접근 불가 시 무시
  }
}

export function LateNotificationPopup() {
  const { data: scans } = useMyTodayScanStatus()
  const [open, setOpen] = useState(false)

  // 지각 기록 찾기
  const lateScan = scans?.find((s) => s.isLate)

  useEffect(() => {
    if (lateScan && !isDismissedToday()) {
      queueMicrotask(() => setOpen(true))
    }
  }, [lateScan])

  if (!lateScan) return null

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-sm mx-4">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-lg">
            지각 알림
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            오늘 아침 <span className="font-semibold text-amber-600">{lateScan.lateMinutes}분</span> 지각했습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              dismissToday()
              setOpen(false)
            }}
          >
            더 이상 보지 않기
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => setOpen(false)}
          >
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
