export type SafetyReportStatus = 'pending' | 'reviewed' | 'rewarded' | 'rejected'
export type SafetyReportCategory = 'fire_hazard' | 'electrical' | 'structural' | 'water_leak' | 'broken_facility' | 'security' | 'other'

export const SAFETY_REPORT_CATEGORY_LABELS: Record<SafetyReportCategory, string> = {
  fire_hazard: '화재 위험', electrical: '전기 위험', structural: '구조물 위험',
  water_leak: '누수', broken_facility: '시설 파손', security: '보안 위험', other: '기타',
}

export const SAFETY_REPORT_STATUS_LABELS: Record<SafetyReportStatus, string> = {
  pending: '대기중', reviewed: '검토완료', rewarded: '보상완료', rejected: '반려됨',
}

export const SAFETY_REPORT_STATUS_COLORS: Record<SafetyReportStatus, { bg: string; text: string; border: string }> = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  reviewed: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  rewarded: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
  rejected: { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200' },
}

export interface SafetyReport {
  id: string
  student_id: string
  category: SafetyReportCategory
  location_text: string
  description: string
  image_path: string
  status: SafetyReportStatus
  reviewed_by: string | null
  reviewed_at: string | null
  review_note: string | null
  rewarded_pill_id: string | null
  reward_points: number | null
  created_at: string
  updated_at: string
}

export interface SubmitSafetyReportRequest {
  category: SafetyReportCategory
  location_text: string
  description: string
  image_path: string
}

export interface SubmitSafetyReportResponse {
  success: boolean
  error?: string
  report_id?: string
}
