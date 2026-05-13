import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface ZudoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'mobile'
  className?: string
  rounded?: 'top' | 'all' | 'none'
}

const sizeConfig = {
  sm: {
    container: 'h-12 w-48',
    text: 'text-3xl',
    checkbox: 'w-2 h-2',
    checkmark: 'text-[6px]',
    paddingLeft: 'pl-6',
  },
  md: {
    container: 'h-16 w-64',
    text: 'text-4xl',
    checkbox: 'w-3 h-3',
    checkmark: 'text-[8px]',
    paddingLeft: 'pl-8',
  },
  lg: {
    container: 'h-24 w-96',
    text: 'text-6xl',
    checkbox: 'w-4 h-4',
    checkmark: 'text-[10px]',
    paddingLeft: 'pl-12',
  },
  xl: {
    container: 'h-60 w-[30rem]',
    text: 'text-8xl',
    checkbox: 'w-6 h-6',
    checkmark: 'text-sm',
    paddingLeft: 'pl-16',
  },
  mobile: {
    container: 'w-full aspect-[4/1]',
    text: 'text-6xl',
    checkbox: 'w-5 h-5',
    checkmark: 'text-[13px]',
    paddingLeft: 'pl-12',
  },
}

const roundedConfig = {
  top: 'rounded-t-2xl',
  all: 'rounded-2xl',
  none: '',
}

// Filled Multi 색상 배열
const BG_COLORS = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500']

export function ZudoLogo({ size = 'md', className, rounded = 'top' }: ZudoLogoProps) {
  const config = sizeConfig[size]
  const roundedClass = roundedConfig[rounded]

  return (
    <motion.div
      animate={{
        backgroundColor: ['#6866F1', '#ff0000', '#00ff00', '#6866F1'],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
      className={cn(
        'flex items-center justify-center overflow-hidden border-4 border-yellow-400',
        config.container,
        roundedClass,
        className
      )}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Checklist pattern background */}
        <div className={cn('absolute inset-0 flex flex-col justify-evenly opacity-30', config.paddingLeft)}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              <div
                className={cn(
                  'mr-2 flex items-center justify-center',
                  config.checkbox,
                  BG_COLORS[i]
                )}
              >
                <span className={cn('text-white font-bold', config.checkmark)}>
                  ✓
                </span>
              </div>
              <div className="h-px bg-white w-full" />
            </div>
          ))}
        </div>
        {/* ZUDO text */}
        <motion.span 
          animate={{
            scale: [1, 1.1, 1],
            color: ['#ffffff', '#ffff00', '#00ffff', '#ffffff']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className={cn('font-[family-name:var(--font-impact)] font-normal text-white relative z-10', config.text)}
        >
          ZUDO
        </motion.span>
      </div>
    </motion.div>
  )
}
