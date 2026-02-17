# Database Schema (Supabase PostgreSQL)

## Table: `posts`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `slug` | text (unique) | URL slug |
| `title` | text | 게시글 제목 |
| `description` | text | 요약 설명 |
| `content` | text | 본문 (MDX/Markdown) |
| `category` | enum (`delicious`, `cafe`, `travel`) | 대분류 |
| `sub_category` | text | 소분류 (한식, 양식, 핫플 등) |
| `thumbnail` | text | 썸네일 이미지 URL |
| `is_sponsored` | boolean | 협찬 콘텐츠 여부 (Right Sidebar / In-Feed Ad) |
| `is_recommended` | boolean | Editor's Pick 여부 |
| `rating` | numeric (1.0 ~ 5.0) | 평점 |
| `place_name` | text | 장소명 (Schema.org `itemReviewed`) |
| `address` | text | 주소 (Schema.org) |
| `price_level` | text | 가격대 |
| `created_at` | timestamptz | 작성일 |
| `updated_at` | timestamptz | 수정일 |

## Index Recommendations

- `slug` — unique index (URL lookup)
- `category` — filter/sort 용도
- `category, sub_category` — compound index (카테고리 필터링)
- `is_sponsored` — 광고 콘텐츠 조회
- `is_recommended` — Editor's Pick 조회
- `created_at` — 최신순 정렬
