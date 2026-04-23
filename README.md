# Zudo UI Design Contest

Zudo 학생 앱의 새로운 디자인을 만들어보세요!

이 프로젝트는 Zudo 학생 모바일 화면의 UI 껍데기입니다. 데이터베이스나 서버 연결 없이 모든 화면이 mock 데이터로 동작합니다.

## 참여 방법

1. 이 레포를 **Fork**
2. `npm install` 후 `npm run dev`로 로컬에서 확인
3. 자유롭게 디자인 수정 (색상, 레이아웃, 애니메이션, 컴포넌트 등)
4. 변경사항을 **커밋 & Push**
5. 이 레포에 **PR 생성** (제목: `[디자인] 이름 - 컨셉명`)
6. PR을 올리면 자동으로 체험 링크가 생성됩니다!

## 로컬 실행

```bash
npm install
npm run dev
```

http://localhost:3000/m 에서 확인

## 화면 구성 (12개)

| 경로 | 화면 | 설명 |
|------|------|------|
| `/m` | 홈 대시보드 | 메인 허브, 기능 카드 그리드 |
| `/m/qr` | QR 코드 | 학생 QR 코드 표시 |
| `/m/entry` | 조기입실 신청 | 조기입실 요청 |
| `/m/extended-study` | 연장학습 신청 | 연장학습 신청/취소 |
| `/m/overnight` | 외박 신청 | 날짜/사유 선택 후 외박 신청 |
| `/m/messages` | 메시지 | 채널별 채팅 |
| `/m/safety-report` | 안전 제보 | 시설 문제 제보 |
| `/m/bcr-history` | BCR 확인 | 호실 청결 점검 기록 |
| `/m/pills` | 알약 | 상/벌점 기록 |
| `/m/afterschool` | 방과후 | 방과후 프로그램 목록/신청 |

## 규칙

- 12개 화면 구조는 유지해주세요
- mock 데이터 구조(`src/lib/mock-data.ts`)는 변경하지 마세요
- 디자인(색상, 레이아웃, 글꼴, 애니메이션, 아이콘 등)은 자유롭게!
- 새로운 UI 컴포넌트 추가 가능
- 외부 라이브러리 추가 가능 (단, 빌드가 성공해야 함)

## 기술 스택

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS 4**
- **Radix UI** (shadcn/ui 스타일 컴포넌트)
- **Lucide Icons**
- **Framer Motion** (애니메이션)

## 프로젝트 구조

```
src/
  app/m/              # 모바일 12개 화면 (페이지)
  components/
    ui/               # 기본 UI 컴포넌트 (Button, Card, Dialog 등)
    mobile/           # 모바일 전용 컴포넌트
  hooks/              # Mock 데이터 훅 (정적 데이터 반환)
  lib/
    mock-data.ts      # Mock 데이터 (한국어)
    utils.ts          # 유틸리티 함수
    kst.ts            # 한국 시간 유틸리티
  app/globals.css     # 글로벌 스타일 + CSS 변수
```

## 디자인 팁

- `src/app/globals.css`의 CSS 변수를 수정하면 전체 색상 테마를 바꿀 수 있어요
- `src/components/ui/`의 컴포넌트를 수정하면 모든 화면에 반영됩니다
- Tailwind CSS 클래스를 자유롭게 활용하세요
- `framer-motion`으로 애니메이션을 추가해보세요

## 빌드 확인

PR을 올리기 전에 빌드가 성공하는지 확인하세요:

```bash
npm run build
```

빌드가 실패하면 PR의 프리뷰가 생성되지 않습니다.

<!-- vercel preview test, will be removed -->
