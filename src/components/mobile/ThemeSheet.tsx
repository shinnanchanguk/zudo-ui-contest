'use client'

import { useState } from 'react'
import { Settings, Check, X } from 'lucide-react'
import { useTheme, THEMES, type ThemeId } from '@/lib/theme'

export function ThemeSheet({ variant = 'default' }: { variant?: 'default' | 'minimal' }) {
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <>
      {/* 설정 버튼 */}
      <button
        onClick={() => setOpen(true)}
        className={
          variant === 'minimal'
            ? "p-2 rounded-xl hover:bg-gray-100 transition-colors"
            : "p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-colors border border-gray-100"
        }
        aria-label="테마 설정"
      >
        <Settings className={`w-5 h-5 ${variant === 'minimal' ? 'text-gray-400' : 'text-gray-600'}`} />
      </button>

      {/* 딤 오버레이 */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 바텀 시트 */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50
          bg-[var(--card)] rounded-t-3xl shadow-2xl
          transition-transform duration-300 ease-out
          max-w-md mx-auto
          ${open ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        {/* 드래그 핸들 */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-3">
          <h2 className="text-base font-bold text-[var(--foreground)]">테마 선택</h2>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--muted)] transition-colors"
          >
            <X className="w-4 h-4 text-[var(--muted-foreground)]" />
          </button>
        </div>

        {/* 테마 목록 */}
        <div className="px-5 pb-safe pb-6 space-y-2">
          {THEMES.map((t) => {
            const isActive = theme === t.id
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id as ThemeId)
                  setTimeout(() => setOpen(false), 180)
                }}
                className={`
                  w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all
                  ${isActive
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg'
                    : 'bg-[var(--muted)] hover:bg-[var(--secondary)] text-[var(--foreground)]'
                  }
                `}
              >
                {/* 색상 스와치 미리보기 */}
                <div className="flex shrink-0 gap-1">
                  {t.swatches.map((color, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* 이름 & 설명 */}
                <div className="flex-1 text-left">
                  <p className={`text-sm font-semibold ${isActive ? 'text-[var(--primary-foreground)]' : 'text-[var(--foreground)]'}`}>
                    {t.name}
                  </p>
                  <p className={`text-xs mt-0.5 ${isActive ? 'text-[var(--primary-foreground)]/70' : 'text-[var(--muted-foreground)]'}`}>
                    {t.description}
                  </p>
                </div>

                {/* 체크 아이콘 */}
                {isActive && (
                  <Check className="w-4 h-4 shrink-0 text-[var(--primary-foreground)]" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
