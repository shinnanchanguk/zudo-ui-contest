import { MobileSubPageLayout } from '@/components/mobile/MobileSubPageLayout'
import { MealView } from '@/components/mobile/meal/MealView'
import { fetchMealData } from '@/lib/fetchMeal'

export const revalidate = 3600 // Revalidate every hour

export default async function MealPage() {
  const data = await fetchMealData()

  return (
    <MobileSubPageLayout title="오늘의 급식" accentColor="emerald-500">
      <MealView initialData={data} />
    </MobileSubPageLayout>
  )
}
