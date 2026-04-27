/**
 * NavigationSkeletons.tsx
 * 메인 페이지에서 카드 클릭 시 즉시 표시되는 페이지별 맞춤 스켈레톤
 * 각 스켈레톤은 실제 페이지의 레이아웃을 최대한 모방합니다.
 */

// 공통 Shimmer wrapper - pulse 애니메이션 적용
function SkeletonBox({ className }: { className: string }) {
  return <div className={`bg-gray-200 rounded-xl animate-pulse ${className}`} />
}
function SkeletonCircle({ className }: { className: string }) {
  return <div className={`bg-gray-200 rounded-full animate-pulse ${className}`} />
}

// ─── 공통 헤더 스켈레톤 (흰 배경) ────────────────────────────────────────────
function WhiteHeaderSkeleton({ titleWidth = 'w-28' }: { titleWidth?: string }) {
  return (
    <header className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
      <SkeletonCircle className="w-10 h-10 shrink-0" />
      <SkeletonBox className={`h-5 ${titleWidth}`} />
    </header>
  )
}

// ─── QR 스캔 (/m/qr) ─────────────────────────────────────────────────────────
// 보라색 헤더 + 중앙 QR 카드
export function QrSkeleton() {
  return (
    <div className="min-h-dvh bg-primary flex flex-col">
      <div className="h-safe-top shrink-0" />
      {/* 보라색 헤더 */}
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse" />
          <div>
            <div className="w-16 h-5 rounded-md bg-white/20 animate-pulse mb-1" />
            <div className="w-24 h-3.5 rounded-md bg-white/10 animate-pulse" />
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-white/20 animate-pulse" />
      </header>
      {/* QR 카드 */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
        <div className="bg-white/10 animate-pulse rounded-3xl p-5">
          <div className="w-60 h-60 rounded-2xl bg-white/20 animate-pulse" />
        </div>
        <div className="w-24 h-4 rounded-md bg-white/20 animate-pulse" />
      </div>
    </div>
  )
}

// ─── 조기입실 신청 (/m/entry) ──────────────────────────────────────────────────
// 흰 헤더 + 현황 카드 + 원형 아이콘 + 안내박스 + 버튼
export function EntryInnerSkeleton() {
  return (
    <div className="flex-1 p-6 flex flex-col gap-5">
      {/* 이번 달 현황 카드 */}
      <div className="bg-indigo-50 rounded-2xl p-4 animate-pulse">
        <div className="w-32 h-3.5 bg-indigo-200 rounded mb-3" />
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-indigo-200 rounded-full" />
          <div className="w-10 h-4 bg-indigo-200 rounded" />
        </div>
        <div className="w-36 h-3 bg-indigo-100 rounded mt-2" />
      </div>
      {/* 원형 아이콘 */}
      <div className="flex flex-col items-center gap-4 mt-2">
        <SkeletonCircle className="w-32 h-32" />
        <SkeletonBox className="w-28 h-6" />
      </div>
      {/* 안내 박스 */}
      <div className="bg-gray-50 rounded-2xl p-5 space-y-3 animate-pulse">
        <SkeletonBox className="w-full h-4" />
        <SkeletonBox className="w-4/5 h-4" />
        <SkeletonBox className="w-full h-4 mt-1" />
        <SkeletonBox className="w-3/4 h-4" />
      </div>
      {/* 신청 버튼 */}
      <div className="mt-auto">
        <SkeletonBox className="w-full h-14" />
      </div>
    </div>
  )
}

export function EntrySkeleton() {
  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <div className="h-safe-top shrink-0" />
      <WhiteHeaderSkeleton titleWidth="w-28" />
      <EntryInnerSkeleton />
    </div>
  )
}

// ─── 연장학습 신청 (/m/extended-study) ────────────────────────────────────────
// 흰 헤더 + 상태 카드 + 토글 버튼
export function ExtendedStudyInnerSkeleton() {
  return (
    <div className="flex-1 p-6 flex flex-col gap-5">
      {/* 상태 카드 */}
      <div className="rounded-2xl border border-gray-100 p-5 space-y-3 animate-pulse">
        <SkeletonBox className="w-20 h-3.5" />
        <SkeletonBox className="w-40 h-6" />
        <SkeletonBox className="w-full h-4" />
      </div>
      {/* 구분 */}
      <SkeletonBox className="w-full h-px bg-gray-100 rounded-none" />
      {/* 현황 박스 */}
      <div className="rounded-2xl bg-gray-50 p-5 space-y-2 animate-pulse">
        <SkeletonBox className="w-28 h-4" />
        <SkeletonBox className="w-full h-3" />
        <SkeletonBox className="w-4/5 h-3" />
      </div>
      {/* 버튼 */}
      <div className="mt-auto space-y-3">
        <SkeletonBox className="w-full h-14" />
      </div>
    </div>
  )
}

export function ExtendedStudySkeleton() {
  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <div className="h-safe-top shrink-0" />
      <WhiteHeaderSkeleton titleWidth="w-28" />
      <ExtendedStudyInnerSkeleton />
    </div>
  )
}

// ─── 외박 신청 (/m/overnight) ─────────────────────────────────────────────────
// 흰 헤더 + 날짜 선택 2개 + 카테고리 그리드 + 텍스트 입력 + 리스트
export function OvernightSkeleton() {
  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <div className="h-safe-top shrink-0" />
      {/* 중앙 정렬 헤더 */}
      <header className="flex items-center h-14 px-4 border-b border-gray-200 bg-white">
        <SkeletonCircle className="w-10 h-10 shrink-0 -ml-0" />
        <div className="flex-1 flex justify-center">
          <SkeletonBox className="w-20 h-5" />
        </div>
        <div className="w-10" />
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 space-y-5 animate-pulse">
          {/* 기간 레이블 */}
          <SkeletonBox className="w-20 h-4" />
          {/* 날짜 2칸 */}
          <div className="grid grid-cols-2 gap-3">
            <SkeletonBox className="h-12" />
            <SkeletonBox className="h-12" />
          </div>
          {/* 사유 레이블 */}
          <SkeletonBox className="w-16 h-4" />
          {/* 카테고리 그리드 */}
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, i) => (
              <SkeletonBox key={i} className="h-11" />
            ))}
          </div>
          {/* 상세 사유 텍스트 */}
          <SkeletonBox className="w-20 h-4" />
          <SkeletonBox className="h-24" />
          {/* 버튼 */}
          <SkeletonBox className="w-full h-14" />
          {/* 구분 */}
          <div className="h-px bg-gray-200 rounded-none" />
          {/* 내역 헤더 */}
          <SkeletonBox className="w-28 h-4" />
          {/* 내역 카드 */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 p-4 space-y-2">
              <div className="flex justify-between">
                <SkeletonBox className="w-16 h-5" />
                <SkeletonBox className="w-14 h-5" />
              </div>
              <SkeletonBox className="w-48 h-4" />
              <SkeletonBox className="w-full h-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── 메시지 (/m/messages) ─────────────────────────────────────────────────────
// 채팅 UI: 헤더 + 채널탭 + 메시지 버블들
export function MessagesInnerSkeleton() {
  return (
    <div className="flex-1 flex flex-col">
      {/* 채널 탭 */}
      <div className="flex gap-2 px-4 py-3 border-b border-gray-100 animate-pulse">
        <SkeletonBox className="w-24 h-8" />
        <SkeletonBox className="w-20 h-8" />
      </div>
      {/* 메시지 버블들 */}
      <div className="flex-1 p-4 space-y-4 animate-pulse">
        {/* 날짜 구분 */}
        <div className="flex justify-center">
          <SkeletonBox className="w-24 h-5" />
        </div>
        {/* 수신 버블 */}
        <div className="flex items-start gap-2">
          <SkeletonCircle className="w-9 h-9 shrink-0" />
          <div className="space-y-1.5">
            <SkeletonBox className="w-32 h-3" />
            <SkeletonBox className="w-56 h-16 rounded-2xl rounded-tl-none" />
          </div>
        </div>
        {/* 수신 버블 (짧음) */}
        <div className="flex items-start gap-2">
          <SkeletonCircle className="w-9 h-9 shrink-0" />
          <div className="space-y-1.5">
            <SkeletonBox className="w-24 h-3" />
            <SkeletonBox className="w-40 h-10 rounded-2xl rounded-tl-none" />
          </div>
        </div>
        {/* 수신 버블 (길음) */}
        <div className="flex items-start gap-2">
          <SkeletonCircle className="w-9 h-9 shrink-0" />
          <div className="space-y-1.5">
            <SkeletonBox className="w-28 h-3" />
            <SkeletonBox className="w-64 h-20 rounded-2xl rounded-tl-none" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function MessagesSkeleton() {
  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <div className="h-safe-top shrink-0" />
      <WhiteHeaderSkeleton titleWidth="w-16" />
      <MessagesInnerSkeleton />
    </div>
  )
}

// ─── 안전 제보 (/m/safety-report) ────────────────────────────────────────────
// 헤더 + 카테고리 그리드 + 위치 입력 + 설명 + 이미지 업로드 + 내역
export function SafetyReportSkeleton() {
  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <div className="h-safe-top shrink-0" />
      <header className="flex items-center h-14 px-4 border-b border-gray-200 bg-white">
        <SkeletonCircle className="w-10 h-10 shrink-0 -ml-0" />
        <div className="flex-1 flex justify-center">
          <SkeletonBox className="w-16 h-5" />
        </div>
        <div className="w-10" />
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 space-y-5 animate-pulse">
          {/* 카테고리 */}
          <SkeletonBox className="w-20 h-4" />
          <div className="grid grid-cols-2 gap-2">
            {[...Array(6)].map((_, i) => <SkeletonBox key={i} className="h-12" />)}
          </div>
          {/* 위치 */}
          <SkeletonBox className="w-16 h-4" />
          <SkeletonBox className="w-full h-12" />
          {/* 설명 */}
          <SkeletonBox className="w-20 h-4" />
          <SkeletonBox className="w-full h-28" />
          {/* 사진 업로드 영역 */}
          <SkeletonBox className="w-20 h-4" />
          <SkeletonBox className="w-full h-32" />
          {/* 버튼 */}
          <SkeletonBox className="w-full h-14" />
          {/* 구분 */}
          <div className="h-px bg-gray-200 rounded-none" />
          {/* 내역 */}
          <SkeletonBox className="w-24 h-4" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 p-4 space-y-2">
              <div className="flex justify-between">
                <SkeletonBox className="w-20 h-5" />
                <SkeletonBox className="w-14 h-5" />
              </div>
              <SkeletonBox className="w-40 h-4" />
              <SkeletonBox className="w-full h-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── BCR 확인 (/m/bcr-history) ───────────────────────────────────────────────
// 헤더(중앙 타이틀) + 카드 리스트
export function BcrHistorySkeleton() {
  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <div className="h-safe-top shrink-0" />
      <header className="flex items-center h-14 px-4 border-b border-gray-200 bg-white">
        <SkeletonCircle className="w-10 h-10 shrink-0" />
        <div className="flex-1 flex justify-center">
          <SkeletonBox className="w-20 h-5" />
        </div>
        <div className="w-10" />
      </header>
      <div className="flex-1 p-4 space-y-3 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <SkeletonBox className="w-40 h-4" />
                  <SkeletonBox className="w-14 h-5 rounded-full" />
                </div>
                <SkeletonBox className="w-24 h-3" />
                <SkeletonBox className="w-28 h-3" />
              </div>
              <SkeletonBox className="w-5 h-5 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 알약 (/m/pills) ──────────────────────────────────────────────────────────
// 헤더 + 요약 카드(숫자 3개) + 리스트
export function PillsInnerSkeleton() {
  return (
    <div className="flex-1 animate-pulse">
      {/* 요약 카드 */}
      <div className="p-4">
        <div className="rounded-2xl bg-gray-50 p-5">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <SkeletonBox className="w-12 h-8" />
                <SkeletonBox className="w-16 h-3" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 내역 리스트 */}
      <div className="px-4 space-y-3">
        <SkeletonBox className="w-20 h-4 mb-1" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-50">
            <SkeletonCircle className="w-10 h-10 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <SkeletonBox className="w-36 h-4" />
              <SkeletonBox className="w-24 h-3" />
            </div>
            <SkeletonBox className="w-12 h-5 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function PillsSkeleton() {
  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <div className="h-safe-top shrink-0" />
      <header className="flex items-center h-14 px-4 border-b border-gray-200 bg-white">
        <SkeletonCircle className="w-10 h-10 shrink-0" />
        <div className="flex-1 flex justify-center">
          <SkeletonBox className="w-12 h-5" />
        </div>
        <div className="w-10" />
      </header>
      <PillsInnerSkeleton />
    </div>
  )
}

// ─── 방과후 (/m/afterschool) ──────────────────────────────────────────────────
// 헤더 + 탭 + 프로그램 카드 리스트
export function AfterschoolSkeleton() {
  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <div className="h-safe-top shrink-0" />
      <WhiteHeaderSkeleton titleWidth="w-24" />
      <div className="flex-1 animate-pulse">
        {/* 탭 */}
        <div className="flex gap-2 px-4 py-3 border-b border-gray-100">
          <SkeletonBox className="flex-1 h-9" />
          <SkeletonBox className="flex-1 h-9" />
        </div>
        {/* 검색 */}
        <div className="px-4 pt-4 pb-2">
          <SkeletonBox className="w-full h-10" />
        </div>
        {/* 프로그램 카드 */}
        <div className="px-4 space-y-3 mt-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2">
              <div className="flex items-start justify-between">
                <SkeletonBox className="w-32 h-5" />
                <SkeletonBox className="w-14 h-5 rounded-full" />
              </div>
              <SkeletonBox className="w-24 h-3.5" />
              <div className="flex gap-2 mt-1">
                <SkeletonBox className="w-16 h-5 rounded-full" />
                <SkeletonBox className="w-20 h-5 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── 라우트별 스켈레톤 맵 ─────────────────────────────────────────────────────
export function getSkeletonForHref(href: string) {
  switch (href) {
    case '/m/qr':             return <QrSkeleton />
    case '/m/entry':          return <EntrySkeleton />
    case '/m/extended-study': return <ExtendedStudySkeleton />
    case '/m/overnight':      return <OvernightSkeleton />
    case '/m/messages':       return <MessagesSkeleton />
    case '/m/safety-report':  return <SafetyReportSkeleton />
    case '/m/bcr-history':    return <BcrHistorySkeleton />
    case '/m/pills':          return <PillsSkeleton />
    case '/m/afterschool':    return <AfterschoolSkeleton />
    default:                  return null
  }
}

// ─── 홈 화면 (/m) ───────────────────────────────────────────────────────────
// 홈 화면으로 돌아갈 때 즉시 표시되는 스켈레톤
export function StudentMobilePageSkeleton() {
  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      <div className="h-safe-top shrink-0" />
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 flex flex-col gap-3 animate-pulse">
          {/* 로고 + 설정 버튼 */}
          <div className="flex items-center justify-between mb-4">
            <SkeletonBox className="w-24 h-8" />
            <SkeletonCircle className="w-10 h-10" />
          </div>
          
          {/* 인사말 */}
          <div className="mb-4 text-center flex flex-col items-center">
            <SkeletonBox className="w-48 h-8 mb-2" />
            <SkeletonBox className="w-32 h-4" />
          </div>

          {/* 배너 영역 */}
          <SkeletonBox className="w-full h-24 rounded-2xl mb-2" />

          {/* 2x4 버튼 그리드 */}
          <div className="grid grid-cols-2 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-3 p-4">
                <SkeletonBox className="w-12 h-12 rounded-2xl" />
                <SkeletonBox className="w-20 h-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 하단 고정 버튼 영역 */}
      <div className="shrink-0 px-4 py-3 pb-safe bg-gray-50 animate-pulse">
        <SkeletonBox className="w-full h-12 rounded-xl" />
      </div>
    </div>
  )
}
