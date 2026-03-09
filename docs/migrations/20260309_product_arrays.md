# 제품 리뷰 필드 배열 변환 — DB 스키마 변경

## posts 테이블

```sql
ALTER TABLE posts
  ALTER COLUMN product_name TYPE text[] USING NULL,
  ALTER COLUMN purchase_source TYPE text[] USING NULL,
  ALTER COLUMN purchase_link TYPE text[] USING NULL,
  ALTER COLUMN price TYPE text[] USING NULL;
```

## post_translations 테이블

```sql
ALTER TABLE post_translations
  ALTER COLUMN product_name TYPE text[] USING NULL,
  ALTER COLUMN purchase_source TYPE text[] USING NULL;

ALTER TABLE post_translations
  ADD COLUMN IF NOT EXISTS prices text[] DEFAULT NULL;
```
