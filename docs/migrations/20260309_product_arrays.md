# 제품 리뷰 price/price_prefix 분리 — DB 스키마 변경

## 변경 목적

- 제품 리뷰 폼에서 가격을 `pricePrefix` (가격 설명 텍스트) + `price` (숫자) 로 분리.
- `price_prefix`를 visit/product-review 양쪽에서 배열로 통일.

## posts 테이블

| 컬럼 | 이전 | 이후 |
|------|------|------|
| `price` | `text[] \| null` | `integer[] \| null` |
| `price_prefix` | `text \| null` | `text[] \| null` |

- `price`: 제품별 숫자 가격 배열. product-review는 제품 수만큼, visit은 `[단일값]`.
- `price_prefix`: 제품별 가격 설명 배열. product-review는 제품 수만큼, visit은 `[단일 설명]`.

## post_translations 테이블

| 컬럼 | 이전 | 이후 |
|------|------|------|
| `price_prefix` | `text \| null` | `text[] \| null` |
| `prices` | `text[] \| null` | 제거 |

- `prices` 컬럼 제거: 가격은 정수이므로 번역 불필요.
- `price_prefix`: 번역된 가격 설명 배열.

## SQL

`docs/migrations/20260309_product_arrays.sql` 참조.
