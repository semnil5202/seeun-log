# Fullstack Engineer Agent Memory

## Project: 은민로그 (eunminlog)

Couple's blog platform. Monorepo: pnpm workspaces + Turbo.

- `apps/admin` — Next.js 15, App Router, CSR, HTTPS dev at local-admin.eunminlog.site:4322
- `apps/client` — Astro 5 SSG, Tailwind CSS, React islands only for interactivity
- DB: Supabase PostgreSQL (mock data 기반 개발)

## Key Architecture Patterns

- **Rendering**: Astro client is SSG-only. All content rendered at build time from Supabase.
- **No infinite scroll** anywhere — strictly forbidden per ui-specs.md.
- **Responsive toggle**: `hidden lg:block` / `block lg:hidden` CSS-only. Never two separate HTML structures.
- **Mobile In-Feed Ads**: index 1 and 3 in feed, `block lg:hidden` only.
- **@/ path alias** maps to `./src/*` in both apps.
- **Admin Feature pattern**: Feature → Container → Component. containers/ = hooks + children composition, components/ = pure UI (props → JSX).
- **Layout chain (client)**: `PostLayout.astro` → `Layout.astro` → `BaseHead.astro` → `Hreflang.astro`
- **Header chain (client)**: `Layout.astro` → `Header.astro` → `PCHeader.astro`/`MobileHeader.astro` → `LanguageSelector.astro`

## Component Conventions (apps/client)

- PostCard, SponsoredCard, PostCardGrid in `src/components/post/`
- Pagination, Breadcrumb in `src/components/navigation/`
- Always use `<article>` for post cards, `<nav aria-label="...">` for navigation.
- First card in feed: `loading="eager"` + `fetchpriority="high"` (LCP). Rest: `loading="lazy"`.
- Images: always explicit `width="640" height="360"`, `aspect-video` container for CLS prevention.
- Title in `<h2>`, description with `line-clamp-2`.

## i18n Patterns

- Default locale: `ko` (no prefix). Others: `/en/`, `/ja/`, `/zh-CN/`, `/zh-TW/`, `/id/`, `/vi/`, `/th/`
- `is_multilingual: boolean` on Post type controls multilingual behavior
- `is_multilingual: false` → no locale paths, no hreflang tags, excluded from multilingual feeds/search
- Korean (ko) paths always generated regardless of `is_multilingual`
- LanguageSelector: `isMultilingual=false` → non-ko buttons are `disabled` (CSS opacity + cursor-not-allowed) with CSS-only tooltip
- Locale category/sub-category paths not generated if no multilingual posts exist (filtered in getStaticPaths)
- PCHeader/MobileHeader/CategoryTree filter categories by `getMultilingualCategories()` when `locale !== 'ko'`

### i18n Helpers

- `getLocalePath(path, locale)` — prepends locale prefix for non-Korean. Korean = no prefix.
- `getCategoryLabel(category, locale)` — localized category name.
- `getSubCategoryLabel(subCategory, locale)` — localized sub-category name.
- `t(key, locale)` — UI string lookup with Korean fallback.

## Types

Type files live at `src/shared/types/` in both apps. Always import via `@/shared/types/`.

- `Post` from `@/shared/types/post` — includes `is_sponsored`, `is_recommended`, `rating`, `category`, `sub_category`, `slug`, `thumbnail`.
- `LocalizedPost` from `@/shared/types/post` — extends Post with `locale` field.
- `BreadcrumbItem` from `@/shared/types/seo` — `{ name: string; url: string }`.
- `Locale` from `@/shared/types/common` — 8 locales, default `"ko"`.
- `CategorySlug` — `"delicious" | "cafe" | "travel"`. From `@/shared/types/category`.
- Files inside `src/shared/types/` themselves use relative imports (`'./category'`, `'./common'`) — NOT `@/` aliases.

## URL Structure

```
/{category}/{sub_category}/{slug}/   # Korean (no prefix)
/{locale}/{category}/{sub_category}/{slug}/  # Other locales
```

Always trailing slash.

## SEO Rules

- Canonical tags, Open Graph, hreflang on every page.
- JSON-LD: `BreadcrumbList` on all pages, `BlogPosting` + `Review` on detail pages.
- Semantic HTML: `<article>`, `<nav>`, `<main>`, `<section>`.
- Breadcrumb: `<ol>` with `itemscope/itemtype="Schema.org/BreadcrumbList"` + microdata attrs.
- Pagination: `rel="prev"` / `rel="next"` on anchor tags.

## Astro Gotchas

- JSX comments `{/* */}` inside ternary true/false branches are valid only as standalone expressions inside `()` or `<>`. A lone comment before a JSX element as the sole return of a ternary arm causes a parse error — remove inline comments in those positions and move them to the frontmatter.
- `class:list` utility merges conditional and static classes cleanly.
- JSON-LD injection into `<head>`: Layout.astro has `<slot name="head" />` inside `<head>`. ListLayout forwards it via `<slot name="head" slot="head" />`. Pages use `<BreadcrumbJsonLd slot="head" ... />` or `<Fragment slot="head">...</Fragment>`.

## Data Layer (apps/client)

- `src/features/post-feed/mock/posts.ts` — `MOCK_POSTS: Post[]`, 12 posts across all categories
- `src/lib/mock/translations.ts` — `MOCK_TRANSLATIONS: PostTranslation[]`
- `src/lib/api/posts.ts` — all async query functions (getAllPosts, getPostsByCategory, etc.). Default perPage=9.
- `src/lib/api/translations.ts` — getTranslation, getTranslationsForPost, getLocalizedPost
- All API functions are async even in mock mode for drop-in Supabase migration
- Sort: newest-first `created_at DESC` throughout
- Multilingual-aware functions: `getMultilingualPosts`, `getPaginatedMultilingualPosts`, etc.
- `getMultilingualCategories()` → CategorySlug[] with ≥1 multilingual post

## Layout Shell (apps/client) — BUILT

- `src/layouts/ListLayout.astro` — list page entry: Layout > ThreeColumnLayout > slot
- `src/layouts/Layout.astro` — HTML shell: BaseHead + Header + slot + Footer. Has `<slot name="head" />` inside `<head>` for JSON-LD injection.
- `src/layouts/PostLayout.astro` — post detail layout: Layout (single-column, no sidebars).
- PC language dropdown: `<details>`/`<summary>` — zero JS, keyboard accessible
- LeftSidebar: `sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto` for independent scrolling

## Pages & Routing (apps/client) — BUILT

All 7 page files + PostLayout built. 137+ pages generated at build time.

## Build Command

```bash
pnpm --filter @eunminlog/client build
```

## Comment Policy

- No `// PERF:`, `// SEO:`, `// COST:` tags in code
- Pages: 1-line JSDoc at file top only
- Components: 1-2 line JSDoc describing what it does
