export type OvernightCategory = 'family' | 'sick' | 'field_trip' | 'competition' | 'withdrawal' | 'other'

export const OVERNIGHT_CATEGORY_STYLES = {
  field_trip: { border: 'border-blue-500', bg: 'bg-blue-50/90', badge: 'bg-blue-500', badgeText: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500', hoverBg: 'hover:bg-blue-100', text: '체험학습', textEn: 'Field Trip', color: '#3b82f6' },
  sick: { border: 'border-red-500', bg: 'bg-red-50/90', badge: 'bg-red-500', badgeText: 'bg-red-100 text-red-700', dot: 'bg-red-500', hoverBg: 'hover:bg-red-100', text: '질병', textEn: 'Sick', color: '#ef4444' },
  competition: { border: 'border-green-500', bg: 'bg-green-50/90', badge: 'bg-green-500', badgeText: 'bg-green-100 text-green-700', dot: 'bg-green-500', hoverBg: 'hover:bg-green-100', text: '대회', textEn: 'Competition', color: '#22c55e' },
  family: { border: 'border-orange-500', bg: 'bg-orange-50/90', badge: 'bg-orange-500', badgeText: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500', hoverBg: 'hover:bg-orange-100', text: '가정사정', textEn: 'Family', color: '#f97316' },
  withdrawal: { border: 'border-purple-500', bg: 'bg-purple-50/90', badge: 'bg-purple-500', badgeText: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500', hoverBg: 'hover:bg-purple-100', text: '퇴사', textEn: 'Withdrawal', color: '#a855f7' },
  other: { border: 'border-slate-400', bg: 'bg-slate-50/90', badge: 'bg-slate-400', badgeText: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400', hoverBg: 'hover:bg-slate-100', text: '기타', textEn: 'Other', color: '#94a3b8' },
} as const

export type CategoryStyleKey = keyof typeof OVERNIGHT_CATEGORY_STYLES

export function getCategoryStyle(category: OvernightCategory | null | undefined) {
  if (!category || !(category in OVERNIGHT_CATEGORY_STYLES)) return OVERNIGHT_CATEGORY_STYLES.other
  return OVERNIGHT_CATEGORY_STYLES[category as CategoryStyleKey]
}
