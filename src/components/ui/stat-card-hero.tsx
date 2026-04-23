'use client'

import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { LucideIcon } from 'lucide-react'

const heroStatCardVariants = cva(
  'relative overflow-hidden rounded-2xl p-6 h-32 flex flex-col justify-center',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground',
        success: 'bg-emerald-500 text-white',
        warning: 'bg-amber-500 text-white',
        danger: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
        purple: 'bg-purple-500 text-white',
        gray: 'bg-slate-500 text-white',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
)

interface HeroStatCardProps extends VariantProps<typeof heroStatCardVariants> {
  title: string
  value: string | number
  icon: LucideIcon
  className?: string
  onClick?: () => void
  /** HEX 색상으로 배경색 오버라이드 (Admin 동적 색상용) */
  customBgColor?: string
}

export function HeroStatCard({ title, value, icon: Icon, variant, className, onClick, customBgColor }: HeroStatCardProps) {
  return (
    <div
      className={cn(
        heroStatCardVariants({ variant: customBgColor ? undefined : variant }),
        // customBgColor 사용 시 기본 텍스트 색상과 배경 스타일 적용
        customBgColor && 'text-white',
        onClick && 'cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]',
        className
      )}
      onClick={onClick}
      style={customBgColor ? { backgroundColor: customBgColor } : undefined}
    >
      <Icon className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-10" />
      <div className="relative z-10 text-5xl font-bold">{value}</div>
      <div className="relative z-10 text-lg font-medium opacity-80">{title}</div>
    </div>
  )
}
