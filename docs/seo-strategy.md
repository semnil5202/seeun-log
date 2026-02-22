# SEO & Structured Data Strategy

## Rendering Strategy

- **Client (Astro)**: SSG — 모든 콘텐츠 페이지는 빌드 타임에 정적 생성
- **Admin (Next.js)**: CSR — 크롤링 불필요, 관리자 전용. 서버 로직은 Server Action/API Route로 처리.

## Internal Linking (Silo Structure)

```
홈 → 카테고리 허브 (맛집/카페/여행) → 서브카테고리 → 개별 포스트
```

- Breadcrumb 필수 (상세 페이지)
- 카테고리 간 크로스링크 최소화 (Silo 유지)

## Schema.org (JSON-LD)

### 전체 페이지

- `BreadcrumbList`

### 상세 페이지

- `BlogPosting` + `Review` (nested)
  - `itemReviewed`: Restaurant / Place
  - `reviewRating`: 1-5 stars
  - `author`: Semin & Chaeun

## Meta Tags

- 모든 페이지: `<title>`, `<meta description>`, Open Graph (`og:title`, `og:description`, `og:image`)
- Canonical Tag 필수 (중복 URL 방지)
- Trailing slash 일관성 유지

## Mobile SEO

- Footer에 전체 서브카테고리 링크 배치 (Left Sidebar 부재 보완)
- Mobile-first indexing 대응: 모바일에서도 모든 카테고리 접근 가능

## Image Optimization

- Format: WebP/AVIF
- `srcset` + explicit `width`/`height`
- 첫 번째 PostCard thumbnail: LCP Priority (`loading="eager"`)
- 나머지: `loading="lazy"`

## i18n (다국어)

OpenAI GPT-4o로 자동 번역. 한국어가 기본 언어.

| 언어                 | locale  | routing prefix    |
| -------------------- | ------- | ----------------- |
| 한국어 (기본)        | `ko`    | `/` (prefix 없음) |
| 중국어 간체          | `zh-CN` | `/zh-CN/`         |
| 일본어               | `ja`    | `/ja/`            |
| 대만어 (중국어 번체) | `zh-TW` | `/zh-TW/`         |
| 영어                 | `en`    | `/en/`            |
| 인도네시아어         | `id`    | `/id/`            |
| 베트남어             | `vi`    | `/vi/`            |
| 태국어               | `th`    | `/th/`            |

### 다국어 URL 예시

```
/delicious/korean/{slug}           # 한국어 (기본)
/en/delicious/korean/{slug}        # 영어
/ja/delicious/korean/{slug}        # 일본어
/zh-CN/delicious/korean/{slug}     # 중국어 간체
/zh-TW/delicious/korean/{slug}     # 대만어
/id/delicious/korean/{slug}        # 인도네시아어
/vi/delicious/korean/{slug}        # 베트남어
/th/delicious/korean/{slug}        # 태국어
```

### SEO 다국어 대응

- `<link rel="alternate" hreflang="{locale}">` 태그 필수
- `<link rel="alternate" hreflang="x-default">` → 한국어 페이지
- Canonical은 각 언어 페이지 자기 자신을 가리킴

## Search Page SEO

- `<meta name="robots" content="noindex, follow">` — 검색 결과 페이지는 인덱싱하지 않음
- Canonical: `?q=` 파라미터 없이 `/search/` (또는 `/{locale}/search/`)만 지정
- 검색 결과는 클라이언트 JS로 렌더링되므로 크롤러가 결과를 수집하지 않음

## URL Structure

```
/                           # 메인 (Hub)
/delicious/                 # 맛집 카테고리
/delicious/korean/          # 맛집 > 한식
/delicious/korean/{slug}    # 개별 포스트
/cafe/                      # 카페 카테고리
/travel/                    # 여행 카테고리
/search/                    # 검색 (noindex)
/{locale}/...               # 다국어 (위 i18n 섹션 참조)
```
