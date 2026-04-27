'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type ThemeId = 'default' | 'dark' | 'ocean' | 'forest' | 'sunset' | 'midnight'

export interface ThemeMeta {
  id: ThemeId
  name: string
  description: string
  /** 미리보기용 색상 스와치 (primary, background, accent 순) */
  swatches: [string, string, string]
  /** body에 적용할 클래스명 (default는 빈 문자열) */
  bodyClass: string
}

export const THEMES: ThemeMeta[] = [
  {
    id: 'default',
    name: '기본 (인디고)',
    description: '깔끔하고 차분한 인디고 퍼플',
    swatches: ['#6866F1', '#F3F4F6', '#6866F1'],
    bodyClass: '',
  },
  {
    id: 'dark',
    name: '다크 모드',
    description: '눈이 편안한 슬레이트 다크',
    swatches: ['#6866F1', '#0F172A', '#64748B'],
    bodyClass: 'dark',
  },
  {
    id: 'ocean',
    name: '오션 (바다)',
    description: '상쾌하고 시원한 스카이 블루',
    swatches: ['#0EA5E9', '#F0F9FF', '#06B6D4'],
    bodyClass: 'theme-ocean',
  },
  {
    id: 'forest',
    name: '포레스트 (숲)',
    description: '자연스럽고 편안한 에메랄드 그린',
    swatches: ['#16A34A', '#F0FDF4', '#059669'],
    bodyClass: 'theme-forest',
  },
  {
    id: 'sunset',
    name: '선셋 (노을)',
    description: '따뜻하고 생동감 있는 오렌지 핑크',
    swatches: ['#F97316', '#FFF7ED', '#EC4899'],
    bodyClass: 'theme-sunset',
  },
  {
    id: 'midnight',
    name: '미드나잇',
    description: '모던하고 세련된 딥 퍼플 다크',
    swatches: ['#A78BFA', '#09090B', '#7C3AED'],
    bodyClass: 'theme-midnight',
  },
]

interface ThemeContextValue {
  theme: ThemeId
  setTheme: (id: ThemeId) => void
  meta: ThemeMeta
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'zudo-theme'
const ALL_BODY_CLASSES = THEMES.map((t) => t.bodyClass).filter(Boolean)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>('default')

  // localStorage에서 테마 복원
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null
      if (saved && THEMES.find((t) => t.id === saved)) {
        applyTheme(saved)
        setThemeState(saved)
      }
    } catch {}
  }, [])

  function applyTheme(id: ThemeId) {
    const meta = THEMES.find((t) => t.id === id)!
    // 기존 테마 클래스 전부 제거
    document.body.classList.remove(...ALL_BODY_CLASSES)
    // 새 테마 클래스 적용
    if (meta.bodyClass) document.body.classList.add(meta.bodyClass)
  }

  function setTheme(id: ThemeId) {
    applyTheme(id)
    setThemeState(id)
    try { localStorage.setItem(STORAGE_KEY, id) } catch {}
  }

  const meta = THEMES.find((t) => t.id === theme)!

  return (
    <ThemeContext.Provider value={{ theme, setTheme, meta }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
