-- Migration: price/price_prefix 컬럼 타입 변경 및 분리
-- Date: 2026-03-09
--
-- 변경 내용:
--   posts.price: text[] | null → integer[] | null
--     이유: 제품별 가격을 숫자 배열로 관리. product_name 배열과 동일 인덱스로 매핑.
--   posts.price_prefix: text | null → text[] | null
--     이유: 제품별 가격 설명을 배열로 관리 (visit: [단일 설명], product-review: 제품별 설명 배열).
--
--   post_translations.price_prefix: text | null → text[] | null
--     이유: 번역된 가격 설명 배열 저장.
--   post_translations.prices 컬럼 제거
--     이유: 가격은 정수(integer)이므로 번역 불필요.

-- 1. posts.price 타입 변경 (text[] → integer[])
--    기존 text[] 데이터를 integer[]로 변환
ALTER TABLE posts
  ALTER COLUMN price TYPE integer[]
  USING (
    CASE
      WHEN price IS NOT NULL THEN
        ARRAY(SELECT unnest(price)::integer)
      ELSE NULL
    END
  );

-- 2. posts.price_prefix 타입 변경 (text → text[])
--    기존 단일 문자열을 단일 요소 배열로 마이그레이션
ALTER TABLE posts
  ALTER COLUMN price_prefix TYPE text[]
  USING (
    CASE
      WHEN price_prefix IS NOT NULL THEN ARRAY[price_prefix]
      ELSE NULL
    END
  );

-- 3. post_translations.price_prefix 타입 변경 (text → text[])
ALTER TABLE post_translations
  ALTER COLUMN price_prefix TYPE text[]
  USING (
    CASE
      WHEN price_prefix IS NOT NULL THEN ARRAY[price_prefix]
      ELSE NULL
    END
  );

-- 4. post_translations.prices 컬럼 제거 (가격은 정수, 번역 불필요)
ALTER TABLE post_translations
  DROP COLUMN IF EXISTS prices;
