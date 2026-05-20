import { MobileSubPageLayout } from '@/components/mobile/MobileSubPageLayout'
import { EntryRequestView } from '@/components/mobile/entry/EntryRequestView'

export default function EntryPage() {
  return (
    <MobileSubPageLayout title="조기입실 신청" accentColor="violet-500">
      <EntryRequestView />
    </MobileSubPageLayout>
  )
}
