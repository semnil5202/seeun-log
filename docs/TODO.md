# TODO

## Media

- [ ] 이미지 여러 개일 때 가로 스크롤 (이미지 갤러리/캐러셀)
- [ ] 이미지 클릭 시 확대 (Lightbox)
- [ ] 동영상 mp4 최적화 재생
- [ ] 이미지 최적화 — srcset/`<picture>`, Astro `<Image>` 컴포넌트 검토
- [ ] Google Embed Map 적용 (장소 정보 카드 연동)

## Ads

- [ ] 애드센스 광고 호출 스크립트 추가 (플레이스홀더 → 실제 광고 코드 교체)

## Analytics (GA4)

- [ ] `shared/lib/analytics/gtag.ts` — gtag 타입 래퍼 생성 (스펙: [`docs/ga4-tracking.md`](ga4-tracking.md))
- [ ] `window.gtag` 타입 선언 추가 (`env.d.ts`)
- [ ] Enhanced Page View — `Layout.astro`에 `gaPageParams` prop 추가 + 각 페이지에서 전달
- [ ] Post Card Click — `PostCard.astro`, `SponsoredCard.astro`에 data 속성 + 이벤트 위임
- [ ] AdSense Tracking — 광고 컴포넌트 data 속성 + IntersectionObserver impression/view/click
- [ ] 무한스크롤 동적 카드/광고 트래킹 연동
- [ ] GA4 관리 콘솔 커스텀 디멘션 등록 (14개)
