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
# 한국어 (기본 — locale prefix 없음)
/delicious/                        # 카테고리 인덱스
/delicious/korean/                 # 서브카테고리 인덱스
/delicious/korean/{slug}           # 포스트 상세

# 다국어 (/{locale}/ prefix)
/en/delicious/                     # 영어 카테고리 인덱스
/en/delicious/korean/              # 영어 서브카테고리 인덱스
/en/delicious/korean/{slug}        # 영어 포스트 상세
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

### 다국어 조건부 처리 (`is_multilingual`)

포스트별로 다국어 콘텐츠 제공 여부를 `is_multilingual` 필드로 제어한다.

**`is_multilingual === false`인 포스트**:

- 다국어 경로(`/{locale}/{category}/{sub_category}/{slug}/`) 미생성 — 한국어 경로만 존재
- hreflang 태그 미출력 (포스트 상세 페이지에서만 적용. 리스트/인덱스 페이지의 hreflang은 항상 유지)
- 다국어 리스트 페이지(`/{locale}/{category}/` 등)에서 카드 미노출 — 피드, 검색 데이터에서도 제외
- 다국어 피드 JSON(`/api/feed/{locale}/...`)에서 제외
- 다국어 검색 페이지(`/{locale}/search/`)의 검색 데이터에서 제외
- AI 번역(GPT-4o) 호출 스킵 — `post_translations` 레코드 미생성

**다국어 미지원 포스트 접근 시 fallback**:

- LanguageSelector에서 언어를 전환하면 locale별 fallback 페이지로 이동
- Fallback 페이지는 "해당 글은 다국어를 지원하지 않습니다." 메시지를 해당 locale로 표시

**리스트/인덱스 페이지**:

- 홈, 카테고리, 서브카테고리 인덱스의 다국어 경로는 `is_multilingual`과 무관하게 항상 생성
- 해당 페이지의 hreflang도 항상 출력

## Search Page SEO

- `<meta name="robots" content="noindex, follow">` — 검색 결과 페이지는 인덱싱하지 않음
- Canonical: `?q=` 파라미터 없이 `/search/` (또는 `/{locale}/search/`)만 지정
- 검색 결과는 클라이언트 JS로 렌더링되므로 크롤러가 결과를 수집하지 않음

## URL Structure

```
# 한국어 (기본)
/                                  # 메인 (Hub)
/{category}/                       # 카테고리 인덱스
/{category}/{sub_category}/        # 서브카테고리 인덱스
/{category}/{sub_category}/{slug}  # 포스트 상세
/search/                           # 검색 (noindex)

# 다국어
/{locale}/                                        # 메인 (Hub)
/{locale}/{category}/                              # 카테고리 인덱스
/{locale}/{category}/{sub_category}/               # 서브카테고리 인덱스
/{locale}/{category}/{sub_category}/{slug}         # 포스트 상세
/{locale}/search/                                  # 검색 (noindex)
```
