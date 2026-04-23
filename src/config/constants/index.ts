/**
 * Contest shell constants - minimal subset needed for mobile screens
 */

// 요일/날짜
export {
  DAY_OF_WEEK_LABELS,
  DAY_OF_WEEK_LABELS_MON_START,
  WEEKDAY_LABELS,
  WEEKDAY_IDS,
  WEEK_DAYS,
  WEEK_STARTS_ON,
  type DayOfWeekLabel,
  type DayOfWeekIndex,
  type WeekdayId,
  type WeekDay,
  getDayLabel,
  getWeekdayLabel,
  isWeekend,
  isWeekday,
  AFTERSCHOOL_DISABLED_WEEKDAYS,
} from './calendar'

// Afterschool min students constant
export const AFTERSCHOOL_DEFAULT_MIN_STUDENTS = 5
export const LEGACY_AFTERSCHOOL_DEFAULT_MIN_STUDENTS = 5
export function getEffectiveAfterschoolMinStudents(_semesterId?: string): number {
  return AFTERSCHOOL_DEFAULT_MIN_STUDENTS
}
