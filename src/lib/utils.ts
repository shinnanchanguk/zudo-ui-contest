import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 역할 타입 정의
type UserRole = 'admin' | 'dormitory_head' | 'teacher' | 'dormitory_supervisor' | 'student' | 'parent' | 'roll_call_staff'

// 역할 한글 라벨 매핑
const ROLE_LABELS: Record<UserRole, string> = {
  admin: '관리자',
  dormitory_head: '사감팀장',
  teacher: '교사',
  dormitory_supervisor: '사감교사',
  student: '학생',
  parent: '학부모',
  roll_call_staff: '점호담당자'
}

export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role] || role
}
