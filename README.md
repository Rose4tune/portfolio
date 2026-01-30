# DLFly

개인 포트폴리오와 기술 블로그를 하나의 플랫폼에서 통합 관리하는 웹 애플리케이션입니다.</br>
Notion을 CMS로 활용하여 콘텐츠 작성과 관리의 허들을 낮추고, Next.js 기반 정적 생성과 ISR을 통해 성능과 SEO를 모두 확보하는 것을 목표로 합니다.

</br></br>

## 📌 Project Overview

정적 포트폴리오 사이트의 한계를 넘어, 지속적으로 업데이트할 수 있는 기술 블로그와 프로젝트 쇼케이스를 결합한 서비스입니다.</br>
개발자로서의 성장 과정을 기록하고, 이를 효율적으로 관리하며, 방문자에게 일관된 경험을 제공합니다.

**콘텐츠 관리의 지속 가능성**과 **유지보수 비용 최소화**를 핵심 목표로 설정했으며, 이를 위해 Notion을 CMS로 선택했습니다.

</br></br>

## 🎯 Goals & Design Intent

### 1. 콘텐츠 관리 비용 최소화
Git 기반 Markdown 파일 관리는 버전 관리 측면에서는 강력하지만, 글 작성 워크플로우가 복잡합니다.</br>
이미지 업로드, 메타데이터 관리, 빌드/배포 과정이 글 작성의 장벽이 됩니다.</br>
Notion을 CMS로 사용하면 이러한 overhead를 제거하고, 글 쓰기에만 집중할 수 있습니다.

### 2. 프로젝트와 블로그의 통합 관리
포트폴리오와 블로그를 별도 플랫폼에서 운영하면 브랜딩과 경험이 분산됩니다.</br>
하나의 코드베이스에서 프로젝트 소개, 기술 블로그, 이력서를 모두 관리하여 일관된 사용자 경험을 제공합니다.

### 3. 장기 운영 가능한 구조
개인 프로젝트는 초기 열정이 식으면 방치되기 쉽습니다.</br>
콘텐츠 업데이트가 쉽고, 인프라 관리가 단순하며, 기술적 부채가 쌓이지 않는 구조를 만들고자 했습니다.

</br></br>

## 🧩 Why Notion as CMS

### 선택 이유

**1. 콘텐츠 작성 경험의 우수성**  
Notion의 블록 기반 편집기는 텍스트, 이미지, 코드 블록, 수식, 임베드 등을 직관적으로 다룰 수 있습니다.</br>
글쓰기 자체에 집중할 수 있는 환경이 중요했습니다.

**2. 이미지 호스팅 자동화**  
Markdown 기반 블로그에서는 이미지를 별도로 호스팅하고 경로를 관리해야 합니다.</br>
Notion은 업로드한 이미지를 자동으로 S3에 저장하고 URL을 제공합니다.

**3. 메타데이터 관리의 용이성**  
Notion 데이터베이스의 속성(제목, 날짜, 태그, 상태 등)을 메타데이터로 활용하여, frontmatter를 수동으로 작성할 필요가 없습니다.

**4. Git 없이도 버전 관리 가능**  
Notion 자체에서 페이지 히스토리를 제공하여, 글의 변경 이력을 추적할 수 있습니다.

### Trade-off

Notion API는 Rate Limit, 이미지 URL 만료, private API 의존 등의 제약이 있지만, 개인 블로그 수준에서는 기술적으로 해결 가능합니다.</br>
콘텐츠 관리의 편의성이 이러한 복잡성을 충분히 상쇄한다고 판단했습니다. (구체적인 해결 방법은 Lessons Learned 참고)

</br></br>

## 🏗️ Architecture & Data Flow

### 전체 구조

```
Notion Database (CMS)
  ↓
@notionhq/client (메타데이터 쿼리)
  ↓
notion-client (페이지 recordMap 추출, signFileUrls: true)
  ↓
getRecordMap: enhanceImageUrls / enhancePageCover (이미지·커버 S3 URL 보강)
  ↓
개별 포스트: NotionPageWrapper (recordMap state, 55분/탭/에러 시 갱신) ← /api/notion-recordmap
  ↓
react-notion-x (Notion 블록 렌더링, mapImageUrl → signed_urls)
  ↓
Next.js ISR (정적 생성 + 주기적 갱신)
  ↓
Vercel (배포)
```

### 데이터 레이어

**1. Notion 데이터베이스 구조**  
- Blog 데이터베이스: 기술 블로그 글 (제목, 날짜, 키워드, 설명, 숨김 여부)
- Project 데이터베이스: 프로젝트 소개 (제목, 날짜, 진행 상태, 기술 스택, 커버 이미지)
- Book 데이터베이스: 독서 기록 (제목, 저자, 평점) - 예정

**2. 데이터 Fetching 전략**  
- `@notionhq/client`로 데이터베이스 쿼리 → 메타데이터 추출
- `notion-client`로 페이지 recordMap 가져오기 → 전체 블록 구조 확보
- `getRecordMap` 내부에서 `@notionhq/client`로 이미지 블록·페이지 커버의 S3 URL을 조회해 `signed_urls`에 보강
- 개별 포스트는 `NotionPageWrapper`가 recordMap을 state로 관리하며, 55분 주기·탭 활성화·이미지 로드 실패 시 `/api/notion-recordmap`으로 갱신

**3. ISR 설정**  
- 홈, 블로그, 프로젝트 목록: `revalidate: 3600` (1시간마다 갱신)
- 개별 포스트(블로그/프로젝트 상세): `revalidate: 3000` (50분). signed URL 만료(약 1시간) 전에 재생성하며, 클라이언트 `NotionPageWrapper`에서 추가 갱신으로 보완

### 폴더 구조

```
src/
├── app/              # Next.js App Router 페이지
├── domain/           # 비즈니스 로직 (Notion API, 데이터 fetching)
│   ├── notion/       # recordMap 추출, 이미지 URL 처리
│   └── posts/        # 블로그/프로젝트 데이터 쿼리
├── screens/          # 화면별 컴포넌트 (Home, Blog, Project, Resume)
├── shared/           # 공통 UI, 레이아웃, 유틸리티
│   ├── layout/       # Navbar, AnimatedLayout
│   ├── ui/           # NotionRenderer, NotionPageWrapper, Loader 등
│   └── lib/          # 유틸리티 함수, 커스텀 훅
└── widgets/          # 재사용 가능한 기능 단위 (SearchFilterBar)
```

</br></br>

## 🛠️ Tech Stack

### Next.js 15 (App Router)
- Server Components로 초기 렌더링 성능 최적화
- ISR(Incremental Static Regeneration)로 콘텐츠 자동 갱신
- 동적 라우트와 정적 생성을 조합하여 빌드 시간 단축

### TypeScript
- Notion API 응답 타입을 명확히 정의하여, 데이터 변환 과정에서 발생할 수 있는 오류 방지
- 컴포넌트 props 타입 추론으로 유지보수성 향상

### Tailwind CSS
- Notion 블록 스타일과 커스텀 디자인을 일관되게 유지
- 반응형 디자인 구현이 간단하여 빠른 프로토타이핑 가능

### react-notion-x
- Notion recordMap을 React 컴포넌트로 변환
- 코드 하이라이팅, 수식(KaTeX), 컬렉션, 임베드 등 Notion의 모든 블록 타입 지원
- Next.js Image 컴포넌트와 통합하여 이미지 최적화

### Notion API (@notionhq/client + notion-client)
- **@notionhq/client**: 공식 API로 데이터베이스 쿼리 및 메타데이터 조회
- **notion-client**: private API로 페이지 전체 구조(recordMap) 추출
- 두 클라이언트를 조합하여 메타데이터 관리와 블록 렌더링을 모두 구현

### notion-utils
- `defaultMapImageUrl`로 Notion 내부 URL을 notion.so 이미지 URL로 변환
- `NotionRenderer`의 `mapImageUrl`에서 `block.id` 기준 `recordMap.signed_urls`를 최우선 조회한 뒤, 없을 때만 변환·fallback 매칭

### Framer Motion
- 페이지 전환 애니메이션, 인터랙션 효과
- 키워드 클라우드의 랜덤 애니메이션 구현

### Vitest + Playwright
- Vitest: 컴포넌트 단위 테스트, 유틸리티 함수 테스트
- Playwright: E2E 테스트 (네비게이션, 블로그 필터링, 프로젝트 조회)

</br></br>

## ✨ Key Features

### 1. Notion 기반 콘텐츠 관리
- Notion 데이터베이스에서 블로그, 프로젝트, 독서 기록을 작성하면 자동으로 사이트에 반영
- 태그, 날짜, 상태 등의 메타데이터를 Notion 속성으로 관리
- `숨김` 체크박스로 임시 저장 기능 구현

### 2. 프로젝트 쇼케이스
- 진행 상태(완료/진행 중)와 기술 스택 표시
- 커버 이미지와 요약 설명으로 프로젝트 개요 제공
- 상세 페이지에서 Notion 블록으로 작성된 전체 내용 렌더링

### 3. 기술 블로그
- 태그 기반 필터링 및 검색 기능
- Notion의 코드 블록 하이라이팅, 수식, 임베드 지원
- 반응형 레이아웃으로 모바일 최적화

### 4. 키워드 클라우드
- 홈 화면에서 블로그 태그를 랜덤 애니메이션으로 표시
- 클릭 시 해당 태그로 필터링된 블로그 목록으로 이동

### 5. 이미지 최적화
- 서버: `getRecordMap`에서 이미지 블록·페이지 커버의 S3 URL을 `signed_urls`에 보강 (`enhanceImageUrls`, `enhancePageCover`)
- 개별 포스트: ISR 50분 + 클라이언트 `NotionPageWrapper`(55분 주기, 탭 활성화 시 5분 경과 시 갱신, 이미지 로드 실패 시 즉시 갱신)로 signed URL 만료 없이 표시
- 상세 설계 및 트러블슈팅: `.cursor/docs/NOTION_IMAGE_SYSTEM.md` 참고

<!-- ### 6. 다크 모드 지원
- `next-themes`로 테마 전환 구현
- Notion 렌더러는 라이트 모드 고정 (가독성 우선) -->

</br></br>

## 🔍 Lessons Learned / Trade-offs

### 1. Notion API의 제약과 해결 방법

- **recordMap 추출 문제**  
공식 `@notionhq/client`로는 페이지의 전체 블록 구조(recordMap)를 가져올 수 없어, `notion-client`의 private API를 사용해야 했습니다.</br>
이는 향후 Notion이 API를 변경하면 동작하지 않을 위험이 있지만, `react-notion-x`로 Notion 블록을 정확히 렌더링하려면 불가피한 선택이었습니다.

- **Rate Limit 제약**  
초당 3회 요청 제한이 있어, 콘텐츠가 많아지면 빌드 시간이 길어집니다.</br>
현재는 ISR로 빌드 시 모든 페이지를 생성하지 않고, 첫 방문 시 on-demand로 생성하여 문제를 회피했습니다.</br>
콘텐츠가 수백 개 수준으로 늘어나면 캐싱 전략을 재고해야 할 것입니다.

### 2. 이미지 URL 만료 문제
Notion의 S3 URL은 1시간 후 만료되어, 정적 생성만으로는 이미지가 깨지는 문제가 발생했습니다.</br>
개별 포스트는 **ISR 50분**(`revalidate: 3000`)과 **클라이언트 갱신**을 조합해 대응합니다. 클라이언트에서는 55분 주기 자동 갱신, 탭 복귀 시 5분 이상 경과 시 갱신, 초기 로드 시 URL이 30분 이상이면 갱신, 이미지 로드 실패 시 즉시 갱신을 수행하며, `/api/notion-recordmap`으로 실시간 recordMap을 가져옵니다. 새로고침 없이도 이미지가 유지됩니다.

### 3. Notion 블록 스타일 커스터마이징의 한계
`react-notion-x`는 Notion의 기본 스타일을 충실히 재현하지만, 커스텀 디자인을 적용하기 어렵습니다.</br>
CSS를 오버라이드하는 방식으로 일부 수정했지만, Notion 블록 구조에 의존하므로 완전한 커스터마이징은 불가능합니다.

### 4. 앞으로 수정할게 있다면?

- **Notion API 의존도 낮추기**</br>
Notion Exporter를 만들어 Markdown + 메타데이터 JSON으로 변환 후, 정적 파일로 관리하는 것도 고려할 것입니다.</br>
이렇게 하면 Notion API 제약에서 벗어나고, 빌드 시간도 단축됩니다.

- **이미지 CDN 도입**</br>
Notion S3 URL을 직접 사용하는 대신, Cloudflare Images 같은 CDN에 이미지를 복사하여 URL 만료 문제를 근본적으로 해결할 것입니다.

</br>

---

</br>

본 프로젝트는 개인 포트폴리오 목적으로 제작되었습니다.</br>
코드나 아이디어가 도움이 되셨다면 자유롭게 참고해 주세요.
