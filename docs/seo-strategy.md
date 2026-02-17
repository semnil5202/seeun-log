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

## URL Structure

```
/                           # 메인 (Hub)
/delicious/                 # 맛집 카테고리
/delicious/korean/          # 맛집 > 한식
/delicious/korean/{slug}    # 개별 포스트
/cafe/                      # 카페 카테고리
/travel/                    # 여행 카테고리
```
