'use client'

import { motion } from 'framer-motion'

export function SkeletonFrame() {
  return (
    <div className="flex flex-col gap-6 p-5">
      {/* Centered Logo Skeleton */}
      <div className="flex items-center justify-center">
        <div className="w-24 h-10 bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse" />
      </div>
      
      {/* Centered Greetings Skeleton */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-56 h-9 bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse" />
        <div className="w-48 h-5 bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse" />
      </div>

      {/* Recommendation Capsules Skeleton */}
      <div className="flex gap-3 overflow-hidden">
        <div className="w-28 h-12 bg-gray-200 dark:bg-white/5 rounded-full shrink-0 animate-pulse" />
        <div className="w-36 h-12 bg-gray-200 dark:bg-white/5 rounded-full shrink-0 animate-pulse" />
        <div className="w-24 h-12 bg-gray-200 dark:bg-white/5 rounded-full shrink-0 animate-pulse" />
      </div>

      {/* Banner Skeletons */}
      <div className="space-y-3">
        <div className="w-full h-20 bg-gray-200 dark:bg-white/5 rounded-[1.5rem] animate-pulse" />
        <div className="w-full h-16 bg-gray-200 dark:bg-white/5 rounded-[1.2rem] animate-pulse" />
      </div>

      {/* Feature Grid Skeleton */}
      <div className="grid grid-cols-2 gap-4 pb-20">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-[4/3] bg-white dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5 p-4 flex flex-col items-center justify-center gap-4 animate-pulse">
            <div className="w-14 h-14 bg-gray-100 dark:bg-white/5 rounded-2xl" />
            <div className="w-16 h-4 bg-gray-100 dark:bg-white/5 rounded-md" />
          </div>
        ))}
      </div>

      {/* Bottom Logout Skeleton */}
      <div className="fixed bottom-6 left-6 right-6">
        <div className="w-full h-14 bg-gray-200 dark:bg-white/5 rounded-2xl animate-pulse" />
      </div>
    </div>
  )
}
