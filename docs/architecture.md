# System Architecture

## Overview

```mermaid
graph LR
    %% 1. 관리자 영역 (Admin & Logic)
    subgraph Group_Admin [1. Admin Area: Next.js]
        direction TB
        Admin(Admin User) -->|Write| Editor[Next.js Editor]
        Editor -->|Server Action| Logic[Node.js Logic]
    end

    %% 2. AI 서비스
    subgraph Group_AI [2. AI Service: GPTs]
        Logic <-->|Translate| OpenAI(OpenAI GPT-4o)
    end

    %% 3. 데이터베이스 (Content Store)
    subgraph Group_DB [3. Data Hub: Supabase]
        DB[(PostgreSQL)]
    end

    %% 4. 배포 파이프라인 (Build System)
    subgraph Group_DevOps [4. CI/CD: GitHub Actions]
        direction TB
        GHA(GitHub Actions) -->|Build Command| AstroBuilder[Astro SSG Engine]
        AstroBuilder -->|Generate HTML| CF(AWS S3 + CloudFront)
    end

    %% 5. 사용자 영역 (User Actor 제외 / 뷰어 유지)
    subgraph Group_Client [5. Client Area: Browser]
        CF -->|Load HTML & Assets| Browser[Astro Viewer]
    end

    %% --- Critical Flows (데이터 및 트리거 흐름) ---

    %% A. 콘텐츠 저장 흐름
    Logic == "Save Content" ==> DB

    %% B. 빌드 트리거 흐름 (Webhook)
    Logic -.->|"Trigger Build (API)"| GHA

    %% C. 빌드 시 콘텐츠 조회 (SSG)
    AstroBuilder -- "Fetch Posts (Build Time)" --> DB
```

## Flow

1. **콘텐츠 작성**: Admin이 Next.js Editor에서 글 작성 → Server Action → Supabase에 저장
2. **AI 번역**: 저장 시 OpenAI GPT-4o를 통해 다국어 번역 처리
3. **빌드 트리거**: Node.js Logic이 GitHub Actions에 빌드 트리거 API 호출
4. **SSG 빌드**: Astro가 빌드 타임에 Supabase에서 전체 포스트 Fetch → 정적 HTML 생성
5. **배포**: 생성된 HTML을 AWS S3에 업로드, CloudFront CDN으로 서빙
6. **사용자 접근**: 브라우저에서 정적 HTML 로드 (JS 최소화)

## App별 역할

| App           | Framework               | 역할                      | 렌더링                                      |
| ------------- | ----------------------- | ------------------------- | ------------------------------------------- |
| `apps/admin`  | Next.js 15 (App Router) | 글 작성/편집, 빌드 트리거 | CSR (Server Action/API Route for 서버 로직) |
| `apps/client` | Astro 5                 | 공개 블로그 뷰어          | SSG                                         |

## 외부 서비스

| 서비스                | 용도              |
| --------------------- | ----------------- |
| Supabase (PostgreSQL) | 콘텐츠 DB         |
| OpenAI GPT-4o         | 다국어 번역       |
| GitHub Actions        | CI/CD, SSG 빌드   |
| AWS S3 + CloudFront   | 정적 호스팅 + CDN |
