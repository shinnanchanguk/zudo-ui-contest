'use client'

import { mockAfterschoolPrograms } from '@/lib/mock-data'

export interface AfterschoolClassWithRelations {
  id: string
  name: string
  teacher?: { id: string; full_name: string } | null
  location?: { id: string; name: string } | null
  max_students: number
  min_students: number
  description: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schedules: any[]
  _count?: { enrollments: number }
  semester_id: string
  term_id: string
  is_active: boolean
  created_at: string
  [key: string]: unknown
}

export function useAfterschoolClass(classId: string | null) {
  const cls = classId
    ? (mockAfterschoolPrograms.find((p) => p.id === classId) as AfterschoolClassWithRelations | undefined) ?? null
    : null

  return {
    data: cls,
    isLoading: false,
    isError: false,
    error: null,
  }
}

// Utility exports used by some components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseSchedules(schedules: unknown): any[] {
  if (Array.isArray(schedules)) return schedules
  return []
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatSchedules(schedules: any[]): string {
  const dayLabels = ['일', '월', '화', '수', '목', '금', '토']
  return schedules
    .map((s) => `${dayLabels[s.day_of_week]} ${s.start_time}~${s.end_time}`)
    .join(', ')
}
