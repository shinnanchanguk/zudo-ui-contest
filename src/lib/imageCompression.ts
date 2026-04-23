'use client'

export interface ImageCompressionOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  quality?: number
  onProgress?: (progress: number) => void
}

export async function compressImage(file: File, _options?: ImageCompressionOptions): Promise<File> {
  // Mock: return file as-is (no actual compression in contest shell)
  return file
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`
}

export function calculateCompressionRatio(originalSize: number, compressedSize: number): number {
  if (originalSize === 0) return 0
  return Math.round((1 - compressedSize / originalSize) * 100)
}
