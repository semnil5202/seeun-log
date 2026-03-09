-- Migration: price 컬럼 타입 변경 및 price_prefix 컬럼 유지
-- Date: 2026-03-09
--
-- 변경 내용:
--   posts.price: integer | null → text[] | null
--     이유: 제품별 가격을 배열로 관리. "10,000원", "무료", "$50" 등 자유 형식 지원.
--     product_name, purchase_source, purchase_link 배열과 동일 인덱스로 매핑.
--   posts.price_prefix: 유지 (visit 폼의 장소 가격대 설명에 계속 사용)
--
--   post_translations.prices: text[] | null 컬럼 추가
--     이유: 번역된 제품별 가격 저장 (예: "10,000원" → "10,000 KRW")
--   post_translations.price_prefix: 유지

-- 1. posts.price 타입 변경 (integer → text[])
--    기존 데이터는 단일 정수값이므로 배열로 감싸서 마이그레이션
ALTER TABLE posts
  ALTER COLUMN price TYPE text[]
  USING CASE
    WHEN price IS NOT NULL THEN ARRAY[price::text]
    ELSE NULL
  END;

-- 2. post_translations에 prices 컬럼 추가
ALTER TABLE post_translations
  ADD COLUMN IF NOT EXISTS prices text[] DEFAULT NULL;
