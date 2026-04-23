export const REPO = 'shinnanchanguk/zudo-ui-contest'

export type Submission = {
  number: number
  title: string
  prUrl: string
  author: string
  avatarUrl: string
  reactions: number
  previewUrl: string | null
  createdAt: string
}

const PREVIEW_URL_PATTERN =
  /https:\/\/zudo-ui-contest-git-[a-z0-9-]+(?:-chang-uk-hongs-projects)?\.vercel\.app/i

const GH_HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
}

type GhUser = { login?: string; avatar_url?: string }
type GhIssue = {
  number: number
  title: string
  html_url: string
  comments_url: string
  created_at: string
  user?: GhUser
  reactions?: Record<string, number>
  pull_request?: unknown
}
type GhComment = { user?: GhUser; body?: string }

export async function fetchSubmissions(): Promise<Submission[]> {
  let issues: GhIssue[] = []
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/issues?state=open&per_page=100`,
      { headers: GH_HEADERS, next: { revalidate: 300 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    if (Array.isArray(data)) issues = data as GhIssue[]
  } catch {
    return []
  }

  const prs = issues.filter((i) => !!i.pull_request)

  const submissions = await Promise.all(
    prs.map(async (pr) => {
      let previewUrl: string | null = null
      try {
        const res = await fetch(pr.comments_url, {
          headers: GH_HEADERS,
          next: { revalidate: 300 },
        })
        if (res.ok) {
          const comments = (await res.json()) as GhComment[]
          if (Array.isArray(comments)) {
            const vercelComment = comments.find(
              (c) => c?.user?.login === 'vercel[bot]'
            )
            const match = vercelComment?.body?.match(PREVIEW_URL_PATTERN)
            previewUrl = match?.[0] ?? null
          }
        }
      } catch {
        previewUrl = null
      }

      return {
        number: pr.number,
        title: pr.title,
        prUrl: pr.html_url,
        author: pr.user?.login ?? 'unknown',
        avatarUrl: pr.user?.avatar_url ?? '',
        reactions: pr.reactions?.['+1'] ?? 0,
        previewUrl,
        createdAt: pr.created_at,
      }
    })
  )

  return submissions.sort(
    (a, b) =>
      b.reactions - a.reactions ||
      Date.parse(b.createdAt) - Date.parse(a.createdAt)
  )
}
