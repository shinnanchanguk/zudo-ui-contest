/**
 * Mock Data for Zudo UI Contest
 *
 * 실제 데이터베이스 없이 UI를 체험할 수 있도록 한국어 mock 데이터를 제공합니다.
 * 모든 개인정보는 가상입니다.
 */

// ============================================
// Profile
// ============================================
export const mockProfile = {
  id: 'mock-student-001',
  full_name: '학생A',
  role: 'student' as const,
  avatar_url: null,
  created_at: '2025-03-01T00:00:00+09:00',
  updated_at: '2026-04-01T00:00:00+09:00',
}

export const mockStudentInfo = {
  student_number: '00000',
  room_number: '000',
  grade: 2,
  class_num: 2,
  number: 15,
  building: '기숙사동',
}

// ============================================
// QR Code
// ============================================
export const mockQrCode = 'ZUDO-MOCK-QR-2024-STUDENT-001'

// ============================================
// Overnight Records
// ============================================
export const mockOvernightRecords = [
  {
    id: 'overnight-001',
    student_id: 'mock-student-001',
    start_date: '2026-04-18',
    return_date: '2026-04-19',
    reason_category: 'family' as const,
    reason: '가족 행사 참석',
    approval_status: 'approved' as const,
    approved_by: 'admin-001',
    approved_at: '2026-04-15T14:00:00+09:00',
    rejection_reason: null,
    requested_by: 'mock-student-001',
    created_at: '2026-04-14T10:00:00+09:00',
  },
  {
    id: 'overnight-002',
    student_id: 'mock-student-001',
    start_date: '2026-04-25',
    return_date: '2026-04-26',
    reason_category: 'sick' as const,
    reason: '병원 정기검진',
    approval_status: 'pending' as const,
    approved_by: null,
    approved_at: null,
    rejection_reason: null,
    requested_by: 'mock-student-001',
    created_at: '2026-04-20T09:00:00+09:00',
  },
  {
    id: 'overnight-003',
    student_id: 'mock-student-001',
    start_date: '2026-03-15',
    return_date: '2026-03-16',
    reason_category: 'competition' as const,
    reason: '수학올림피아드 대회 참가',
    approval_status: 'approved' as const,
    approved_by: 'admin-001',
    approved_at: '2026-03-12T16:00:00+09:00',
    rejection_reason: null,
    requested_by: 'mock-student-001',
    created_at: '2026-03-10T08:00:00+09:00',
  },
  {
    id: 'overnight-004',
    student_id: 'mock-student-001',
    start_date: '2026-02-20',
    return_date: '2026-02-21',
    reason_category: 'other' as const,
    reason: '개인 사유',
    approval_status: 'rejected' as const,
    approved_by: 'admin-001',
    approved_at: '2026-02-18T10:00:00+09:00',
    rejection_reason: '외박 횟수 초과',
    requested_by: 'mock-student-001',
    created_at: '2026-02-17T11:00:00+09:00',
  },
]

// ============================================
// BCR (Body Condition Record) History
// ============================================
export const mockBcrRecords = [
  {
    id: 'bcr-001',
    room_number: '000',
    date: '2026-04-14',
    status: 'clean' as const,
    reason: null,
    pills_awarded: 2,
    pills_type: 'merit' as const,
    photo_count: 2,
    photos: ['bcr-photos/302/2026-04-14/photo1.jpg', 'bcr-photos/302/2026-04-14/photo2.jpg'],
    checklist_failures: [],
    created_at: '2026-04-14T08:00:00+09:00',
  },
  {
    id: 'bcr-002',
    room_number: '000',
    date: '2026-04-07',
    status: 'acceptable' as const,
    reason: '책상 위 정리 미흡',
    pills_awarded: 0,
    pills_type: null,
    photo_count: 1,
    photos: ['bcr-photos/302/2026-04-07/photo1.jpg'],
    checklist_failures: [],
    created_at: '2026-04-07T08:00:00+09:00',
  },
  {
    id: 'bcr-003',
    room_number: '000',
    date: '2026-03-31',
    status: 'needs_improvement' as const,
    reason: '침대 정리 불량, 쓰레기통 미비',
    pills_awarded: -1,
    pills_type: 'demerit' as const,
    photo_count: 3,
    photos: [
      'bcr-photos/302/2026-03-31/photo1.jpg',
      'bcr-photos/302/2026-03-31/photo2.jpg',
      'bcr-photos/302/2026-03-31/photo3.jpg',
    ],
    checklist_failures: [
      { item: '침대 정리', note: '이불 정리 안 됨' },
      { item: '쓰레기통', note: '비우지 않음' },
    ],
    created_at: '2026-03-31T08:00:00+09:00',
  },
]

// ============================================
// Pill (Merit/Demerit) Records
// ============================================
export const mockPillSummary = {
  student_id: 'mock-student-001',
  total_merit: 12,
  total_demerit: 3,
  net_pills: 9,
  merit_count: 5,
  demerit_count: 2,
  last_updated: '2026-04-14T08:00:00+09:00',
}

export const mockPillRecords = [
  {
    id: 'pill-001',
    student_id: 'mock-student-001',
    amount: 2,
    type: 'merit' as const,
    reason: 'BCR 청결 우수',
    criteria_name: 'BCR 점검',
    recorded_by_name: '담당자A',
    recorded_by_role: 'dormitory_supervisor',
    created_at: '2026-04-14T08:30:00+09:00',
  },
  {
    id: 'pill-002',
    student_id: 'mock-student-001',
    amount: 3,
    type: 'merit' as const,
    reason: '안전 제보 우수',
    criteria_name: '안전 제보',
    recorded_by_name: '담당자B',
    recorded_by_role: 'admin',
    created_at: '2026-04-10T14:00:00+09:00',
  },
  {
    id: 'pill-003',
    student_id: 'mock-student-001',
    amount: -1,
    type: 'demerit' as const,
    reason: 'BCR 정리 불량',
    criteria_name: 'BCR 점검',
    recorded_by_name: '담당자A',
    recorded_by_role: 'dormitory_supervisor',
    created_at: '2026-03-31T08:30:00+09:00',
  },
  {
    id: 'pill-004',
    student_id: 'mock-student-001',
    amount: 5,
    type: 'merit' as const,
    reason: '봉사활동 참여',
    criteria_name: '봉사활동',
    recorded_by_name: '담당자B',
    recorded_by_role: 'admin',
    created_at: '2026-03-20T16:00:00+09:00',
  },
  {
    id: 'pill-005',
    student_id: 'mock-student-001',
    amount: -2,
    type: 'demerit' as const,
    reason: '취침시간 이후 소음',
    criteria_name: '생활 규정',
    recorded_by_name: '담당자A',
    recorded_by_role: 'dormitory_supervisor',
    created_at: '2026-03-15T23:30:00+09:00',
  },
  {
    id: 'pill-006',
    student_id: 'mock-student-001',
    amount: 2,
    type: 'merit' as const,
    reason: 'BCR 청결 우수',
    criteria_name: 'BCR 점검',
    recorded_by_name: '담당자A',
    recorded_by_role: 'dormitory_supervisor',
    created_at: '2026-03-07T08:30:00+09:00',
  },
]

// ============================================
// Messages
// ============================================
export const mockChannels = [
  {
    id: 'channel-001',
    name: '전체 공지',
    slug: 'announcements',
    description: '기숙사 전체 공지사항',
    channel_type: 'announcement' as const,
    visibility_rules: null,
    metadata: null,
    is_system: true,
    is_active: true,
    created_by: 'admin-001',
    created_at: '2025-03-01T00:00:00+09:00',
    updated_at: '2026-04-14T00:00:00+09:00',
  },
  {
    id: 'channel-002',
    name: '2학년',
    slug: 'grade-2',
    description: '2학년 전용 채널',
    channel_type: 'grade' as const,
    visibility_rules: null,
    metadata: null,
    is_system: true,
    is_active: true,
    created_by: 'admin-001',
    created_at: '2025-03-01T00:00:00+09:00',
    updated_at: '2026-04-10T00:00:00+09:00',
  },
]

export const mockMessages = [
  {
    id: 'msg-001',
    channel_id: 'channel-001',
    sender_id: 'admin-001',
    content: '4월 18일(금) 외박 신청은 4월 16일(수)까지 완료해 주세요.',
    content_type: 'text' as const,
    is_pinned: false,
    created_at: '2026-04-14T09:00:00+09:00',
    updated_at: '2026-04-14T09:00:00+09:00',
    sender: {
      id: 'admin-001',
      full_name: '담당자B',
      role: 'admin',
      student_id: null,
      student: null,
    },
  },
  {
    id: 'msg-002',
    channel_id: 'channel-001',
    sender_id: 'admin-001',
    content: '이번 주 BCR 점검 결과가 발표되었습니다. 알약 탭에서 확인하세요.',
    content_type: 'text' as const,
    is_pinned: false,
    created_at: '2026-04-14T08:30:00+09:00',
    updated_at: '2026-04-14T08:30:00+09:00',
    sender: {
      id: 'admin-001',
      full_name: '담당자B',
      role: 'admin',
      student_id: null,
      student: null,
    },
  },
  {
    id: 'msg-003',
    channel_id: 'channel-001',
    sender_id: 'supervisor-001',
    content: '연장학습 신청은 매일 오후 6시까지입니다. 늦지 않도록 주의해 주세요.',
    content_type: 'text' as const,
    is_pinned: true,
    created_at: '2026-04-12T18:00:00+09:00',
    updated_at: '2026-04-12T18:00:00+09:00',
    sender: {
      id: 'supervisor-001',
      full_name: '담당자A',
      role: 'dormitory_supervisor',
      student_id: null,
      student: null,
    },
  },
]

// ============================================
// Safety Reports
// ============================================
export const mockSafetyReports = [
  {
    id: 'safety-001',
    reporter_id: 'mock-student-001',
    category: 'broken_facility' as const,
    location: '기숙사동 3층 화장실',
    description: '세면대 수도꼭지에서 물이 계속 새고 있습니다.',
    image_url: null,
    status: 'rewarded' as const,
    pills_awarded: 3,
    admin_note: '수리 완료 (4/15)',
    created_at: '2026-04-10T20:00:00+09:00',
    updated_at: '2026-04-15T10:00:00+09:00',
  },
  {
    id: 'safety-002',
    reporter_id: 'mock-student-001',
    category: 'electrical' as const,
    location: '기숙사동 2층 복도',
    description: '복도 조명 하나가 깜빡거립니다.',
    image_url: null,
    status: 'pending' as const,
    pills_awarded: null,
    admin_note: null,
    created_at: '2026-04-14T19:00:00+09:00',
    updated_at: '2026-04-14T19:00:00+09:00',
  },
]

// ============================================
// Entry Records
// ============================================
export const mockEntryRecord = {
  id: 'entry-001',
  student_id: 'mock-student-001',
  date: '2026-04-16',
  is_present: false,
  entry_time: null,
  approval_status: 'pending' as const,
  created_at: '2026-04-16T16:00:00+09:00',
}

// ============================================
// Extended Study
// ============================================
export const mockExtendedStudyStatus = {
  has_active_period: true,
  period_name: '2026학년도 1학기 1차',
  period_end_date: '2026-07-15',
  is_registered: false,
  is_verified: false,
  registered_at: null,
  registered_by_self: false,
}

export const mockExtendedStudyPeriod = {
  id: 'ext-period-001',
  name: '2026학년도 1학기 1차',
  start_date: '2026-03-04',
  end_date: '2026-07-15',
  is_active: true,
}

// ============================================
// Today's Scan Status
// ============================================
export const mockTodayScans = [
  {
    scanType: 'morning_exit' as const,
    scannedAt: '2026-04-16T07:55:00+09:00',
    isLate: false,
    lateMinutes: 0,
  },
]

// ============================================
// Afterschool Programs
// ============================================
export const mockAfterschoolPrograms = [
  {
    id: 'as-001',
    name: '인공지능 기초',
    teacher: { id: 'teacher-001', full_name: '교사A' },
    location: { id: 'loc-001', name: '컴퓨터실 1' },
    max_students: 20,
    min_students: 5,
    description: 'Python과 TensorFlow를 활용한 인공지능 기초 과정입니다.',
    schedules: [
      { day_of_week: 1, start_time: '16:30', end_time: '18:00' },
      { day_of_week: 3, start_time: '16:30', end_time: '18:00' },
    ],
    _count: { enrollments: 15 },
    semester_id: 'sem-001',
    term_id: 'term-001',
    is_active: true,
    created_at: '2026-03-01T00:00:00+09:00',
  },
  {
    id: 'as-002',
    name: '수학 심화반',
    teacher: { id: 'teacher-002', full_name: '교사B' },
    location: { id: 'loc-002', name: '수학실' },
    max_students: 25,
    min_students: 5,
    description: '수학올림피아드 대비 심화 수학 과정입니다.',
    schedules: [
      { day_of_week: 1, start_time: '16:30', end_time: '18:00' },
      { day_of_week: 4, start_time: '16:30', end_time: '18:00' },
    ],
    _count: { enrollments: 22 },
    semester_id: 'sem-001',
    term_id: 'term-001',
    is_active: true,
    created_at: '2026-03-01T00:00:00+09:00',
  },
  {
    id: 'as-003',
    name: '영어 토론반',
    teacher: { id: 'teacher-003', full_name: '교사C' },
    location: { id: 'loc-003', name: '영어실' },
    max_students: 15,
    min_students: 5,
    description: '영어 디베이트 실력 향상을 위한 과정입니다.',
    schedules: [
      { day_of_week: 3, start_time: '16:30', end_time: '18:00' },
    ],
    _count: { enrollments: 12 },
    semester_id: 'sem-001',
    term_id: 'term-001',
    is_active: true,
    created_at: '2026-03-01T00:00:00+09:00',
  },
]

export const mockStudentApplications = [
  {
    id: 'app-001',
    student_id: 'mock-student-001',
    class_id: 'as-001',
    period_id: 'period-001',
    status: 'approved' as const,
    priority: 1,
    created_at: '2026-03-05T10:00:00+09:00',
    updated_at: '2026-03-06T14:00:00+09:00',
    afterschool_class: mockAfterschoolPrograms[0],
  },
]

export const mockEnrollmentPeriod = {
  period_id: 'period-001',
  period_phase: 1,
  period_start_date: '2026-03-03',
  period_end_date: '2026-03-10',
  period_is_active: false,
  term_id: 'term-001',
  term_name: '2026학년도 1학기 1차',
  semester_id: 'sem-001',
  semester_name: '2026학년도 1학기',
}
