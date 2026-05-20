import { MobileSubPageLayout } from '@/components/mobile/MobileSubPageLayout'
import { ExtendedStudyRequestView } from '@/components/mobile/extended-study/ExtendedStudyRequestView'

export default function ExtendedStudyPage() {
  return (
    <MobileSubPageLayout title="연장학습 신청" accentColor="purple-500">
      <ExtendedStudyRequestView />
    </MobileSubPageLayout>
  )
}
