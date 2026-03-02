# TODO

## Media

- [ ] 이미지 여러 개일 때 가로 스크롤 (이미지 갤러리/캐러셀)
- [ ] 이미지 클릭 시 확대 (Lightbox)
- [ ] 동영상 mp4 최적화 재생
- [ ] 이미지 최적화 — srcset/`<picture>`, Astro `<Image>` 컴포넌트 검토
- [ ] Google Embed Map 적용 (장소 정보 카드 연동)

## Media Upload

- [ ] 미디어 업로드 및 Pre-signed URL 로직 (Node.js/TypeScript)
  - `media-eunminlog` 버킷에 이미지를 안전하게 업로드하기 위한 로직 구현
  - **Server-side (Pre-signed URL 생성)**:
    - AWS SDK(v3)를 사용하여 클라이언트가 S3에 파일을 직접 업로드할 수 있는 임시 URL 생성
    - 파일 이름 중복 방지를 위한 랜덤 스트링(UUID 등) 처리
    - 허용할 파일 형식(jpg, png, webp 등) 유효성 검사
  - **Client-side (이미지 전송)**:
    - Pre-signed URL로 파일을 `PUT` 방식으로 전송하는 업로드 컴포넌트
  - **보안 고려사항**:
    - 모든 S3 버킷은 퍼블릭 액세스 차단, CloudFront OAC를 통해서만 접근 가능
    - `ACL` 설정 무시, 오직 정책(Policy) 기반으로 동작
  - 미디어 서버(`media.eunminlog.site`)는 Root Object 미설정 — 개별 파일 경로로 직접 접근

## Ads

- [ ] 애드센스 광고 호출 스크립트 추가 (플레이스홀더 → 실제 광고 코드 교체)

## Analytics (GA4)

- [x] `shared/lib/analytics/gtag.ts` — gtag 타입 래퍼 생성 (스펙: [`docs/ga4-tracking.md`](ga4-tracking.md))
- [x] `window.gtag` 타입 선언 추가 (`env.d.ts`)
- [x] Enhanced Page View — `Layout.astro`에 `gaPageParams` prop 추가 + 각 페이지에서 전달
- [x] Post Card Click — `PostCard.astro`, `SponsoredCard.astro`에 data 속성 + 이벤트 위임
- [x] AdSense Tracking — 광고 컴포넌트 data 속성 + IntersectionObserver impression/view/click
- [x] 무한스크롤 동적 카드/광고 트래킹 연동
- [x] GA4 관리 콘솔 커스텀 디멘션 등록 (배포 후 데이터 수집 시작되면 등록)
  - 경로: GA4 관리 > 속성 설정 > 데이터 표시 > 맞춤 정의 > 맞춤 측정기준 만들기
  - | 측정기준 이름        | 범위   | 이벤트 매개변수        |
    | -------------------- | ------ | ---------------------- |
    | Page Type            | 이벤트 | `page_type`            |
    | Content Slug         | 이벤트 | `content_slug`         |
    | Content Category     | 이벤트 | `content_category`     |
    | Content Sub Category | 이벤트 | `content_sub_category` |
    | Content Locale       | 이벤트 | `content_locale`       |
    | Is Sponsored         | 이벤트 | `is_sponsored`         |
    | Search Term          | 이벤트 | `search_term`          |
    | Ad Slot              | 이벤트 | `ad_slot`              |
    | Ad Format            | 이벤트 | `ad_format`            |
    | Ad Position          | 이벤트 | `ad_position`          |
