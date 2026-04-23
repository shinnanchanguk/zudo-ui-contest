import type { Metadata } from 'next'
import {
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  Sparkles,
  Code,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { fetchSubmissions, type Submission } from './_lib/github'

export const revalidate = 300

export const metadata: Metadata = {
  title: '제출작 갤러리 — Zudo UI 디자인 공모전',
  description:
    '학생들이 디자인한 Zudo UI 작품을 한곳에서 모아 보고 직접 체험해보세요.',
}

export default async function GalleryPage() {
  const submissions = await fetchSubmissions()

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-indigo-500 font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Zudo UI 디자인 공모전
          </div>
          <div className="mt-1 flex items-end justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                제출작 갤러리
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                <span className="font-semibold text-indigo-600">체험하기</span>{' '}
                버튼을 누르면 해당 디자인을 직접 사용해볼 수 있어요.
              </p>
            </div>
            <a
              href="https://github.com/shinnanchanguk/zudo-ui-contest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
            >
              <Code className="w-4 h-4" />
              레포 보기
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {submissions.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="text-xs text-slate-500 mb-4">
              총 <span className="font-semibold text-slate-900">{submissions.length}</span>개의 제출작 ·{' '}
              <span className="font-semibold text-indigo-600">👍 많은 순</span>으로 정렬됨
            </div>
            <Grid items={submissions} />
          </>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-xs text-slate-500 text-center">
          데이터는 5분마다 자동 갱신됩니다. 새 PR이 안 보이면 잠시 후 새로고침해 주세요.
        </div>
      </footer>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
      <div className="text-5xl mb-4">🎨</div>
      <h2 className="text-lg font-semibold text-slate-700">
        아직 제출작이 없어요
      </h2>
      <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
        첫 번째 제출자가 되어보세요.{' '}
        <a
          href="https://github.com/shinnanchanguk/zudo-ui-contest"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 underline"
        >
          GitHub에서 Fork
        </a>
        하고 PR을 올리면 약 1~2분 안에 여기에 자동으로 표시됩니다.
      </p>
    </div>
  )
}

function Grid({ items }: { items: Submission[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((s) => (
        <SubmissionCard key={s.number} submission={s} />
      ))}
    </div>
  )
}

function SubmissionCard({ submission: s }: { submission: Submission }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border border-slate-200">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-slate-900 leading-snug line-clamp-2 flex-1 min-w-0">
            {s.title}
          </h3>
          <Badge variant="secondary" className="shrink-0 gap-1 tabular-nums">
            <ThumbsUp className="w-3 h-3" /> {s.reactions}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          {s.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s.avatarUrl}
              alt=""
              className="w-6 h-6 rounded-full"
              loading="lazy"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-200" />
          )}
          <span className="truncate">@{s.author}</span>
        </div>

        <div className="flex flex-col gap-2">
          {s.previewUrl ? (
            <Button asChild className="w-full">
              <a
                href={s.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4" />
                체험하기
              </a>
            </Button>
          ) : (
            <Button disabled className="w-full" variant="secondary">
              미리보기 준비중…
            </Button>
          )}
          <Button asChild variant="outline" className="w-full">
            <a href={s.prUrl} target="_blank" rel="noopener noreferrer">
              <MessageSquare className="w-4 h-4" />
              PR 보기 (#{s.number})
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
