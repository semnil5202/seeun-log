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
- DB: Supabase PostgreSQL, single `posts` table
- AI: OpenAI GPT-4o for multilingual translation
- Deploy: GitHub Actions -> Astro SSG build -> AWS S3 + CloudFront
- Shared packages: tsconfig, eslint-config (future: types, ui, config)

### Current Status (as of 2026-02-17)
- Phase: Initial setup + documentation complete, NO business logic implemented yet
- Scaffolding done: monorepo, apps, shared packages, docs
- Missing: Supabase connection, editor, blog viewer, auth, CI/CD, Tailwind, translation storage schema

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

### Open Design Questions
- Translation data storage structure not yet defined in DB schema
- No tags/keywords table defined (but "Popular Tags" mentioned in UI specs)
