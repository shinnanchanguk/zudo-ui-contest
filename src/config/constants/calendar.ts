/**
 * 요일 및 날짜 관련 통합 상수
 *
 * Single Source of Truth (SSOT) for calendar constants
 * JavaScript Date.getDay() 표준: 0=일요일, 6=토요일
 *
 * @see src/lib/kst.ts - KST 날짜 유틸리티
 */

// 요일 라벨 (일요일 시작 - JavaScript 표준)
export const DAY_OF_WEEK_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;
export type DayOfWeekLabel = (typeof DAY_OF_WEEK_LABELS)[number];

// 요일 인덱스 (JavaScript Date.getDay() 기준)
export type DayOfWeekIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// 주 시작일 설정
export const WEEK_STARTS_ON = 0 as const; // 0=일요일 (한국 달력 표준)

// 월요일 시작 라벨 (필요 시 사용)
export const DAY_OF_WEEK_LABELS_MON_START = ['월', '화', '수', '목', '금', '토', '일'] as const;

// 평일만 (방과후/야자 관련)
export const WEEKDAY_LABELS = ['월', '화', '수', '목', '금'] as const;
export const WEEKDAY_IDS = [1, 2, 3, 4, 5] as const;
export type WeekdayId = (typeof WEEKDAY_IDS)[number];

// 주간 일정용 (월-금)
export const WEEK_DAYS = [
    { id: 1, label: '월' },
    { id: 2, label: '화' },
    { id: 3, label: '수' },
    { id: 4, label: '목' },
    { id: 5, label: '금' },
] as const;

export type WeekDay = (typeof WEEK_DAYS)[number];

// 헬퍼 함수
export function getDayLabel(dayIndex: DayOfWeekIndex): DayOfWeekLabel {
    return DAY_OF_WEEK_LABELS[dayIndex];
}

export function getWeekdayLabel(weekdayId: WeekdayId): string {
    const day = WEEK_DAYS.find((d) => d.id === weekdayId);
    return day?.label ?? '';
}

// 일요일/토요일 여부
export function isWeekend(dayIndex: DayOfWeekIndex): boolean {
    return dayIndex === 0 || dayIndex === 6;
}

export function isWeekday(dayIndex: DayOfWeekIndex): boolean {
    return dayIndex >= 1 && dayIndex <= 5;
}

/**
 * 방과후 수업 불가 요일 (학교 정책)
 * 화요일(2), 금요일(5) - JavaScript Date.getDay() 기준
 * 방과후는 월(1), 수(3), 목(4)만 가능
 */
export const AFTERSCHOOL_DISABLED_WEEKDAYS: readonly DayOfWeekIndex[] = [2, 5] as const;
