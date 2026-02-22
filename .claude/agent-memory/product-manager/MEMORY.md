# Product Manager Agent Memory

## Project: seeun-log (세은로그)

### Key Facts

- Couple blog platform: 맛집/카페/여행 reviews
- Monetization: Sponsored content + ad placement (SEO-driven traffic)
- Authors: Semin & Chaeun (2-person admin team)
- License: MIT, owner: 이세민

### Architecture

- Monorepo: pnpm workspaces + TurboRepo
- apps/admin: Next.js 15 (App Router, React 19) -- CSR + Server Action, port 3001
- apps/client: Astro 5 -- SSG only, port 4321
- DB: Supabase PostgreSQL, `posts` + `post_translations` tables
- AI: OpenAI GPT-4o for multilingual translation
- Deploy: GitHub Actions -> Astro SSG build -> AWS S3 + CloudFront
- Shared packages: tsconfig, eslint-config, config (future: types, ui)
- Styling: Tailwind CSS v4, shared theme via @seeun-log/config/theme.css (@theme inline)

### Current Status (as of 2026-02-22)

- Phase: Scaffolding + theme + client UI components (headers, sidebars, search page) implemented
- Implemented: monorepo, apps, shared packages, docs, Tailwind v4 theme, PC/Mobile headers, LeftSidebar, RightSidebar, search page, i18n translations, ListLayout
- Missing: Supabase connection, editor, blog viewer, auth, CI/CD

### Theme System

- Primary: Sage Green (base #A6BAA1, logo #6F8B68)
- Secondary: Soft Coral (base #D4A594, for sponsored/pick UI)
- Mapping: rose->primary, amber(sponsored)->secondary, amber(rating)->yellow, gray->gray
- Semantic tokens: primary/secondary aliases, label, line, background
- Documented in docs/theme.md

### Key Business Rules

- Categories: delicious (한식/양식/일식/주점), cafe (핫플/카공), travel (국내/해외/숙소)
- URL: /{category}/{sub_category}/{slug}
- Content types: normal, sponsored (is_sponsored), editor's pick (is_recommended)
- Strict UI rules: NO hamburger menu, NO drawer, NO infinite scroll
- PC: 3-column (left sidebar + main feed + right sidebar)
- Mobile: snap scroll header nav, in-feed ads at index 1,3, footer with full subcategory links

### Documentation

- docs/architecture.md -- system architecture, deploy flow
- docs/ui-specs.md -- PC/Mobile layout rules, component specs
- docs/database.md -- DB schema, index recommendations
- docs/seo-strategy.md -- SEO, JSON-LD, URL structure, image optimization
- docs/theme.md -- color palette, semantic tokens, usage guide

### Search Feature Decisions

- Client-side search: all posts embedded as JSON at build time, JS filters by title/description/place_name
- No server-side search, no DB queries at runtime
- Search triggered on Enter (form submit), not real-time
- URL updated via history.replaceState with ?q= param
- noindex, follow -- search results not crawled
- In-feed Adsense at result index 1 and 5
- Suggested keywords: place_name + category labels extracted at build time
- Headers (PC + Mobile): zero JavaScript, search button is simple <a> link to /search/

### Open Design Questions

- No tags/keywords table defined (but "Popular Tags" mentioned in UI specs)
- ui-specs.md PC layout diagram and rules mention "Infinite Scroll" but CLAUDE.md prohibits it -- pre-existing inconsistency, not yet resolved
