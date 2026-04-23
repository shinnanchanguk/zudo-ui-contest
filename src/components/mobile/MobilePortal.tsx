'use client'

import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'

interface MobilePortalProps {
  children: React.ReactNode
  isOpen: boolean
}

/**
 * MobilePortal - 모바일 폼/모달을 DOM 트리에서 분리하여 렌더링
 *
 * 문제: 부모 계층의 transition-transform이 CSS 스택킹 컨텍스트를 생성하여
 * fixed 포지셔닝이 viewport가 아닌 부모를 기준으로 배치됨
 *
 * 해결: createPortal로 body에 직접 렌더링하여 transform 영향 제거
 */
export function MobilePortal({ children, isOpen }: MobilePortalProps) {
  const [mounted, setMounted] = useState(false)
  const scrollPositionRef = useRef<number>(0)

  // Next.js SSR/hydration 호환성
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  // 크로스 브라우저 body 스크롤 잠금 (iOS Safari + 모바일 Chrome)
  useEffect(() => {
    if (!isOpen) return

    // 현재 스크롤 위치 저장
    scrollPositionRef.current = window.scrollY

    // body 스크롤 잠금 (position: fixed 패턴)
    const scrollY = scrollPositionRef.current
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.body.style.left = '0'

    return () => {
      // 스타일 복원
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.left = ''
      // 원래 스크롤 위치로 복원
      window.scrollTo(0, scrollPositionRef.current)
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-white flex flex-col">
      {children}
    </div>,
    document.body
  )
}
