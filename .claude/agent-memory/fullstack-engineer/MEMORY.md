# Fullstack Engineer Agent Memory

## Project: 세은로그 (seeun-log)

Couple's blog platform. Monorepo: pnpm workspaces + Turbo.
- `apps/admin` — Next.js 15, App Router, CSR, port 3001
- `apps/client` — Astro 5 SSG, Tailwind CSS, React islands only for interactivity

## Key Architecture Patterns

- **Rendering**: Astro client is SSG-only. All content rendered at build time from Supabase.
- **No infinite scroll** anywhere — strictly forbidden per ui-specs.md.
- **Responsive toggle**: `hidden lg:block` / `block lg:hidden` CSS-only. Never two separate HTML structures.
- **Mobile In-Feed Ads**: index 1 and 3 in feed, `block lg:hidden` only.
- **@/ path alias** maps to `./src/*` in client app.

## Component Conventions (apps/client)

- PostCard, SponsoredCard, PostCardGrid in `src/components/post/`
- Pagination, Breadcrumb in `src/components/navigation/`
- Always use `<article>` for post cards, `<nav aria-label="...">` for navigation.
- First card in feed: `loading="eager"` + `fetchpriority="high"` (LCP). Rest: `loading="lazy"`.
- Images: always explicit `width="640" height="360"`, `aspect-video` container for CLS prevention.
- Title in `<h2>`, description with `line-clamp-2`.

## i18n Helpers (apps/client)

- `getLocalePath(path, locale)` — prepends locale prefix for non-Korean. Korean = no prefix.
- `getCategoryLabel(category, locale)` — localized category name.
- `getSubCategoryLabel(subCategory, locale)` — localized sub-category name.
- `t(key, locale)` — UI string lookup with Korean fallback.

## Types

- `Post` from `@/types/post` — includes `is_sponsored`, `is_recommended`, `rating`, `category`, `sub_category`, `slug`, `thumbnail`.
- `LocalizedPost` from `@/types/post` (NOT `@/types/common`) — extends Post with `locale` field.
- `BreadcrumbItem` from `@/types/seo` — `{ name: string; url: string }`.
- `Locale` from `@/types/common` — 8 locales, default `"ko"`.
- `CategorySlug` — `"delicious" | "cafe" | "travel"`.

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

- `src/lib/mock/posts.ts` — `MOCK_POSTS: Post[]`, 12 posts across all categories
- `src/lib/mock/translations.ts` — `MOCK_TRANSLATIONS: PostTranslation[]`, 3 entries (post-1/en, post-11/en, post-11/ja)
- `src/lib/api/posts.ts` — all async query functions (getAllPosts, getPostsByCategory, etc.). Default perPage=9.
- `src/lib/api/translations.ts` — getTranslation, getTranslationsForPost, getLocalizedPost
- All API functions are async even in mock mode for drop-in Supabase migration
- Sort: newest-first `created_at DESC` throughout
- `getLocalizedPost` fallback: no translation → original Korean content + requested locale tag

## Supabase Index Notes (docs/database.md)

- slug: unique index
- category, (category, sub_category): compound index
- is_sponsored, is_recommended: single-column boolean indexes
- created_at: sort index
- post_translations(post_id, locale): unique compound index

## Layout Shell (apps/client) — BUILT

Key files and their relationships:
- `src/layouts/ListLayout.astro` — list page entry: Layout > ThreeColumnLayout > slot
- `src/layouts/Layout.astro` — HTML shell: BaseHead + Header + slot + Footer. Has `<slot name="head" />` inside `<head>` for JSON-LD injection.
- `src/layouts/PostLayout.astro` — post detail layout: Layout (single-column, no sidebars). Props: post, locale, breadcrumbs, canonical, path.
- `src/components/layout/Header.astro` — sticky wrapper: `hidden lg:block` PCHeader + `block lg:hidden` MobileHeader
- `src/components/layout/PCHeader.astro` — desktop: logo + category nav + `<details>` language dropdown + search
- `src/components/layout/MobileHeader.astro` — mobile: logo + snap-scroll nav pills + lang/search icons
- `src/components/layout/LeftSidebar.astro` — PC only `hidden lg:block`; sticky CategoryTree
- `src/components/layout/RightSidebar.astro` — PC only `hidden lg:block`; props: sponsoredPosts + recommendedPosts
- `src/components/layout/ThreeColumnLayout.astro` — grid `grid-cols-1 lg:grid-cols-[240px_1fr_280px]`
- `src/components/layout/Footer.astro` — copyright always; mobile CategoryTree sitemap `block lg:hidden`
- `src/components/navigation/CategoryTree.astro` — shared; LeftSidebar (PC LNB) + Footer (mobile SEO)

## Pages & Routing (apps/client) — BUILT

All 7 page files + PostLayout built. 137 pages generated at build time.
- `src/pages/index.astro` — Korean home (/)
- `src/pages/[locale]/index.astro` — i18n home (/{locale}/)
- `src/pages/[category]/index.astro` — Korean category (/{category}/)
- `src/pages/[category]/[sub_category]/index.astro` — Korean subcategory
- `src/pages/[category]/[sub_category]/[slug].astro` — Korean post detail
- `src/pages/[locale]/[category]/index.astro` — i18n category
- `src/pages/[locale]/[category]/[sub_category]/[slug].astro` — i18n post detail

Key page patterns:
- `canonical` = full locale-aware path (e.g. `/en/delicious/`)
- `path` = locale-agnostic path (e.g. `/delicious/`) — used by BaseHead > Hreflang for all locale variants
- Korean cast Post→LocalizedPost: `{ ...post, locale: "ko" }` (no translation fetch needed)
- Parallel fetch: `await Promise.all([getPaginatedPosts(1), getSponsoredPosts(), getRecommendedPosts()])`
- BreadcrumbJsonLd injection: `<BreadcrumbJsonLd slot="head" items={breadcrumbItems} />`
- PostLayout uses `<Fragment slot="head">` to inject both BreadcrumbJsonLd + BlogPostingJsonLd

Key layout patterns:
- PC language dropdown: `<details>`/`<summary>` — zero JS, keyboard accessible
- LeftSidebar: `sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto` for independent scrolling
- Both PCHeader + MobileHeader always in DOM; CSS-only toggles — crawlers see both

See `docs/ui-specs.md`, `docs/seo-strategy.md`, `docs/database.md`, `docs/architecture.md` for full specs.
