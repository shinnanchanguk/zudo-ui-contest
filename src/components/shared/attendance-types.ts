export type AttendanceStatus = 'present' | 'unconfirmed' | 'overnight' | 'entry' | 'afterschool'
export type ExtendedKanbanStatus = AttendanceStatus | 'withdrawal' | 'other'

export function getStatusLabel(status: ExtendedKanbanStatus | null | undefined): string {
  const labels: Record<string, string> = {
    present: '출석', unconfirmed: '미확인', overnight: '외박',
    entry: '입실', afterschool: '방과후', withdrawal: '퇴사', other: '기타',
  }
  return labels[status ?? ''] ?? '미확인'
}
