# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고할 가이드를 제공한다.

## 개발 명령어

- `npm run dev` — Next.js 개발 서버 실행 (http://localhost:3000)
- `npm run build` — 프로덕션 빌드
- `npm run start` — 빌드 결과물 서빙
- `npm run lint` — ESLint 실행 (`eslint.config.mjs` 플랫 설정, `eslint-config-next`의 core-web-vitals + typescript 규칙 확장)

테스트 러너는 설정되어 있지 않다. 포맷팅 규칙은 `.prettierrc`를 따른다 (semi, double quote, printWidth 100, trailingComma es5).

## 필수 환경 변수

`.env.local`(gitignore 대상)에 저장한다. 누락 시 Contentful 호출과 좋아요 기능이 런타임에 실패한다.

- `CONTENTFUL_SPACE_ID`, `CONTENTFUL_DELIVERY_TOKEN`, `CONTENTFUL_PREVIEW_TOKEN`, `CONTENTFUL_ENVIRONMENT`(기본값 `master`), `CONTENTFUL_PREVIEW_ENABLED`(`"true"`이면 Preview API 사용)
- `KV_REST_API_URL`, `KV_REST_API_TOKEN` (또는 동일한 `UPSTASH_REDIS_REST_*`) — 좋아요 카운터를 저장하는 Vercel KV / Upstash Redis
- `NEXT_PUBLIC_GA_ID` — 선택. 비어 있으면 Google Analytics 스크립트가 주입되지 않는다.

## 아키텍처

Next.js 16 App Router + React 19 + Tailwind v4 기반 한국어 개인 기술 블로그(Vercel 배포). 콘텐츠는 요청 시점에 Contentful에서 가져오고, 홈(`app/page.tsx`)과 글 상세(`app/posts/[slug]/page.tsx`)에서 `export const revalidate = 60`으로 ISR 캐싱한다.

### 콘텐츠 계층 (`lib/contentful/`)

모든 Contentful 접근은 `lib/contentful/fetchers.ts`를 거친다. Contentful 클라이언트는 모듈 스코프에서 lazy 메모이즈(`cachedClient`)되며, `CONTENTFUL_PREVIEW_ENABLED` 값에 따라 Delivery API와 Preview API를 전환한다. locale은 `ko-KR`로 고정.

fetcher는 예외를 던지지 않고 디스크리미네이티드 유니온 `FetchResult<T> = { success: true; data: T } | { success: false; error }`를 반환한다. **호출 측은 반드시 `.success`를 확인한 뒤 `.data`에 접근해야 한다.** 패턴 예시는 `app/page.tsx`와 `app/posts/[slug]/page.tsx` 참고 — 실패 시 `<Error />`, 정상 응답이지만 결과가 비어 있으면 `notFound()`.

`lib/contentful/types.ts`의 `PostSkeleton`이 `post` 콘텐츠 타입의 단일 진실 공급원이다. `category` 필드는 문자열 배열이며, `getCategories()`가 별도 콘텐츠 타입 없이 최대 1000개 글을 페이지네이션하면서 카운트를 집계해 카테고리 목록을 만든다. `"All"`은 전체 글 수를 가진 합성 카테고리.

### 좋아요 (`app/api/likes/[slug]/route.ts`)

글별 좋아요 카운트는 Vercel KV의 `likes:<slug>` 키에 저장한다. `GET`은 조회, `POST`는 증가, `DELETE`는 감소(0에서 클램프). 변경 요청마다 `(slug, client-ip)` 단위 레이트 리밋(1분 10회)을 `ratelimit:<slug>:<ip>` 키로 적용하며, TTL은 첫 증가에만 설정한다. `LikeButton` (`components/post/LikeButton.tsx`)은 optimistic UI 방식 — 먼저 state와 `localStorage`의 `liked:<slug>`를 갱신한 뒤 서버 응답으로 동기화하고, 실패 시 롤백한다.

`vercel.json`에 등록된 주간 cron(`/api/cron/keep-alive`)은 `system:last_ping`을 갱신해 Upstash 무료 플랜이 비활성으로 인해 일시 중지되지 않도록 한다.

### 마크다운 파이프라인 (`components/post/PostBody.tsx`)

`react-markdown` 플러그인 순서: `remarkGfm` → `rehypeRaw` → `rehypeSanitize`(커스텀 `detailsSchema`로 `<details>`/`<summary>` 허용) → `rehypeSlug` → `rehypeAutolinkHeadings`(`#` 앵커에 `heading-anchor` 클래스 부여) → `rehypeHighlight`. `rehypeRaw`가 sanitize보다 먼저 돌기 때문에 **새로운 raw HTML 태그를 지원하려면 `detailsSchema.tagNames` / `.attributes`에 추가해야 한다.** 그렇지 않으면 sanitize 단계에서 제거된다.

`<pre>`는 `PreWithCopy`로 교체되어, `CODE_LANG_LABEL_MAP`에 정의된 언어 배지와 복사 버튼(`useClipboard` 훅 + clipboard.js 래퍼)을 렌더링한다. `TableOfContents`는 마운트 후 `#post-article` 내부 헤딩을 읽어 `IntersectionObserver`로 활성 섹션을 추적하며, `rehypeSlug`가 부여한 id에 의존한다. 헤딩 텍스트를 추출할 때 autolink가 붙인 `#` 텍스트는 제거된다.

### SEO / 피드

- `app/sitemap.ts`와 `app/rss/route.ts`는 모두 `getPosts({ category: "All" })`을 호출하고, 실패 시 graceful degrade(사이트맵은 루트만, RSS는 503 스텁 피드).
- `next.config.ts`는 `/rss.xml` → `/rss` 영구 리다이렉트와 `images.ctfassets.net`을 `next/image` 화이트리스트에 등록한다.
- `app/robots.ts`는 `sitemap.xml`과 `rss.xml`을 함께 노출한다.

### 기타 컨벤션

- 경로 별칭 `@/*`는 저장소 루트로 매핑된다 (`tsconfig.json`).
- 클라이언트 컴포넌트는 명시적으로 `"use client"`를 선언하고, 데이터 fetch는 서버 컴포넌트에서 수행해 props로 전달한다.
- 주석과 사용자 노출 문구는 한국어, 식별자·구조는 영어로 작성한다. 수정 시 주변 스타일에 맞춘다.
- 댓글은 `utterances`(GitHub repo `sangyeon217/tech-blog`, `issue-term`은 `pathname`)로 연동되며, 테마는 `prefers-color-scheme`을 따라 동적으로 전환된다.
