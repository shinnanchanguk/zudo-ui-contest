'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

interface ZudoLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const LOGO_ASCII = `
███████╗██╗   ██╗██████╗  ██████╗
╚══███╔╝██║   ██║██╔══██╗██╔═══██╗
  ███╔╝ ██║   ██║██║  ██║██║   ██║
 ███╔╝  ██║   ██║██║  ██║██║   ██║
███████╗╚██████╔╝██████╔╝╚██████╔╝
╚══════╝ ╚═════╝ ╚═════╝  ╚═════╝
`

const SIZE_CLASSES = {
  sm: 'text-[10px] sm:text-xs md:text-sm lg:text-base',
  md: 'text-xs sm:text-sm md:text-base lg:text-lg',
  lg: 'text-sm sm:text-base md:text-lg lg:text-xl',
  xl: 'text-base sm:text-lg md:text-xl lg:text-2xl',
}

export const ZudoLogo = React.forwardRef<HTMLPreElement, ZudoLogoProps>(
  function ZudoLogo({ className, size = 'xl' }, ref) {
    return (
      <pre
        ref={ref}
        className={cn(
          SIZE_CLASSES[size],
          'leading-none font-bold -skew-x-12 text-center select-all transition-all duration-300',
          'text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300',
          className
        )}
      >
        {LOGO_ASCII.trim()}
      </pre>
    )
  }
)

ZudoLogo.displayName = 'ZudoLogo'
