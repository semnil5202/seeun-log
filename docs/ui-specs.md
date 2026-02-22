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
|   한식 / 양식 / ...   |  [Infinite Scroll: 스크롤 시 추가 로드]        |                       |
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
- Main: Card 형태 피드, 무한스크롤 (SSG 첫 페이지 + Static JSON fetch)
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
   [Sponsored Ad 1]  ← index 1
   [Post Card 2]
   [Sponsored Ad 2]  ← index 3
   [Post Card 3]
   [Post Card 4]
   ...
   ```

   - SSG 빌드 시 index 1, 3에 광고 삽입
   - CSS `lg:hidden` / `hidden lg:block`으로 visibility 토글 (별도 HTML 구조 금지)

3. **피드 로딩**: 무한스크롤 (SSG 첫 페이지 + Static JSON fetch로 추가 로드)

4. **Footer (SEO Enhanced)**: Left Sidebar 대체 — 전체 서브카테고리 텍스트 링크 필수

---

## Component Specifications

### `PostCard.astro`

- Thumbnail: 첫 번째 카드는 LCP Priority, 나머지는 Lazy Load
- Content: Category Badge, Title (`<h2>`), Description (line-clamp 2줄)
- Ad Variation: PostCard와 유사하되 "Sponsored" 라벨/배경으로 구분

### `MobileHeader.astro`

```css
.scroll-container {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  mask-image: linear-gradient(to right, black 85%, transparent 100%);
}
```

### Header Search Button

- PC/Mobile 공통: 검색 버튼은 `/search/` 페이지로 이동하는 `<a>` 링크
- JavaScript 없음 — 슬라이딩 애니메이션, JS ID 등 미사용
- PC/Mobile 헤더 모두 순수 HTML/CSS로 동작

---

## Search Page

**라우팅**: `/search/` (한국어), `/{locale}/search/` (다국어)

**레이아웃**: ListLayout (3-Column — LeftSidebar + Main + RightSidebar)

### 구성 요소

1. **검색 입력**: 돋보기 아이콘(좌측) + `<input type="search">`. Enter(form submit)로 검색 실행, 실시간 필터링 아님.
2. **추천 키워드**: place_name + 카테고리 라벨을 빌드 타임에 추출. 클릭 가능한 chip 형태.
3. **검색 결과**: 결과 건수 표시 + PostCard 리스트. In-feed Adsense를 result index 1, 5에 삽입.
4. **결과 없음**: 아이콘 + 안내 메시지 + 힌트 텍스트
5. **URL**: `history.replaceState`로 `?q=` 파라미터 반영 (페이지 새로고침 없음)

### 데이터 전략

- 빌드 타임에 전체 포스트를 JSON으로 직렬화하여 `<script type="application/json">`에 삽입
- 클라이언트 JS가 title, description, place_name 기준으로 필터링

---

## Responsive Strategy

| 요소          | PC (`lg:` 이상)   | Mobile (`lg:` 미만)  |
| ------------- | ----------------- | -------------------- |
| Left Sidebar  | `hidden lg:block` | 숨김 (Footer로 대체) |
| Right Sidebar | `hidden lg:block` | In-Feed Ad로 전환    |
| Header Nav    | 텍스트 메뉴       | Snap Scroll          |
| Ad 배치       | Right Sidebar     | In-Feed (index 1, 3) |
| Footer Links  | 기본              | Full Sitemap (SEO)   |
