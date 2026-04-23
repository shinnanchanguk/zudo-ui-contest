export function getEnrollmentStartTime(startDate: string): Date {
  return new Date(startDate)
}

export function getEnrollmentEndTime(endDate: string): Date {
  return new Date(endDate)
}

export function isWithinEnrollmentPeriod(startDate: string, endDate: string): boolean {
  const now = new Date()
  return now >= new Date(startDate) && now <= new Date(endDate)
}

export function formatEnrollmentTime(isoDate: string): string {
  const d = new Date(isoDate)
  const hours = d.getHours()
  const minutes = d.getMinutes()
  const ampm = hours >= 12 ? '오후' : '오전'
  const h12 = hours % 12 || 12
  return minutes === 0 ? `${ampm} ${h12}시` : `${ampm} ${h12}시 ${minutes}분`
}

export function formatEnrollmentDateTime(isoDate: string): string {
  const d = new Date(isoDate)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']
  return `${month}월 ${day}일(${dayNames[d.getDay()]}) ${formatEnrollmentTime(isoDate)}`
}

export function formatEnrollmentPeriodSummary(startDate: string, endDate: string): string {
  return `${formatEnrollmentDateTime(startDate)} ~ ${formatEnrollmentDateTime(endDate)}`
}
