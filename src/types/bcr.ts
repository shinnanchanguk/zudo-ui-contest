export type BcrStatus = 'excellent' | 'normal' | 'poor' | 'very_poor' | 'clean' | 'warning' | 'dirty'
export type PillType = 'merit' | 'demerit'

export interface BcrHistoryItem {
  id: string
  room_id: string
  room_number: string
  date: string
  status: BcrStatus
  reason: string | null
  photos: string[]
  created_at: string
  updated_at: string
  pill_points: number | null
  pill_type: PillType | null
}

export interface BcrChecklistItemWithLabel {
  id: string
  checklist_id: string
  checklist_label: string
  is_ok: boolean
  note: string | null
}

export interface BcrRecordWithPhotos {
  room_number?: string
  photos: string[]
  [key: string]: unknown
}

export const BCR_STATUS_LABELS: Record<string, string> = {
  excellent: '우수', normal: '보통', poor: '불량', very_poor: '매우 불량',
  clean: '양호 (구)', warning: '주의 (구)', dirty: '불량 (구)',
}

export const BCR_STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  excellent: { bg: 'bg-green-100', text: 'text-green-700' },
  normal: { bg: 'bg-gray-100', text: 'text-gray-700' },
  poor: { bg: 'bg-orange-100', text: 'text-orange-700' },
  very_poor: { bg: 'bg-red-100', text: 'text-red-700' },
  clean: { bg: 'bg-status-entry', text: 'text-status-entry-foreground' },
  warning: { bg: 'bg-status-overnight', text: 'text-status-overnight-foreground' },
  dirty: { bg: 'bg-status-absent', text: 'text-status-absent-foreground' },
}

export const BCR_STATUS_PILL_MAP: Record<string, { type: PillType | null; points: number; label: string }> = {
  excellent: { type: 'merit', points: 1, label: '초록 알약 +1' },
  normal: { type: null, points: 0, label: '알약 없음' },
  poor: { type: 'demerit', points: 1, label: '붉은 알약 +1' },
  very_poor: { type: 'demerit', points: 2, label: '붉은 알약 +2' },
  clean: { type: null, points: 0, label: '알약 없음' },
  warning: { type: null, points: 0, label: '알약 없음' },
  dirty: { type: null, points: 0, label: '알약 없음' },
}

export function isBcrStatusPoor(status: BcrStatus): boolean {
  return status === 'poor' || status === 'very_poor'
}

export function isBcrStatusNeedsChecklist(status: BcrStatus): boolean {
  return status === 'normal' || status === 'poor' || status === 'very_poor'
}
