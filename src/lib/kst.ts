/**
 * KST (Korean Standard Time, UTC+9) Date Utilities
 *
 * 이 모듈은 모든 날짜/시간 처리를 한국 표준시(KST, UTC+9) 기준으로 일관되게 처리합니다.
 * 서버가 어떤 시간대에 있든(UTC, PST 등) 항상 정확한 KST 날짜를 반환합니다.
 *
 * WARNING: toISOString()은 UTC로 변환하므로 이 모듈 외부에서 사용하지 마세요.
 *
 * @example
 * // 잘못된 방법 (UTC 기준)
 * new Date().toISOString().split('T')[0] // KST 00:30에 전날 날짜 반환
 *
 * // 올바른 방법 (KST 기준)
 * getTodayKst() // 항상 정확한 KST 날짜 반환
 */

import { DAY_OF_WEEK_LABELS } from '@/config/constants'

/** KST 오프셋 (분 단위): UTC+9 = 540분 */
const KST_OFFSET_MINUTES = 9 * 60

/**
 * 현재 시각을 KST 기준 Date 객체로 반환
 *
 * @returns KST 시간대 기준 현재 시각
 *
 * @example
 * const kstNow = getKstNow()
 * console.log(kstNow.getHours()) // KST 기준 시간
 */
export function getKstNow(): Date {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utc + KST_OFFSET_MINUTES * 60000)
}

/**
 * Date 객체를 KST 기준으로 변환
 *
 * @param date - 변환할 Date 객체
 * @returns KST 시간대 기준 Date 객체
 */
export function toKstDate(date: Date): Date {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000
  return new Date(utc + KST_OFFSET_MINUTES * 60000)
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷 (KST 기준)
 *
 * @param date - 포맷할 Date 객체 (기본값: 현재 시각)
 * @returns YYYY-MM-DD 형식 문자열
 *
 * @example
 * formatKstDate() // "2025-12-04" (오늘 KST 날짜)
 * formatKstDate(new Date('2025-12-04T15:00:00Z')) // "2025-12-05" (UTC 15:00 = KST 00:00)
 */
export function formatKstDate(date?: Date): string {
  const kstDate = date ? toKstDate(date) : getKstNow()
  const year = kstDate.getFullYear()
  const month = String(kstDate.getMonth() + 1).padStart(2, '0')
  const day = String(kstDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환 (KST 기준)
 * formatKstDate()의 별칭
 *
 * @returns YYYY-MM-DD 형식의 오늘 날짜
 *
 * @example
 * // 대체: new Date().toISOString().split('T')[0]
 * const today = getTodayKst() // "2025-12-04"
 */
export function getTodayKst(): string {
  return formatKstDate()
}

/**
 * 날짜를 datetime-local input 형식으로 포맷 (KST 기준)
 * HTML의 <input type="datetime-local">에서 사용
 *
 * @param date - 포맷할 Date 객체 (기본값: 현재 시각)
 * @returns YYYY-MM-DDTHH:mm 형식 문자열
 *
 * @example
 * // 대체: new Date().toISOString().slice(0, 16)
 * formatKstDateTimeLocal() // "2025-12-04T14:30"
 */
export function formatKstDateTimeLocal(date?: Date): string {
  const kstDate = date ? toKstDate(date) : getKstNow()
  const year = kstDate.getFullYear()
  const month = String(kstDate.getMonth() + 1).padStart(2, '0')
  const day = String(kstDate.getDate()).padStart(2, '0')
  const hours = String(kstDate.getHours()).padStart(2, '0')
  const minutes = String(kstDate.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * KST 기준 시간을 HH:mm 또는 HH:mm:ss 형식으로 포맷
 *
 * @param date - 포맷할 Date 객체 (기본값: 현재 시각)
 * @param options - 포맷 옵션
 * @returns HH:mm 또는 HH:mm:ss 형식 문자열
 *
 * @example
 * formatKstTime() // "14:30"
 * formatKstTime(new Date(), { includeSeconds: true }) // "14:30:15"
 */
export function formatKstTime(
  date?: Date,
  options?: { includeSeconds?: boolean }
): string {
  const kstDate = date ? toKstDate(date) : getKstNow()
  const hours = String(kstDate.getHours()).padStart(2, '0')
  const minutes = String(kstDate.getMinutes()).padStart(2, '0')

  if (options?.includeSeconds) {
    const seconds = String(kstDate.getSeconds()).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  return `${hours}:${minutes}`
}

/**
 * KST 기준 현재 시간을 HH:mm 형식으로 반환
 *
 * @returns HH:mm 형식 문자열
 *
 * @example
 * getKstTime() // "14:30"
 */
export function getKstTime(): string {
  return formatKstTime()
}

/**
 * KST 기준 현재 시간을 HH:mm:ss 형식으로 반환
 *
 * @returns HH:mm:ss 형식 문자열
 *
 * @example
 * getKstTimeWithSeconds() // "14:30:15"
 */
export function getKstTimeWithSeconds(): string {
  return formatKstTime(undefined, { includeSeconds: true })
}

/**
 * 날짜에 일수를 더하거나 뺌
 *
 * @param base - 기준 날짜 (Date 객체 또는 YYYY-MM-DD 문자열)
 * @param days - 더할 일수 (음수면 빼기)
 * @returns YYYY-MM-DD 형식 문자열
 *
 * @example
 * addKstDays('2025-12-04', 1)  // "2025-12-05"
 * addKstDays('2025-12-04', -7) // "2025-11-27"
 * addKstDays(new Date(), -1)   // 어제 날짜
 */
export function addKstDays(base: Date | string, days: number): string {
  let date: Date
  if (typeof base === 'string') {
    // YYYY-MM-DD 문자열을 KST 기준으로 파싱
    const [year, month, day] = base.split('-').map(Number)
    date = new Date(year, month - 1, day)
  } else {
    date = toKstDate(base)
  }
  date.setDate(date.getDate() + days)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 현재 주의 날짜 배열 반환 (일요일~토요일)
 *
 * @param referenceDate - 기준 날짜 (기본값: 현재)
 * @returns YYYY-MM-DD 형식 문자열 배열 (7개)
 *
 * @example
 * getKstWeekDates() // ["2025-11-30", "2025-12-01", ..., "2025-12-06"]
 */
export function getKstWeekDates(referenceDate?: Date): string[] {
  const kstRef = referenceDate ? toKstDate(referenceDate) : getKstNow()
  const dayOfWeek = kstRef.getDay() // 0 = Sunday

  const dates: string[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(kstRef)
    date.setDate(kstRef.getDate() - dayOfWeek + i)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    dates.push(`${year}-${month}-${day}`)
  }

  return dates
}

/**
 * 특정 월의 시작일과 종료일 반환
 *
 * @param year - 연도 (예: 2025)
 * @param month - 월 (1-12, 0-11 아님!)
 * @returns { start: YYYY-MM-DD, end: YYYY-MM-DD }
 *
 * @example
 * getKstMonthRange(2025, 12) // { start: "2025-12-01", end: "2025-12-31" }
 * getKstMonthRange(2024, 2)  // { start: "2024-02-01", end: "2024-02-29" } (윤년)
 */
export function getKstMonthRange(year: number, month: number): { start: string; end: string } {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0) // 다음달 0일 = 이번달 마지막날

  const formatDate = (d: Date): string => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  return {
    start: formatDate(startDate),
    end: formatDate(endDate),
  }
}

/**
 * YYYY-MM-DD 문자열을 KST 기준 Date 객체로 파싱
 * 시간대 변환 이슈를 피하기 위해 정오(12:00)로 설정
 *
 * @param dateString - YYYY-MM-DD 형식 문자열
 * @returns Date 객체
 *
 * @example
 * const date = parseKstDate('2025-12-04')
 * date.getDate() // 4 (KST 기준)
 */
export function parseKstDate(dateString: string): Date {
  // +09:00을 붙여 KST 시간대로 명시적 파싱
  return new Date(dateString + 'T12:00:00+09:00')
}

/**
 * 주어진 날짜가 오늘인지 확인 (KST 기준)
 *
 * @param dateString - YYYY-MM-DD 형식 문자열
 * @returns 오늘이면 true
 *
 * @example
 * isToday('2025-12-04') // true (오늘이 2025-12-04인 경우)
 */
export function isToday(dateString: string): boolean {
  return dateString === getTodayKst()
}

/**
 * 두 날짜가 같은 날인지 확인 (KST 기준)
 *
 * @param a - 첫 번째 날짜 (Date 또는 YYYY-MM-DD 문자열)
 * @param b - 두 번째 날짜 (Date 또는 YYYY-MM-DD 문자열)
 * @returns 같은 날이면 true
 */
export function isSameKstDate(a: Date | string, b: Date | string): boolean {
  const dateA = typeof a === 'string' ? a : formatKstDate(a)
  const dateB = typeof b === 'string' ? b : formatKstDate(b)
  return dateA === dateB
}

/**
 * KST 기준 현재 시간 정보 반환
 *
 * @returns { hours, minutes, dayOfWeek } (dayOfWeek: 0=일, 1=월, ..., 6=토)
 *
 * @example
 * const { hours, minutes, dayOfWeek } = getKstTimeInfo()
 * if (dayOfWeek === 0) console.log('일요일입니다')
 */
export function getKstTimeInfo(): { hours: number; minutes: number; dayOfWeek: number } {
  const kstNow = getKstNow()
  return {
    hours: kstNow.getHours(),
    minutes: kstNow.getMinutes(),
    dayOfWeek: kstNow.getDay(),
  }
}

/**
 * 날짜를 한국어 형식으로 포맷팅
 *
 * @param dateString - YYYY-MM-DD 형식 문자열
 * @param options - 포맷 옵션
 * @returns 포맷된 문자열
 *
 * @example
 * formatKstDateKorean('2025-12-04') // "12월 4일"
 * formatKstDateKorean('2025-12-04', { includeYear: true }) // "2025년 12월 4일"
 * formatKstDateKorean('2025-12-04', { includeWeekday: true }) // "12월 4일 (목)"
 */
export function formatKstDateKorean(
  dateString: string,
  options?: { includeYear?: boolean; includeWeekday?: boolean }
): string {
  const date = parseKstDate(dateString)

  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()
  const weekday = DAY_OF_WEEK_LABELS[date.getDay()]

  let result = `${month}월 ${day}일`

  if (options?.includeYear) {
    result = `${year}년 ${result}`
  }

  if (options?.includeWeekday) {
    result = `${result} (${weekday})`
  }

  return result
}

/**
 * 날짜 범위의 일수 계산
 *
 * @param startDate - 시작 날짜 (YYYY-MM-DD)
 * @param endDate - 종료 날짜 (YYYY-MM-DD)
 * @returns 일수 (종료일 포함)
 *
 * @example
 * getDaysBetween('2025-12-01', '2025-12-07') // 7
 */
export function getDaysBetween(startDate: string, endDate: string): number {
  const start = parseKstDate(startDate)
  const end = parseKstDate(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
}

/**
 * 날짜 범위 배열 생성
 *
 * @param startDate - 시작 날짜 (YYYY-MM-DD)
 * @param endDate - 종료 날짜 (YYYY-MM-DD)
 * @returns YYYY-MM-DD 형식 문자열 배열
 *
 * @example
 * getDateRange('2025-12-01', '2025-12-03') // ["2025-12-01", "2025-12-02", "2025-12-03"]
 */
export function getDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  let current = startDate

  while (current <= endDate) {
    dates.push(current)
    current = addKstDays(current, 1)
  }

  return dates
}

// ============================================
// 기숙사 운영일 (Operational Day) 관련 함수
// ============================================

/**
 * 기숙사 운영일 계산 (KST 기준)
 *
 * 기숙사 일지는 하루의 기록이 두 캘린더 날짜에 걸쳐 있음
 * 예: 12월 9일(화) 일지 = 12월 9일 18:50 ~ 12월 10일 오전
 *
 * @param transitionHour - 운영일 전환 시간 (기본 14, 즉 14:00)
 * @returns YYYY-MM-DD 형식의 운영일
 *
 * @example
 * // 12월 10일 오전 9시 (transitionHour=14)
 * getOperationalDate(14) // "2025-12-09" (전날 운영일)
 *
 * // 12월 10일 오후 3시 (transitionHour=14)
 * getOperationalDate(14) // "2025-12-10" (당일 운영일)
 */
export function getOperationalDate(transitionHour: number = 14): string {
  const kstNow = getKstNow()
  const currentHour = kstNow.getHours()

  // 전환 시간 이전이면 전날 운영일
  if (currentHour < transitionHour) {
    return addKstDays(formatKstDate(kstNow), -1)
  }

  return formatKstDate(kstNow)
}

/**
 * 기숙사 운영일 상세 정보 반환
 *
 * @param transitionHour - 운영일 전환 시간 (기본 14)
 * @returns 운영일 정보 객체
 *
 * @example
 * // 12월 10일 오전 9시
 * getOperationalDayInfo(14)
 * // {
 * //   operationalDate: "2025-12-09",
 * //   nextDate: "2025-12-10",
 * //   displayLabel: "12월 9일(화)~10일(수) 기숙사 일지",
 * //   isBeforeTransition: true
 * // }
 */
export function getOperationalDayInfo(transitionHour: number = 14): {
  operationalDate: string
  nextDate: string
  displayLabel: string
  isBeforeTransition: boolean
} {
  const kstNow = getKstNow()
  const currentHour = kstNow.getHours()
  const isBeforeTransition = currentHour < transitionHour

  const operationalDate = getOperationalDate(transitionHour)
  const nextDate = addKstDays(operationalDate, 1)
  const displayLabel = formatOperationalDateRange(operationalDate)

  return {
    operationalDate,
    nextDate,
    displayLabel,
    isBeforeTransition,
  }
}

/**
 * 운영일 날짜 범위를 한국어로 포맷
 *
 * @param operationalDate - YYYY-MM-DD 형식의 운영일
 * @returns "12월 9일(화)~10일(수) 기숙사 일지" 형식
 *
 * @example
 * formatOperationalDateRange("2025-12-09")
 * // "12월 9일(화)~10일(수) 기숙사 일지"
 */
export function formatOperationalDateRange(operationalDate: string): string {
  const startDate = parseKstDate(operationalDate)
  const endDate = parseKstDate(addKstDays(operationalDate, 1))

  const startMonth = startDate.getMonth() + 1
  const startDay = startDate.getDate()
  const startWeekday = DAY_OF_WEEK_LABELS[startDate.getDay()]

  const endMonth = endDate.getMonth() + 1
  const endDay = endDate.getDate()
  const endWeekday = DAY_OF_WEEK_LABELS[endDate.getDay()]

  // 같은 달이면 월 생략
  if (startMonth === endMonth) {
    return `${startMonth}월 ${startDay}일(${startWeekday})~${endDay}일(${endWeekday}) 기숙사 일지`
  }

  // 다른 달이면 월 표시
  return `${startMonth}월 ${startDay}일(${startWeekday})~${endMonth}월 ${endDay}일(${endWeekday}) 기숙사 일지`
}

/**
 * 운영일 날짜 범위를 짧은 형식으로 포맷 (일지 제목 외 용도)
 *
 * @param operationalDate - YYYY-MM-DD 형식의 운영일
 * @returns "12월 9일(화)~10일(수)" 형식
 */
export function formatOperationalDateRangeShort(operationalDate: string): string {
  const startDate = parseKstDate(operationalDate)
  const endDate = parseKstDate(addKstDays(operationalDate, 1))

  const startMonth = startDate.getMonth() + 1
  const startDay = startDate.getDate()
  const startWeekday = DAY_OF_WEEK_LABELS[startDate.getDay()]

  const endMonth = endDate.getMonth() + 1
  const endDay = endDate.getDate()
  const endWeekday = DAY_OF_WEEK_LABELS[endDate.getDay()]

  // 같은 달이면 월 생략
  if (startMonth === endMonth) {
    return `${startMonth}월 ${startDay}일(${startWeekday})~${endDay}일(${endWeekday})`
  }

  // 다른 달이면 월 표시
  return `${startMonth}월 ${startDay}일(${startWeekday})~${endMonth}월 ${endDay}일(${endWeekday})`
}
