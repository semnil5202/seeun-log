# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**세은로그 (seeun log)** — 커플 블로그 플랫폼. 맛집, 카페, 여행 콘텐츠 중심. SEO 최적화와 협찬/광고 수익화가 핵심 목표.

- **apps/admin** — Next.js 15 (React 19, App Router, port 3001). 글 작성/편집, 빌드 트리거 담당. CSR 기반, 서버 로직은 Server Action/API Route로만 처리.
- **apps/client** — Astro 5 (SSG). 공개 블로그 뷰어. React는 interactive island에만 사용.
- **packages/tsconfig** — 공유 TypeScript 설정 (base, nextjs, astro)
- **packages/eslint-config** — 공유 ESLint 설정

향후 추가 예정: `packages/types` (공유 TS 인터페이스), `packages/ui` (공유 React 컴포넌트), `packages/config` (공유 Tailwind 설정)

## Commands

```bash
pnpm dev                           # 전체 dev 서버 기동
pnpm build                         # 전체 빌드 (topological)
pnpm lint                          # 전체 린트
pnpm format                        # Prettier 포맷팅
pnpm format:check                  # 포맷 검사
pnpm --filter @seeun-log/admin dev # admin만 실행
pnpm --filter @seeun-log/client dev # client만 실행
```

## Architecture

- **Monorepo**: pnpm workspaces + Turbo. pnpm@10.6.2+, Node.js >=24 필요.
- **배포 파이프라인**: Admin에서 글 저장 → GitHub Actions 트리거 → Astro SSG 빌드 → AWS S3 + CloudFront 배포
- **DB**: Supabase PostgreSQL. Astro는 빌드 타임에 DB에서 Fetch.
- **AI 번역**: OpenAI GPT-4o로 다국어 번역 처리
- **TypeScript**: Strict mode. ES2022, bundler resolution. Path alias `@/*` → `./src/*` (admin).
- **ESLint**: Flat config (v9). `_` prefix 변수 unused 허용.
- **Styling**: Tailwind CSS utility classes.

상세 아키텍처: [`docs/architecture.md`](docs/architecture.md)

## Business Rules

### Categories

- **맛집** (delicious): 한식, 양식, 일식, 주점
- **카페** (cafe): 핫플, 카공
- **여행** (travel): 국내, 해외, 숙소

### URL Structure

```
/{category}/{sub_category}/{slug}
```

예: `/delicious/korean/gangnam-pasta`

### 콘텐츠 타입

- 일반 포스트, 협찬 포스트 (`is_sponsored`), Editor's Pick (`is_recommended`)
- 한국어 기본, GPT-4o 자동 번역: en, ja, zh-CN, zh-TW, id, vi, th

## UI/UX Constraints (엄격 적용)

- **PC (lg 이상)**: 3-Column — Left Sidebar (카테고리 트리 전체 펼침) / Main (카드 피드) / Right Sidebar (협찬, Pick)
- **Mobile (lg 미만)**: Header에 수평 snap scroll 네비게이션. In-Feed Ad는 index 1, 3에 삽입.
- **금지 사항**: 햄버거 메뉴, Drawer Sidebar, 무한 스크롤
- **반응형 전환**: `hidden lg:block` / `block lg:hidden`으로 CSS 토글. 별도 HTML 구조 금지.
- **Mobile Footer**: Left Sidebar 대체 — 전체 서브카테고리 링크 필수 (SEO)

상세 UI 스펙: [`docs/ui-specs.md`](docs/ui-specs.md)

## SEO Rules

- Astro client는 **SSG 전용**. 모든 콘텐츠는 빌드 타임에 정적 생성.
- Semantic HTML 필수 (`<article>`, `<nav>`, `<main>`).
- JSON-LD: 전체 페이지 `BreadcrumbList`, 상세 페이지 `BlogPosting` + `Review`.
- Canonical tag, Open Graph, trailing slash 일관성 필수.
- 이미지: WebP/AVIF, srcset, 명시적 width/height. 첫 번째 카드 LCP priority.
- `client:load` 최소화 — 네비게이션, 광고 토글은 CSS로 처리.

상세 SEO 전략: [`docs/seo-strategy.md`](docs/seo-strategy.md)

## Database

Supabase PostgreSQL `posts` 테이블 — slug(unique), category(enum), sub_category, is_sponsored, is_recommended, rating, place_name, address 등.

상세 스키마: [`docs/database.md`](docs/database.md)

## Documentation Structure

```
docs/
├── architecture.md   # 시스템 아키텍처, 배포 플로우, 외부 서비스
├── ui-specs.md       # PC/Mobile 레이아웃 규칙, 컴포넌트 스펙, 반응형 전략
├── database.md       # DB 스키마, 인덱스 권장사항
└── seo-strategy.md   # SEO, JSON-LD, URL 구조, 이미지 최적화
```

Sub-agent 작업 시 반드시 관련 docs 파일을 참조할 것. 코드 변경이 docs와 불일치하면 quality-reviewer가 REJECT.

## Comment Policy

코드 주석은 최소한으로 유지한다. 자명한 코드에 주석을 달지 않는다.

### 허용 기준

- **페이지/컨테이너 (pages/, layouts/)**: 파일 상단 JSDoc 1줄 — 기능 + URL 패턴만 기술.
  ```
  /** 한국어 카테고리 인덱스 (/{category}/) */
  ```
- **공통 컴포넌트 (components/)**: 파일 상단 JSDoc 1-2줄 — 컴포넌트가 하는 일만 기술.
  ```
  /** 반응형 헤더. PC는 PCHeader, Mobile은 MobileHeader를 CSS 토글로 전환한다. */
  ```
- **라이브러리 함수 (lib/)**: 공개 함수에 JSDoc — 기능 설명 + `@param` 만.
- **인라인 주석**: 복잡한 비즈니스 로직이나 비자명한 알고리즘에만 허용.
- **TODO 주석**: 추후 구현이 필요한 부분에 `// TODO: 설명` 허용.

### 금지 사항

- `// PERF:`, `// SEO:`, `// COST:`, `// CLS:`, `// MIGRATION PATH:` 태그 주석 금지 — docs/에 기술.
- `{/* 컴포넌트 이름 */}`, `{/* Thumbnail */}`, `{/* Logo */}` 등 자명한 HTML 섹션 주석 금지.
- CSS 동작 설명 주석 금지 (Tailwind 클래스가 자체 문서 역할).
- Props interface 필드별 JSDoc 금지 — 타입 이름이 충분히 설명적이어야 함.

## Workflow Rules

### PM-First 원칙

새 기능 구현, 아키텍처 변경, 요구사항이 모호한 작업은 **반드시 product-manager 에이전트를 먼저 실행**하여 요구사항을 정리한 후 구현에 착수한다.

- PM이 요구사항/스펙을 docs/에 정리하거나 명확한 지시를 내린 후 fullstack-engineer가 구현.
- 단순 버그 수정, 린트 에러 해결, 설정 변경 등 명확한 작업은 PM 단계를 생략 가능.
- 판단 기준: "이 작업의 범위와 요구사항이 명확한가?" — 명확하지 않으면 PM부터.

## Sub-Agent System

`.claude/agents/`에 3개 전문 에이전트 구성:

- **product-manager** (opus) — 요구사항 정리, 전략 기획, 문서 관리. 코드 파일 수정 불가, .md 파일만 편집 가능. **새 기능/아키텍처 변경 시 항상 첫 번째로 실행.**
- **fullstack-engineer** (sonnet) — 기능 구현, 리팩토링. Security → Correctness → Performance → Cost → Maintainability 순서로 판단.
- **quality-reviewer** (sonnet) — 코드 품질 감사. 공유 자산 일관성, Performance/SEO, 문서-코드 동기화, 보안, 건설적 피드백 5개 차원.

에이전트 메모리: `.claude/agent-memory/{agent-name}/` — 프로젝트 스코프, 세션 간 지식 축적.
