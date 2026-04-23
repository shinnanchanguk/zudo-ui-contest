export type StatusKey = 'present' | 'unconfirmed' | 'overnight' | 'entry' | 'afterschool' | 'afterschool_relocated' | 'late' | 'excused' | 'early_leave' | 'withdrawal' | 'other'

export interface StatusColorStyle {
  bg: string; text: string; textEn: string; border: string; dot: string; badge: string; badgeText: string; hoverBg: string; color: string;
}

export const STATUS_METADATA: Record<StatusKey, { text: string; textEn: string }> = {
  present: { text: '출석', textEn: 'Present' },
  unconfirmed: { text: '미확인', textEn: 'Unconfirmed' },
  overnight: { text: '외박', textEn: 'Overnight' },
  entry: { text: '입실', textEn: 'Entry' },
  afterschool: { text: '방과후', textEn: 'Afterschool' },
  afterschool_relocated: { text: '방과후(이동)', textEn: 'Relocated' },
  late: { text: '지각', textEn: 'Late' },
  excused: { text: '사유', textEn: 'Excused' },
  early_leave: { text: '조퇴', textEn: 'Early Leave' },
  withdrawal: { text: '퇴사', textEn: 'Withdrawal' },
  other: { text: '기타', textEn: 'Other' },
}

export const DEFAULT_STATUS_COLOR_MAP: Record<StatusKey, string> = {
  present: 'green', unconfirmed: 'slate', overnight: 'purple', entry: 'amber',
  afterschool: 'orange', afterschool_relocated: 'cyan', late: 'yellow',
  excused: 'teal', early_leave: 'indigo', withdrawal: 'rose', other: 'slate',
}
