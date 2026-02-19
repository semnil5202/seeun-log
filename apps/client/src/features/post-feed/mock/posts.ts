/**
 * Mock post data for development and build-time testing.
 * Mirrors the Supabase `posts` table schema defined in docs/database.md.
 *
 * Distribution:
 *   delicious — korean(3), western(1), japanese(1), pub(1)
 *   cafe      — hotplace(2), study(1)
 *   travel    — domestic(1), overseas(1), accommodation(1)
 *
 * Switch to live data: replace MOCK_POSTS with a Supabase query in
 * src/lib/api/posts.ts — all consumer code stays unchanged.
 */

import type { Post } from '@/shared/types/post';

export const MOCK_POSTS: Post[] = [
  // ──────────────────────────────────────────────
  // DELICIOUS › KOREAN (3)
  // ──────────────────────────────────────────────
  {
    id: 'post-1',
    slug: 'gwangjang-market-bindaetteok',
    title: '광장시장 빈대떡, 70년 전통의 맛을 느끼다',
    description:
      '서울에서 가장 오래된 재래시장, 광장시장의 명물 빈대떡집. 바삭한 겉면과 촉촉한 속을 자랑하는 전통 방식 그대로를 경험해 보세요.',
    content: `## 광장시장 빈대떡

광장시장은 1905년 개설된 서울 최초의 상설 시장입니다. 그 중심에는 빈대떡 골목이 자리 잡고 있습니다.

### 메뉴 및 가격
- 녹두빈대떡 1장: 4,000원
- 육회: 15,000원
- 마약김밥: 3,000원

### 총평
70년 넘게 이어온 손맛이 고스란히 느껴집니다. 기름이 잘 빠진 바삭한 빈대떡에 동동주 한 잔이면 최고의 조합입니다.`,
    category: 'delicious',
    sub_category: 'korean',
    thumbnail: 'https://picsum.photos/seed/gwangjang-market-bindaetteok/640/360',
    is_sponsored: false,
    is_recommended: true,
    rating: 4.8,
    place_name: '광장시장 빈대떡 골목',
    address: '서울 종로구 창경궁로 88',
    price_level: '1만원 이하',
    created_at: '2025-01-15T09:00:00.000Z',
    updated_at: '2025-01-15T09:00:00.000Z',
  },
  {
    id: 'post-2',
    slug: 'jongno-samgyetang-tosokchon',
    title: '토속촌 삼계탕, 경복궁 옆 50년 보양식',
    description:
      '경복궁 서쪽 골목에 자리한 삼계탕 명가. 진한 육수와 부드러운 닭고기로 여름 보양식의 정수를 보여줍니다.',
    content: `## 토속촌 삼계탕

경복궁 서쪽 골목에서 50년 넘게 자리를 지켜온 삼계탕 전문점입니다.

### 대표 메뉴
- 삼계탕: 20,000원
- 흑삼계탕: 25,000원

### 웨이팅 팁
오전 11시 오픈 직후 또는 오후 2시 이후 방문하면 대기 시간을 줄일 수 있습니다.

### 총평
진한 닭 육수와 찹쌀, 인삼의 조화가 훌륭합니다. 외국인 관광객에게도 인기가 높습니다.`,
    category: 'delicious',
    sub_category: 'korean',
    thumbnail: 'https://picsum.photos/seed/jongno-samgyetang-tosokchon/640/360',
    is_sponsored: false,
    is_recommended: false,
    rating: 4.5,
    place_name: '토속촌',
    address: '서울 종로구 자하문로5길 5',
    price_level: '2만원대',
    created_at: '2025-02-10T10:30:00.000Z',
    updated_at: '2025-02-10T10:30:00.000Z',
  },
  {
    id: 'post-3',
    slug: 'mangwon-tteokbokki-grandma',
    title: '망원시장 할머니 떡볶이, 30년 단골 손님의 비밀 맛집',
    description:
      '망원시장 안쪽에 숨겨진 할머니 떡볶이. 달고 매운 즉석 떡볶이와 손수 만든 순대가 일품입니다.',
    content: `## 망원시장 할머니 떡볶이

망원시장 내부 좁은 골목을 헤쳐 나가면 만날 수 있는 소문난 떡볶이 가게입니다.

### 메뉴
- 떡볶이 1인분: 4,500원
- 순대: 4,000원
- 튀김 모둠: 5,000원

### 총평
MSG 없이 고추장과 설탕만으로 낸 자연스러운 단맛이 중독적입니다. 현금만 받으니 참고하세요.`,
    category: 'delicious',
    sub_category: 'korean',
    thumbnail: 'https://picsum.photos/seed/mangwon-tteokbokki-grandma/640/360',
    is_sponsored: false,
    is_recommended: false,
    rating: 4.3,
    place_name: '망원시장 할머니 떡볶이',
    address: '서울 마포구 포은로8길 19',
    price_level: '1만원 이하',
    created_at: '2025-03-05T08:00:00.000Z',
    updated_at: '2025-03-05T08:00:00.000Z',
  },

  // ──────────────────────────────────────────────
  // DELICIOUS › WESTERN (1)
  // ──────────────────────────────────────────────
  {
    id: 'post-4',
    slug: 'itaewon-brasserie-steak',
    title: '이태원 브라스리, 파리 감성이 깃든 한우 스테이크',
    description:
      '이태원 경리단길 골목의 작은 프렌치 비스트로. 한우 안심 스테이크와 부르고뉴 와인의 완벽한 조합을 선사합니다.',
    content: `## 이태원 브라스리

경리단길 언덕 위에 자리한 작은 프렌치 비스트로입니다.

### 추천 메뉴
- 한우 안심 스테이크 (200g): 68,000원
- 프렌치 어니언 수프: 18,000원
- 크림 브륄레: 14,000원

### 분위기
20석 미만의 아담한 공간으로 예약 필수입니다. 주말 저녁 테이블은 2주 전에 마감됩니다.

### 총평
1++ 한우를 미디엄 레어로 완벽하게 구워냅니다. 소믈리에 추천 와인과의 페어링을 추천합니다.`,
    category: 'delicious',
    sub_category: 'western',
    thumbnail: 'https://picsum.photos/seed/itaewon-brasserie-steak/640/360',
    is_sponsored: true,
    is_recommended: true,
    rating: 4.7,
    place_name: '브라스리 이태원',
    address: '서울 용산구 회나무로13길 12',
    price_level: '10만원 이상',
    created_at: '2025-04-20T11:00:00.000Z',
    updated_at: '2025-04-22T09:00:00.000Z',
  },

  // ──────────────────────────────────────────────
  // DELICIOUS › JAPANESE (1)
  // ──────────────────────────────────────────────
  {
    id: 'post-5',
    slug: 'hongdae-omakase-sushi-kyo',
    title: '홍대 오마카세 스시교, 가성비 넘치는 18관 코스',
    description:
      '홍대 인근에서 찾기 드문 합리적인 가격의 스시 오마카세. 당일 공수한 재료로 구성된 18관 코스를 즐겨보세요.',
    content: `## 스시교 오마카세

홍대 근처에서 6만원대에 오마카세를 즐길 수 있는 희귀한 장소입니다.

### 코스 구성
- 런치 오마카세 (18관): 65,000원
- 디너 오마카세 (22관): 95,000원

### 예약 방법
인스타그램 DM 예약 전용. 오픈 예약일에 몰리니 팔로우 필수입니다.

### 총평
제철 생선 위주의 쥬시한 샤리(밥)와 재료의 궁합이 뛰어납니다. 장어와 성게가 특히 인상적이었습니다.`,
    category: 'delicious',
    sub_category: 'japanese',
    thumbnail: 'https://picsum.photos/seed/hongdae-omakase-sushi-kyo/640/360',
    is_sponsored: false,
    is_recommended: false,
    rating: 4.6,
    place_name: '스시교',
    address: '서울 마포구 동교로23길 36',
    price_level: '6-10만원',
    created_at: '2025-05-08T12:00:00.000Z',
    updated_at: '2025-05-08T12:00:00.000Z',
  },

  // ──────────────────────────────────────────────
  // DELICIOUS › PUB (1)
  // ──────────────────────────────────────────────
  {
    id: 'post-6',
    slug: 'yeonnam-craft-beer-taproom',
    title: '연남동 크래프트 탭룸, 소규모 양조장의 신선한 생맥주',
    description:
      '연남동 골목 속 작은 탭룸. 주 1회 직접 양조한 IPA, 밀맥주, 스타우트를 탭으로 즐길 수 있는 숨겨진 맥주 명소입니다.',
    content: `## 연남동 크래프트 탭룸

일주일에 한 번 양조하는 소규모 브루어리가 직접 운영하는 탭룸입니다.

### 탭 구성 (매주 변동)
- 세션 IPA: 8,000원/473ml
- 헤페바이젠: 8,500원
- 오트밀 스타우트: 9,000원

### 안주
- 소시지 플래터: 22,000원
- 허머스 & 피타: 14,000원

### 총평
양조사가 직접 서빙하며 맥주 설명을 곁들여줍니다. 신선도가 다릅니다.`,
    category: 'delicious',
    sub_category: 'pub',
    thumbnail: 'https://picsum.photos/seed/yeonnam-craft-beer-taproom/640/360',
    is_sponsored: false,
    is_recommended: false,
    rating: 4.4,
    place_name: '연남 탭룸',
    address: '서울 마포구 연남로5길 27',
    price_level: '3-5만원',
    created_at: '2025-06-01T18:00:00.000Z',
    updated_at: '2025-06-01T18:00:00.000Z',
  },

  // ──────────────────────────────────────────────
  // CAFE › HOTPLACE (2)
  // ──────────────────────────────────────────────
  {
    id: 'post-7',
    slug: 'seongsu-roastery-wave',
    title: '성수동 웨이브 로스터리, 공장 감성과 스페셜티 커피의 만남',
    description:
      '성수동 구공장을 개조한 대형 스페셜티 카페. 직접 로스팅한 싱글 오리진 원두와 핸드드립 세트로 커피 애호가들의 성지가 되었습니다.',
    content: `## 웨이브 로스터리

성수동 공장 지대의 1,200평 규모 대형 카페로 탁 트인 공간이 특징입니다.

### 시그니처 메뉴
- 에티오피아 예가체프 핸드드립: 8,500원
- 웨이브 콜드브루 (대용량): 9,000원
- 크루아상 (버터 듬뿍): 5,500원

### 방문 팁
오전 10시~오후 1시가 가장 한산합니다. 주말은 대기 필수.

### 총평
공간 자체가 콘텐츠입니다. 높은 천장, 빈티지 로스터기, 자연광이 완벽한 사진 배경을 만들어줍니다.`,
    category: 'cafe',
    sub_category: 'hotplace',
    thumbnail: 'https://picsum.photos/seed/seongsu-roastery-wave/640/360',
    is_sponsored: true,
    is_recommended: false,
    rating: 4.5,
    place_name: '웨이브 로스터리',
    address: '서울 성동구 성수이로 78',
    price_level: '1만원 이하',
    created_at: '2025-07-10T09:30:00.000Z',
    updated_at: '2025-07-12T10:00:00.000Z',
  },
  {
    id: 'post-8',
    slug: 'bukchon-traditional-tea-hanok',
    title: '북촌 한옥 전통차, 기와지붕 아래에서 마시는 오미자차',
    description:
      '북촌 한옥마을 정중앙에 위치한 전통 찻집. 한옥 마루에 앉아 오미자차와 약과를 즐기는 경험은 서울에서 찾기 어렵습니다.',
    content: `## 북촌 한옥 전통차

100년 넘은 한옥을 개조한 전통 찻집입니다.

### 메뉴
- 오미자차: 9,000원
- 유자차: 8,500원
- 쑥차 세트 (약과 포함): 14,000원

### 예약
주말은 네이버 예약 필수. 평일 오전은 예약 없이도 입장 가능합니다.

### 총평
관광지임에도 음료 퀄리티와 공간의 완성도가 높습니다. 외국인 지인 방문 시 강력 추천하는 코스입니다.`,
    category: 'cafe',
    sub_category: 'hotplace',
    thumbnail: 'https://picsum.photos/seed/bukchon-traditional-tea-hanok/640/360',
    is_sponsored: false,
    is_recommended: true,
    rating: 4.6,
    place_name: '북촌 전통차',
    address: '서울 종로구 북촌로11길 44',
    price_level: '1만원 이하',
    created_at: '2025-08-05T11:00:00.000Z',
    updated_at: '2025-08-05T11:00:00.000Z',
  },

  // ──────────────────────────────────────────────
  // CAFE › STUDY (1)
  // ──────────────────────────────────────────────
  {
    id: 'post-9',
    slug: 'mapo-study-cafe-quiet-room',
    title: '마포 조용한 카공카페 픽미업, 콘센트와 방음이 완벽한 곳',
    description:
      '마포구 아현동의 카공 특화 카페. 개인 칸막이, 넉넉한 콘센트, 방음 부스로 집중력을 극대화해주는 작업 공간입니다.',
    content: `## 픽미업 카페

카공족을 위해 설계된 마포구의 독립 카페입니다.

### 이용 조건
- 음료 1잔 주문 시 최대 3시간 이용 가능
- 부스 예약: 1시간 1,000원 추가

### 메뉴
- 아메리카노: 4,000원
- 라떼: 5,000원

### 환경
- 1인 칸막이 좌석 18개
- 2인 창가 테이블 6개
- 콘센트 전 좌석 구비, 모니터 대여 가능

### 총평
소음이 거의 없어 시험 기간에 특히 붐빕니다. 24시간 운영이라 새벽 작업에도 유용합니다.`,
    category: 'cafe',
    sub_category: 'study',
    thumbnail: 'https://picsum.photos/seed/mapo-study-cafe-quiet-room/640/360',
    is_sponsored: false,
    is_recommended: false,
    rating: 4.2,
    place_name: '픽미업 카페',
    address: '서울 마포구 아현동 477-2',
    price_level: '5천원 이하',
    created_at: '2024-11-20T08:00:00.000Z',
    updated_at: '2024-11-20T08:00:00.000Z',
  },

  // ──────────────────────────────────────────────
  // TRAVEL › DOMESTIC (1)
  // ──────────────────────────────────────────────
  {
    id: 'post-10',
    slug: 'yeosu-night-sea-solo-trip',
    title: '여수 밤바다 1박 2일 혼행 코스, 케이블카부터 오동도까지',
    description:
      '여수 밤바다의 진짜 매력을 느끼는 1박 2일 혼행 코스. 해상 케이블카, 오동도 산책, 돌산 갓김치 맛집까지 알차게 구성했습니다.',
    content: `## 여수 1박 2일 코스

### Day 1
- 오전: 여수 해상 케이블카 (왕복 15,000원)
- 점심: 교동 시장 서대회 무침
- 오후: 오동도 수선화 산책
- 저녁: 돌산 갓김치 + 여수 밤바다 야경

### Day 2
- 오전: 향일암 해돋이 산행
- 점심: 낭만 포차 거리 새조개 샤브샤브
- 귀경: KTX 여수엑스포역

### 숙소 추천
돌산도 뷰 펜션 — 바다 전망 확보 필수. 1인 기준 7만원대.

### 총평
여수는 사계절 어느 때나 아름답지만, 수선화가 피는 1-2월이 가장 인상적입니다.`,
    category: 'travel',
    sub_category: 'domestic',
    thumbnail: 'https://picsum.photos/seed/yeosu-night-sea-solo-trip/640/360',
    is_sponsored: false,
    is_recommended: false,
    rating: 4.7,
    place_name: '여수 오동도',
    address: '전남 여수시 오동도로 222',
    price_level: '15-20만원 (1박 2일)',
    created_at: '2024-12-01T07:00:00.000Z',
    updated_at: '2024-12-02T08:00:00.000Z',
  },

  // ──────────────────────────────────────────────
  // TRAVEL › OVERSEAS (1)
  // ──────────────────────────────────────────────
  {
    id: 'post-11',
    slug: 'osaka-food-tour-dotonbori',
    title: '오사카 도톤보리 먹방 여행, 타코야키부터 쿠시카츠까지',
    description:
      '오사카 3박 4일 먹방 여행기. 도톤보리 타코야키 3대 비교, 신사이바시 쿠시카츠, 구로몬 시장 해산물까지 제대로 정리했습니다.',
    content: `## 오사카 먹방 3박 4일

### 도톤보리 타코야키 3대 비교
| 가게 | 가격 | 특징 |
|------|------|------|
| 아이즈야 | 700엔/6개 | 겉바속촉 |
| 도톤보리 쿠이다오레 | 800엔/6개 | 야채 가득 |
| 하나다코 | 600엔/6개 | 저렴하고 빠름 |

### 필수 코스
- 구로몬 시장: 아침 8시 개장, 해산물 바로 먹기
- 신사이바시 쿠시카츠 다루마: 소스 두 번 금지 룰
- 난바 야타이: 저녁 야키니쿠

### 총평
오사카는 도쿄보다 물가가 저렴하고 음식 퀄리티는 절대 뒤지지 않습니다.`,
    category: 'travel',
    sub_category: 'overseas',
    thumbnail: 'https://picsum.photos/seed/osaka-food-tour-dotonbori/640/360',
    is_sponsored: false,
    is_recommended: false,
    rating: 4.9,
    place_name: '도톤보리',
    address: '일본 오사카시 주오구 도톤보리 1-6',
    price_level: '40-60만원 (3박 4일)',
    created_at: '2025-01-05T06:00:00.000Z',
    updated_at: '2025-01-06T07:00:00.000Z',
  },

  // ──────────────────────────────────────────────
  // TRAVEL › ACCOMMODATION (1)
  // ──────────────────────────────────────────────
  {
    id: 'post-12',
    slug: 'jeju-ocean-view-pension-review',
    title: '제주 협재 오션뷰 펜션 솔직 후기, 바다가 창문이 되는 숙소',
    description:
      '협재 해수욕장 도보 3분 거리의 오션뷰 펜션. 에메랄드빛 바다를 침대에 누워 바라볼 수 있는 제주 최고의 뷰를 자랑합니다.',
    content: `## 협재 오션뷰 펜션

협재 해수욕장에서 도보 3분 거리에 위치한 4개 객실 규모의 소규모 펜션입니다.

### 객실 정보
- 오션뷰 더블: 180,000원/박
- 오션뷰 패밀리 (4인): 250,000원/박

### 포함 사항
- 조식 (직접 만든 베이글 & 과일 플레이트)
- 자전거 2대 무료 대여

### 위치 장점
- 협재 해수욕장: 도보 3분
- 한림 수목원: 차로 5분
- 애월 카페 거리: 차로 15분

### 총평
바다가 보이는 욕조에서 반신욕을 하며 석양을 감상하는 경험은 값으로 환산할 수 없습니다. 성수기 3개월 전 예약 필수.`,
    category: 'travel',
    sub_category: 'accommodation',
    thumbnail: 'https://picsum.photos/seed/jeju-ocean-view-pension-review/640/360',
    is_sponsored: false,
    is_recommended: true,
    rating: 4.8,
    place_name: '협재 오션하우스',
    address: '제주 제주시 한림읍 협재리 2387-1',
    price_level: '18-25만원/박',
    created_at: '2025-09-15T10:00:00.000Z',
    updated_at: '2025-09-16T09:00:00.000Z',
  },
];
