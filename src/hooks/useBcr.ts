'use client'

import { mockBcrRecords } from '@/lib/mock-data'

export function useMyBcrHistory() {
  return {
    data: mockBcrRecords,
    isLoading: false,
    isError: false,
    error: null,
  }
}

export function useBcrImageUrl(imagePath: string | null) {
  return {
    data: imagePath ? `/placeholder-bcr-photo.jpg` : null,
    isLoading: false,
    isError: false,
    error: null,
  }
}

export function useBcrChecklistItems(bcrId: string | null) {
  const record = mockBcrRecords.find((r) => r.id === bcrId)
  return {
    data: record?.checklist_failures?.map((f, i) => ({
      id: `checklist-${i}`,
      bcr_id: bcrId,
      item_label: f.item,
      note: f.note,
      is_failed: true,
    })) ?? [],
    isLoading: false,
    isError: false,
    error: null,
  }
}
