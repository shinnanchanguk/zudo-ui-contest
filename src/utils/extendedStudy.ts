export function isWithinExtendedStudyTime(): boolean {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  return hours >= 0 && (hours < 2 || (hours === 2 && minutes < 30))
}

export function getExtendedStudyDate(): string {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  if (hours < 2 || (hours === 2 && minutes < 30)) {
    now.setDate(now.getDate() - 1)
  }
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function canRequestExtendedStudy(): { canRequest: boolean; reason?: string } {
  return { canRequest: true }
}

export function formatExtendedStudyDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatExtendedStudyPeriodRange(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const startStr = start.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
  const endStr = end.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
  return `${startStr} ~ ${endStr}`
}
