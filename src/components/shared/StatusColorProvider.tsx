'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { StatusKey, StatusColorStyle } from '@/types/admin'
import { STATUS_METADATA, DEFAULT_STATUS_COLOR_MAP } from '@/types/admin'

interface StatusColorContextType {
  colorMap: Record<StatusKey, string>
  styles: Record<StatusKey, StatusColorStyle>
  isLoading: boolean
  error: Error | null
}

function makeStyle(key: StatusKey, color: string): StatusColorStyle {
  return {
    bg: `bg-${color}-100`, text: STATUS_METADATA[key].text, textEn: STATUS_METADATA[key].textEn,
    border: `border-${color}-200`, dot: `bg-${color}-500`, badge: `bg-${color}-500`,
    badgeText: `bg-${color}-100 text-${color}-800`, hoverBg: `hover:bg-${color}-100`, color: '#64748b',
  }
}

const defaultStyles = Object.fromEntries(
  Object.entries(DEFAULT_STATUS_COLOR_MAP).map(([k, c]) => [k, makeStyle(k as StatusKey, c)])
) as Record<StatusKey, StatusColorStyle>

const defaultValue: StatusColorContextType = {
  colorMap: DEFAULT_STATUS_COLOR_MAP, styles: defaultStyles, isLoading: false, error: null,
}

const StatusColorContext = createContext<StatusColorContextType>(defaultValue)

export function StatusColorProvider({ children }: { children: ReactNode }) {
  return <StatusColorContext.Provider value={defaultValue}>{children}</StatusColorContext.Provider>
}

export function useStatusStyles(): StatusColorContextType {
  return useContext(StatusColorContext)
}

export function useStatusStyle(status: StatusKey): StatusColorStyle {
  const { styles } = useStatusStyles()
  return styles[status]
}

export { StatusColorContext }
export type { StatusColorContextType }
