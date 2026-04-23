export interface RecurringSchedule { day_of_week: number; period: number }
export interface SpecificDateSchedule { date: string; period: number }

export interface EnrichedProgram {
  id: string; name: string; teacher_name: string | null
  location: { name: string } | null; program_type: string | null
  textbook_name: string | null; session_count: number | null
  session_descriptions: unknown; schedules: RecurringSchedule[] | null
  target_grades: number[] | null; periods_per_session?: number | null
  min_students?: number | null; schedule_mode: 'recurring' | 'specific' | null
  specific_dates: SpecificDateSchedule[] | null
}

export interface WeekData {
  weekId: string; weekLabel: string; startDate: Date; endDate: Date
  dates: Date[]; programsBySlot: Map<string, EnrichedProgram[]>; programCount: number
}

export function generateWeeksForRange(): WeekData[] { return [] }
export function generateWeeksAroundToday(): WeekData[] { return [] }
export function mapProgramsToWeeks(programs: EnrichedProgram[], weeks: WeekData[]): WeekData[] { return weeks }
export function isCurrentWeek(): boolean { return false }
export function isPastWeek(): boolean { return false }
export function isFutureWeek(): boolean { return false }
export function hasPrograms(week: WeekData): boolean { return week.programCount > 0 }
export function formatDateForGrid(date: Date): string { return `${date.getMonth() + 1}/${date.getDate()}` }
export function getDayName(date: Date): string { return ['일', '월', '화', '수', '목', '금', '토'][date.getDay()] }
