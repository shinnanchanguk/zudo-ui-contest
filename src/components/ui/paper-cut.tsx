'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface PaperCutOption<T extends string> {
    id: T
    label: string
    customColor?: string  // 커스텀 배경색 (예: '#064E3B')
}

interface PaperCutProps<T extends string> {
    options: PaperCutOption<T>[]
    value: T
    onChange: (value: T) => void
    size?: 'sm' | 'md' | 'lg'
    variant?: 'primary' | 'secondary'
    className?: string
}

const sizeStyles = {
    sm: {
        padding: 'px-4 py-2',
        text: 'text-sm',
        shadow: 'shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]',
        activeShadow: 'active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]',
        translate: 'active:translate-x-[2px] active:translate-y-[2px]',
    },
    md: {
        padding: 'px-6 py-3',
        text: 'text-base',
        shadow: 'shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]',
        activeShadow: 'active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]',
        translate: 'active:translate-x-[2px] active:translate-y-[2px]',
    },
    lg: {
        padding: 'px-8 py-4',
        text: 'text-lg',
        shadow: 'shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]',
        activeShadow: 'active:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]',
        translate: 'active:translate-x-[3px] active:translate-y-[3px]',
    },
}

const variantStyles = {
    primary: {
        border: 'border-2 border-slate-900',
        active: 'bg-yellow-300 text-slate-900',
        inactive: 'bg-white text-slate-900 hover:bg-slate-50',
        shadow: (size: 'sm' | 'md' | 'lg') => sizeStyles[size].shadow,
        activeShadow: (size: 'sm' | 'md' | 'lg') => sizeStyles[size].activeShadow,
    },
    secondary: {
        border: 'border border-slate-400',
        active: 'bg-yellow-200 text-slate-900',
        inactive: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
        shadow: () => 'shadow-[3px_3px_0px_0px_rgba(100,116,139,0.5)]',
        activeShadow: () => 'active:shadow-[1px_1px_0px_0px_rgba(100,116,139,0.5)]',
    },
}

export function PaperCut<T extends string>({
    options,
    value,
    onChange,
    size = 'md',
    variant = 'primary',
    className,
}: PaperCutProps<T>) {
    const sizeStyle = sizeStyles[size]
    const variantStyle = variantStyles[variant]

    return (
        <div className={cn('inline-flex items-center gap-3', className)}>
            {options.map((option) => {
                const isActive = value === option.id
                const hasCustomColor = !!option.customColor

                return (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => onChange(option.id)}
                        className={cn(
                            // Base styles
                            sizeStyle.padding,
                            sizeStyle.text,
                            'font-bold cursor-pointer transition-all',
                            // Border
                            variantStyle.border,
                            // Shadow
                            variantStyle.shadow(size),
                            // Active press effect
                            sizeStyle.translate,
                            variantStyle.activeShadow(size),
                            // State-based styles (customColor 옵션은 별도 처리)
                            hasCustomColor
                                ? cn(
                                    'text-white',
                                    isActive ? 'brightness-90' : 'hover:brightness-110'
                                )
                                : (isActive ? variantStyle.active : variantStyle.inactive),
                            // Focus ring for accessibility
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                        )}
                        style={hasCustomColor ? { backgroundColor: option.customColor } : undefined}
                    >
                        {option.label}
                    </button>
                )
            })}
        </div>
    )
}
