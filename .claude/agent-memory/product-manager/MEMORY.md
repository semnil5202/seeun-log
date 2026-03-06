# Product Manager Agent Memory

## Project Context

- **Project**: eunminlog (couple blog platform)
- **Key docs**: `docs/admin-specs.md`, `docs/architecture.md`, `docs/database.md`, `docs/ui-specs.md`, `docs/seo-strategy.md`, `docs/theme.md`, `docs/ga4-tracking.md`, `docs/ci-cd.md`, `docs/TODO.md`

## User Decisions (confirmed)

- Admin auth: Supabase Auth email/password (no social login, no signup flow, 1-2 users)
- Editor: Tiptap (HTML output, not Markdown)
- CSR-first: Server Action only for presigned URL, Supabase writes, GitHub token, GPT API calls
- GPT-5 Nano translation+summary+term extraction: Server Action calls (not CSR). `OPENAI_API_KEY` server-only env. `shared/lib/openai.ts` shared client. temperature not supported (default 1). `response_format: { type: 'json_object' }`. 7 locales parallel via `Promise.allSettled`. Partial failure allowed (`TranslationResult.failed?: boolean`). `retrySingleLocale` for individual locale retry.
- Media gallery: Tiptap manages image insert/delete/order, Client renders consecutive images as CSS snap gallery (B approach)
- Vercel Hobby plan is sufficient for admin
- Content format: HTML (Tiptap) -- database.md already updated to "HTML"
- Admin route structure: flat (no route groups), sidebar globally applied
- No Co-Authored-By in commits
- shadcn/ui for admin UI components (Radix UI + Tailwind)

## Architecture Notes

- Admin: Next.js 15, App Router, React 19, HTTPS dev at local-admin.eunminlog.site:4322 (mkcert)
- Admin UI: shadcn/ui components at src/components/ui/, shared components at src/shared/
- Admin layout: SidebarLayout (client component) wraps all pages, AppSidebar with 5 nav groups
- Client: Astro 5 SSG (already implemented), HTTPS dev at local-client.eunminlog.site:4321 (mkcert + Vite)
- Both apps: `pnpm setup:local` (root) runs setup scripts for both
- DB: Supabase PostgreSQL (posts + post_translations tables)
- Media: S3 `media-eunminlog` bucket, CloudFront `media.eunminlog.site`
- CI/CD: GitHub Actions workflow_dispatch for build trigger
- Global UI pattern: Layout.astro contains 1x Toast + 1x ImageLightbox (shared/components/ui/)

## Admin Phase Status (as of 2026-03-06)

- Phase 1 completed: Supabase client, types, HTTPS dev server (--experimental-https), sidebar, metrics page (mock, RHF), SearchFilter (RHF register props), shadcn components, ESLint config
- Phase 3 (major progress): Tiptap editor + form type + meta form + translation integration
  - Form type: `PostFormType = 'visit' | 'product-review'` -- UI-only concept (not stored in DB)
  - Layout order: 폼형식 -> 썸네일 -> 본문(title+editor) -> 카테고리 -> [visit전용필드] -> 3줄요약 -> 액션버튼
  - New components: CategorySelector, ThumbnailUpload (WebP convert), VisitFields (place/address/price)
  - 3줄 요약: generateSummary Server Action (GPT-5 Nano API 연동 완료), textarea + AI button
  - Toolbar now includes TextAlign (Left/Center/Right/Justify) + 13 SVG icons
  - Translation: extractFlaggedTerms + translatePost + retrySingleLocale Server Actions, TranslationSheetContainer (0.8s auto-close), TranslationPreviewSheet (8 locale filter tabs, default en, failed locale retry button)
  - GPT-5 Nano API fully integrated (mock removed): summary, term extraction, translation all use real API
  - Translation performance: 7 locales parallel via Promise.allSettled, partial failure allowed, description included in translation, address locale-specific formatting
  - Failure fallback: toast.error on summary/extraction/translation failure, "번역본 재생성하기" button text change on extraction failure, per-locale retry in preview sheet
  - Form validation: react-hook-form + Zod (mode: 'onSubmit'). Buttons always enabled, click triggers Zod validation -> focus + error message. Korean error messages in Zod schema.
  - Label style: all labels `text-base font-bold` black + required `*` primary-600
  - Loading spinners: LoaderIcon animate-spin on summary/translation buttons
  - Translation UX: "용어 검토 계속하기" button for sheet re-open. "번역본 생성하기" always enabled (no description.trim() disabled), validates via Zod on click
- Post list page (`/posts`): SearchFilter (RHF) + table (title/published/modified) + sort dropdown (newest published/newest modified) + "새 글 작성" button. Sidebar routing updated: "게시글 작성/수정/삭제" -> `/posts`
- Image insert: CustomResizableImage (DOM NodeView, 4-corner resize handles, width % storage), UploadImage toolbar (blob URL temp)
- Tiptap HTML output uses inline styles -- critical Client impact: `insertInArticleAds()` needs `<h2>` regex migration
- Price field: price_prefix (text, optional) + price (number, required for visit). Display: "${prefix}${price.toLocaleString()}원"
- Admin toast: sonner library (`<Toaster position="top-right" richColors />` in layout.tsx)
- Admin button: cursor-pointer default, search button variant="outline"
- Remaining: S3 upload, save action, edit page, delete, Placeholder ext, toggles (sponsored/recommended/multilingual), rating, slug auto-gen, translation DB save
- Pending DB migrations: posts (price_prefix, price ADD + price_min, price_max DROP), post_translations (place_name, address ADD)
- Phase 5-1 planned: SearchFilter compound component refactoring (DateRange + Query sub-components) + Pagination shared component (max 9 pages, ellipsis group navigation, URL page query)
- Phase 5-2 planned: Category management page (`/categories`) -- group table (category/sub rows), SearchFilter.Query only, mock data, pageSize 100 (no pagination)
- Phase 5-3 planned: Apply Pagination to `/posts` + `/` pages (pageSize 10)
- admin-specs.md Section 4-7: category-management feature spec (CM-1~CM-4), Section 5-4: SearchFilter compound pattern, Section 5-5: Pagination spec

## Client PlaceInfoCard Changes (2026-03-05)

- rating prop removed, replaced with description prop (3줄 요약)
- StarRating.astro no longer imported (file kept for future use, still used in schema.ts JSON-LD)
- description displayed as `\n`-split `⋅` bullet list with `post.summary` i18n label (8 locales)
- border-radius removed, dt width w-20 (80px)
- copy buttons use `data-copy` + `data-toast` pattern (Toast.astro event delegation)
- Toast.astro: duration 4s, whitespace-pre-line for multiline messages
- Translation key: `place.copyToast` (NOT `place.copyOriginal` -- specs updated 2026-03-05)
- NearbyPostList: `nearbyLabel` prop removed
- Sponsor page: "협찬 리뷰" -> "제품 리뷰" naming in content.ts

## Feature Specs Created

- `docs/place-i18n-specs.md` — place_name/address i18n (2026-03-05, updated 2026-03-05): DB schema change (post_translations add place_name, address nullable), LocalizedPost type adds translated_place_name/translated_address (separate from original), PlaceInfoCard shows translation + copies Korean original, Toast on non-ko copy, JSON-LD keeps Korean original, PlaceInfoCard field labels i18n'd (place.category/name/address/price/copyToast keys), search/feed data use translated place_name. Place i18n Client-side implementation completed (all TODO items checked except DB ALTER and Admin GPT-5 Nano pipeline).
- `docs/api-specs.md` — Admin API specs (also updated GPT-4o -> GPT-5 Nano)
- `docs/gpt-prompts.md` — GPT prompt design doc (summary generation, term extraction, post translation)
- `docs/cookie-consent-specs.md` — Cookie Consent + AdSense NPA 연동 (2026-03-06): CONSENT_REQUIRED_LOCALES=[en,ja,zh-CN,th], Sticky Footer Banner, NPA/PA 동적 전환, GA4 cookie_consent 이벤트, features/consent/ 구조

## Documentation Patterns

- All docs in Korean with English technical terms
- docs/TODO.md: checklist format with Phase sections (completed/remaining), cross-references to spec docs
- Feature specs use table-based requirement IDs (AUTH-1, PE-1, MEDIA-1 etc.)
- Server Action vs CSR distinction table in each feature section
- admin-specs.md Section 10: implementation order table with status column
