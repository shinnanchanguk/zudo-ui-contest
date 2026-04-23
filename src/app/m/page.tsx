'use client'

import { useRouter } from 'next/navigation'
import { LogIn, Moon, MessageSquare, LogOut, QrCode, BookOpen, Shield, Pill } from 'lucide-react'
import { useProfile, useSignOut } from '@/hooks/useAuth'
import { ZudoLogo } from '@/components/logo/ZudoLogo'
import { Sparkles } from 'lucide-react'
import { EnrollmentBanner } from '@/components/mobile/afterschool/EnrollmentBanner'
import { LateNotificationPopup } from '@/components/mobile/LateNotificationPopup'

const FEATURE_CARDS = [
  {
    title: 'QR 스캔',
    icon: QrCode,
    href: '/m/qr',
    iconClass: 'bg-[#6866F1] text-white shadow-lg shadow-indigo-200',
  },
  {
    title: '조기입실 신청',
    icon: LogIn,
    href: '/m/entry',
    iconClass: 'bg-indigo-50 text-[#6866F1]',
  },
  {
    title: '연장학습 신청',
    icon: BookOpen,
    href: '/m/extended-study',
    iconClass: 'bg-pink-50 text-pink-600',
  },
  {
    title: '외박 신청',
    icon: Moon,
    href: '/m/overnight',
    iconClass: 'bg-indigo-50 text-[#6866F1]',
  },
  {
    title: '메시지',
    icon: MessageSquare,
    href: '/m/messages',
    iconClass: 'bg-indigo-50 text-[#6866F1]',
  },
  {
    title: '안전 제보',
    icon: Shield,
    href: '/m/safety-report',
    iconClass: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'BCR 확인',
    icon: Sparkles,
    href: '/m/bcr-history',
    iconClass: 'bg-blue-50 text-blue-600',
  },
  {
    title: '알약',
    icon: Pill,
    href: '/m/pills',
    iconClass: 'bg-green-50 text-green-600',
  },
]

export default function StudentMobilePage() {
  const router = useRouter()
  const { data: profile } = useProfile()
  const signOut = useSignOut()

  const studentName = profile?.full_name || '학생'

  const handleNavigate = (href: string) => {
    router.push(href)
  }

  const handleLogout = () => {
    signOut.mutateAsync()
  }

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      {/* 상태바 공간 */}
      <div className="h-safe-top shrink-0" />

      {/* 스크롤 가능한 메인 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 flex flex-col gap-3">
          {/* 로고 - 갭 축소 */}
          <div className="mb-4">
            <ZudoLogo size="mobile" rounded="top" />
          </div>

          {/* 인사말 - 갭 축소 */}
          <div className="mb-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              안녕하세요, {studentName}님
            </h1>
            <p className="text-base text-gray-500 mt-1">
              기숙사 관리 시스템 ZUDO입니다
            </p>
          </div>

          {/* 방과후 수강신청 배너 (신청 기간 중에만 표시) */}
          <EnrollmentBanner />

          {/* 지각 알림 팝업 (오늘 지각 시 표시) */}
          <LateNotificationPopup />

          {/* Grid 2x3 버튼 레이아웃 */}
          <div className="grid grid-cols-2 gap-3">
            {FEATURE_CARDS.map((card) => {
              const Icon = card.icon
              return (
                <button
                  key={card.title}
                  onClick={() => handleNavigate(card.href)}
                  className="aspect-[4/3] bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 p-4 active:scale-[0.98] transition-transform"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.iconClass}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-base font-bold text-gray-900">{card.title}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 하단 고정 로그아웃 버튼 */}
      <div className="shrink-0 px-4 py-3 pb-safe bg-gray-50">
        <button
          onClick={handleLogout}
          disabled={signOut.isPending}
          className="w-full py-3 text-red-500 font-medium flex items-center justify-center gap-2 hover:text-red-600 transition-colors disabled:opacity-50"
        >
          <LogOut className="w-5 h-5" />
          {signOut.isPending ? '로그아웃 중...' : '로그아웃'}
        </button>
      </div>
    </div>
  )
}

// demo design B
