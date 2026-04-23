export type ScheduleMode = 'recurring' | 'specific'
export type RegistrationMode = 'self_registration' | 'direct_assignment'
export type CourseCategory = 'subject' | 'theme_interview'

export const COURSE_CATEGORY_LABELS: Record<CourseCategory, string> = {
  theme_interview: '테마/면접', subject: '교과',
}

export interface RecurringSchedule {
  day_of_week: number
  period: number
}

export interface SpecificDateSchedule {
  date: string
  period: number
}

export interface ScheduleBlock {
  date: string
  period: number
}

export interface NormalizedScheduleItem {
  dayOfWeek: number
  period: number
  date?: string
  isRecurring: boolean
}

const _DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']
export const DAY_OF_WEEK_LABELS: Record<number, string> = Object.fromEntries(
  _DAY_LABELS.map((label, index) => [index, label])
)

export function formatPeriodRange(periods: number[]): string {
  if (periods.length === 0) return ''
  if (periods.length === 1) return `${periods[0]}교시`
  const sorted = [...periods].sort((a, b) => a - b)
  return `${sorted[0]}-${sorted[sorted.length - 1]}교시`
}

export function expandPeriodsForDisplay(periods: number[], periodsPerSession: number = 1): number[] {
  if (periodsPerSession <= 1) return periods
  const expanded = new Set<number>()
  periods.forEach(p => { for (let i = 0; i < periodsPerSession && p + i <= 4; i++) expanded.add(p + i) })
  return [...expanded].sort((a, b) => a - b)
}

export function getCourseCategoryLabel(value: string | null | undefined): string {
  if (!value) return ''
  return COURSE_CATEGORY_LABELS[value as CourseCategory] ?? value
}
