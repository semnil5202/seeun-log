# UI/UX Layout Specifications

## Brand

- **Project Name**: SEEUN-LOG
- **Brand Name**: 세은로그 (seeun log)
- **Language**: 한국어 기본, 다국어 지원 (GPT-4o 번역): en, ja, zh-CN, zh-TW, id, vi, th

### Color System

- **Primary**: Sage Green (`primary-50` ~ `primary-900`, base `#A6BAA1`)
- **Logo**: `primary-600` (`#6F8B68`), hover `primary-700`
- **추천 UI**: Primary 계열
- **별점**: Yellow (범용 컨벤션)

테마 토큰 정의: `packages/config/theme.css` | 상세 가이드: [`docs/theme.md`](theme.md)

## Categories

```
맛집 (delicious)
  ├── 한식
  ├── 양식
  ├── 일식
  └── 주점
카페 (cafe)
  ├── 핫플
  └── 카공
여행 (travel)
  ├── 국내
  ├── 해외
  └── 숙소
```

---

## PC Layout (Breakpoint: `lg` 이상)

**3-Column Layout**

```
[Header: Sticky Top]
+-----------------------------------------------------------------------------------------------+
|  [Logo: 세은로그]        맛집  |  카페  |  여행               [🌐 Language]  [🔍 Search]       |
+-----------------------------------------------------------------------------------------------+

[Body: 3-Column]
+-----------------------+-----------------------------------------------+-----------------------+
| [Left Sidebar: LNB]  | [Main Content: Feed List]                     | [Right Sidebar]       |
| (Fixed / Scrollable)  |                                               | (Sticky on Scroll)    |
|                       |  [Post Card 1] (LCP Priority Thumbnail)       |                       |
| 📂 Category Tree     |  [Post Card 2] (Lazy Load)                    |  📌 협찬 & Pick       |
| (모두 펼침)           |  [Post Card 3]                                |  [Sponsored Ad 1]     |
|                       |  ...                                          |  [Editor's Pick 1]    |
| ▾ 맛집               |                                               |                       |
|   한식 / 양식 / ...   |  [Pagination: Static JSON 페이지 자동 로드]    |                       |
| ▾ 카페               |                                               |                       |
|   핫플 / 카공         |                                               |                       |
| ▾ 여행               |                                               |                       |
|   국내 / 해외 / 숙소  |                                               |                       |
+-----------------------+-----------------------------------------------+-----------------------+

[Footer]
+-----------------------------------------------------------------------------------------------+
| Copyright © seeun log | Privacy Policy | Sitemap | Instagram                                  |
+-----------------------------------------------------------------------------------------------+
```

### PC 핵심 규칙

- Left Sidebar: Category Tree 항상 전체 펼침
- Main: Card 형태 피드, IntersectionObserver 페이지네이션 (SSG 첫 페이지 + Static JSON fetch로 추가 로드)
- Right Sidebar: 협찬/광고 + Editor's Pick

---

## Mobile Layout (Breakpoint: `lg` 미만)

```
[Header: Sticky Top]
+-------------------------------------------------------+
| [Logo] |  맛집  카페  여행  (Snap Scroll →) | [🌐] [🔍] |
+-------------------------------------------------------+
```

### Mobile 핵심 규칙

1. **Header Navigation**
   - `scroll-snap-type: x mandatory` 수평 스크롤
   - 우측 끝 fade-out (`mask-image`) 처리로 스크롤 힌트
   - **햄버거 메뉴 금지, Drawer Sidebar 금지**

2. **In-Feed Ad Pattern** (엄격한 순서)

   ```
   [Post Card 1]
   [In-feed Adsense 1]  ← index 1
   [Post Card 2]
   [Post Card 3]
   [Post Card 4]
   [Post Card 5]
   [In-feed Adsense 2]  ← index 5
   [Post Card 6]
   ...
   ```

   - SSG 빌드 시 index 1, 5에 광고 삽입 (추가 페이지 로드 시에도 동일 패턴)
   - CSS `lg:hidden` / `hidden lg:block`으로 visibility 토글 (별도 HTML 구조 금지)

3. **피드 로딩**: IntersectionObserver 페이지네이션 (SSG 첫 페이지 + Static JSON fetch로 추가 로드)

4. **Footer (SEO Enhanced)**: Left Sidebar 대체 — 전체 서브카테고리 텍스트 링크 필수

---

## Component Specifications

### Shared Components

#### `PostCard.astro`

- **위치**: `features/post-feed/components/PostCard.astro`
- Thumbnail: 첫 번째 카드는 LCP Priority, 나머지는 Lazy Load
- Content: Category Badge, Title (`<h2>`), Description (line-clamp 2줄)
- Ad Variation: PostCard와 유사하되 "Sponsored" 라벨/배경으로 구분

#### `PostCardGrid.astro`

- **위치**: `features/post-feed/components/PostCardGrid.astro`
- PostCard 목록을 그리드 형태로 렌더링 + InFeedAdsense를 index 1, 5에 자동 삽입
- IntersectionObserver 페이지네이션 지원

#### `MobileHeader.astro`

- **위치**: `shared/components/layout/MobileHeader.astro`
- LanguageSelector + getActiveSegments 사용으로 중복 로직 제거

```css
.scroll-container {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  mask-image: linear-gradient(to right, black 85%, transparent 100%);
}
```

#### `PCHeader.astro`

- **위치**: `shared/components/layout/PCHeader.astro`
- LanguageSelector(`showLabel: true`) + getActiveSegments 사용으로 중복 로직 제거

#### `LanguageSelector.astro`

- **위치**: `shared/components/navigation/LanguageSelector.astro`
- `<details>/<summary>` 기반 언어 선택 드롭다운. PC/Mobile 헤더에서 공유.
- Props: `locale`, `path`, `showLabel?` (true이면 현재 locale 텍스트 + 화살표 아이콘 표시)
- JavaScript 없음 -- 순수 HTML/CSS `<details>` 토글

#### `SubCategoryTabs.astro`

- **위치**: `shared/components/navigation/SubCategoryTabs.astro`
- **모바일 전용** (`block lg:hidden`) -- PC에서는 LeftSidebar가 서브카테고리 역할을 담당
- 카테고리/서브카테고리 인덱스 페이지 상단에 수평 서브카테고리 탭을 표시
- MobileHeader와 동일한 UI 패턴: 텍스트 링크 + `|` 구분선 + `mask-image` 우측 페이드 아웃
- Active 서브카테고리는 `text-primary-600`으로 하이라이트, 나머지는 `text-gray-700`
- 적용 페이지: `[category]/index`, `[category]/[sub_category]/index`, `[locale]/[category]/index`, `[locale]/[category]/[sub_category]/index`

```css
.sub-category-tabs {
  overflow-x: auto;
  mask-image: linear-gradient(to right, black calc(100% - 24px), transparent);
}
```

#### `CategoryTree.astro`

- **위치**: `shared/components/navigation/CategoryTree.astro`
- getActiveSegments 사용으로 활성 카테고리/서브카테고리 감지 로직 중복 제거

#### Header Search Button

- PC/Mobile 공통: 검색 버튼은 `/search/` 페이지로 이동하는 `<a>` 링크
- JavaScript 없음 -- 슬라이딩 애니메이션, JS ID 등 미사용
- PC/Mobile 헤더 모두 순수 HTML/CSS로 동작

#### `ThreeColumnLayout.astro`

- **위치**: `shared/components/layout/ThreeColumnLayout.astro`
- 3-column 그리드: 모바일 1컬럼, PC `[180px][1fr][300px]`
- Main 영역 패딩: 모바일 `pt-3 pb-6`, PC `py-6`
- 최대 너비: `max-w-screen-xl`, 수평 패딩: `px-4 lg:px-6`

#### `StarRating.astro`

- **위치**: `shared/components/ui/StarRating.astro`
- Props: `rating` (number)
- SVG 별 아이콘 5개 (filled + empty), 숫자 점수 표시
- Schema.org `Rating` 마이크로데이터 (`itemprop="reviewRating"`) 포함

#### `SponsoredPostItem.astro`

- **위치**: `shared/components/layout/SponsoredPostItem.astro`
- Props: `post` (LocalizedPost), `currentSlug?`, `locale`
- 현재 글과 slug 일치 시 `border-l-primary-500` active 스타일 적용
- 썸네일(80x80) + 제목(truncate) + 설명(line-clamp-2) 레이아웃

### Feature Components: Post Detail (`features/post-detail/`)

#### `PlaceInfoCard.astro`

- **위치**: `features/post-detail/components/PlaceInfoCard.astro`
- Props: `categoryLabel`, `subCategoryLabel`, `placeName`, `address?`, `priceLevel?`, `rating?`, `locale`
- Schema.org `LocalBusiness` 마이크로데이터 포함
- StarRating 컴포넌트를 내부에서 사용
- `<dl>` 기반 키-값 레이아웃: 카테고리, 장소, 주소, 가격대, 평점

#### `NearbyPostList.astro`

- **위치**: `features/post-detail/components/NearbyPostList.astro`
- Props: `posts`, `currentSlug`, `categoryLabel`, `subCategoryLabel`, `nearbyLabel`, `moreLabel`, `subCategoryHref`, `locale`
- 같은 서브카테고리의 인근 포스트를 썸네일 + 제목 + 설명 리스트로 표시
- 현재 포스트는 `border-l-primary-500` + `aria-current="page"`로 구분

#### `PostBadges.astro`

- **위치**: `features/post-detail/components/PostBadges.astro`
- Props: `isSponsored`, `isRecommended`, `label`
- 협찬/추천 SponsoredBadge를 조건부 렌더링

### Feature Components: Search (`features/search/`)

#### `SearchUI.astro`

- **위치**: `features/search/components/SearchUI.astro`
- Props: `searchData`, `suggestedKeywords`, `placeholderText`, `noResultsText`, `noResultsHintText`, `resultsText`, `suggestedText`, `sponsoredLabel`
- 검색 폼, 추천 키워드 chip, 결과 리스트, 빈 결과 UI, 클라이언트 검색 스크립트를 하나의 컴포넌트로 통합
- `<script type="application/json">` 으로 검색 데이터 인라인 삽입
- 클라이언트 JS가 PostCard DOM을 동적 생성 + In-feed Adsense를 index 1, 5에 삽입

### Shared Utilities

#### `formatDate(dateStr, locale)`

- **위치**: `shared/lib/date.ts`
- ISO 8601 날짜 문자열을 locale별 포맷(`year: numeric, month: long, day: numeric`)으로 변환
- 5곳의 중복 날짜 포맷 로직을 단일 함수로 통합

#### `getActiveSegments(pathname, locale)`

- **위치**: `shared/lib/navigation.ts`
- URL pathname에서 현재 활성 카테고리(`CategorySlug | null`)와 서브카테고리(`string | null`)를 추출
- PCHeader, MobileHeader, CategoryTree 3곳의 중복 로직을 단일 함수로 통합

#### `insertInArticleAds(markdown)`

- **위치**: `features/post-detail/lib/ads.ts`
- Markdown 본문의 H2(`## `) 섹션 경계에 In-Article 광고 HTML을 삽입
- 2번째 섹션 앞 + 마지막 섹션 앞에 각 1개씩 삽입, 섹션 2개 이하시 미삽입

#### `buildBlogPostingSchema(post, canonical)` / `buildReviewSchema(post)`

- **위치**: `features/post-detail/lib/schema.ts`
- JSON-LD 스키마 객체 생성 유틸리티. PostLayout에서 인라인으로 작성하던 로직을 분리.

#### `buildSearchData(posts, locale)`

- **위치**: `features/search/api/search-data.ts`
- LocalizedPost 배열을 검색용 JSON(`SearchItem[]`)과 추천 키워드(`string[]`)로 변환
- 검색 페이지의 데이터 준비 로직을 단일 함수로 통합

---

## AdSense Specifications

| 배치 | 사이즈 (Mobile) | 사이즈 (PC) | 위치 | 컴포넌트 |
| --- | --- | --- | --- | --- |
| PostLayout Fixed Adsense | 300x50 | 468x60 (중앙 정렬) | 게시글 상세 본문 상단 | `FixedAdsense variant="post-top"` |
| RightSidebar Fixed Adsense | -- | 300x250 | PC 우측 사이드바 상단 (sticky) | `FixedAdsense variant="sidebar"` |
| In-Article Adsense | fluid (h-300px) | fluid (h-300px) | 게시글 본문 중간 (## 헤딩 앞에 삽입) | `insertInArticleAds()` |
| In-feed Adsense | fluid (h-250px) | fluid (h-250px) | 카드 피드 index 1, 5 / 검색 결과 index 1, 5 | `InFeedAdsense` |

### AdSense 컴포넌트

#### `FixedAdsense.astro`

- **위치**: `shared/components/ad/FixedAdsense.astro`
- Props: `variant` (`'post-top'` | `'sidebar'`)
- `post-top`: 모바일 300x50, PC 468x60 (반응형 전환)
- `sidebar`: 300x250 (PC 전용)

#### `InFeedAdsense.astro`

- **위치**: `shared/components/ad/InFeedAdsense.astro`
- Props: `class?` (높이, grid span 등 오버라이드용)
- 기본 높이 h-250px, `role="complementary"` 접근성 속성

### In-Article Adsense 삽입 규칙

- Markdown `## ` 헤딩 기준으로 섹션 분할
- 2번째 섹션 앞과 마지막 섹션 앞에 각각 1개씩 삽입
- 섹션이 2개 이하인 경우 삽입하지 않음
- 삽입 로직: `features/post-detail/lib/ads.ts` -- `insertInArticleAds()`

---

## Search Page

**라우팅**: `/search/` (한국어), `/{locale}/search/` (다국어)

**레이아웃**: ListLayout (3-Column -- LeftSidebar + Main + RightSidebar)

**구현 컴포넌트**: `SearchUI.astro` (features/search/components/) + `buildSearchData()` (features/search/api/)

### 구성 요소

1. **검색 입력**: 돋보기 아이콘(좌측) + `<input type="search">`. Enter(form submit)로 검색 실행, 실시간 필터링 아님.
2. **추천 키워드**: place_name + 카테고리 라벨을 빌드 타임에 추출. 클릭 가능한 chip 형태.
3. **검색 결과**: 결과 건수 표시 + PostCard 리스트. In-feed Adsense를 result index 1, 5에 삽입.
4. **결과 없음**: 아이콘 + 안내 메시지 + 힌트 텍스트
5. **URL**: `history.replaceState`로 `?q=` 파라미터 반영 (페이지 새로고침 없음)

### 데이터 전략

- `buildSearchData(posts, locale)`가 빌드 타임에 전체 포스트를 `SearchItem[]`과 추천 키워드로 변환
- `SearchUI.astro`가 JSON을 `<script type="application/json">`에 인라인 삽입
- 클라이언트 JS가 title, description, place_name 기준으로 필터링

---

## Responsive Strategy

| 요소          | PC (`lg:` 이상)   | Mobile (`lg:` 미만)  |
| ------------- | ----------------- | -------------------- |
| Left Sidebar  | `hidden lg:block` | 숨김 (Footer로 대체) |
| Right Sidebar | `hidden lg:block` | In-Feed Ad로 전환    |
| Header Nav    | 텍스트 메뉴       | Snap Scroll          |
| Ad 배치       | Right Sidebar     | In-Feed (index 1, 5) |
| Footer Links  | 기본              | Full Sitemap (SEO)   |
