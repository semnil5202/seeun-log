# 번역 기능 엣지케이스 수정 보고서

레드팀 감사에서 도출된 13개 엣지케이스를 5개 배치(A→B→D→E→C)로 나누어 수정한 내역입니다.

---

## Batch A — TranslationSheet 핵심 로직 5건

**커밋**: `1d64136` | **파일**: `TranslationSheet.tsx`

| # | 문제 | 원인 | 수정 |
|---|------|------|------|
| 2 | `pendingRetranslation` useEffect에서 Promise rejection이 unhandled로 남음 | 재번역 자동 트리거 시 에러 핸들링 누락 | `.catch(() => {})` 추가로 미처리 rejection 방지 |
| 7 | 여러 locale 동시 재번역 시 `retranslatedLocales` 상태가 일부만 반영됨 | `setState(new Set([...prev, locale]))` 패턴에서 클로저가 stale state 참조 | 함수형 업데이트 `setState(prev => new Set([...prev, locale]))` 로 변경 |
| 8 | 필드를 수정→되돌림→재수정하면 dirty badge가 갱신되지 않음 | `prevDirtyFieldsRef`가 Set 비교로 "새 키 추가"만 감지, 동일 키 재추가는 무시 | dirtyFields를 정렬된 문자열로 직렬화하여 비교 (`[...fields].sort().join(',')`) |
| 11 | 직접수정 모드에서 저장 시 한국어 원문이 번역본에 혼입됨 | `handleSectionDirectEditToggle`이 `originalSections`(한국어)를 base로 사용 | `translatedSections`(해당 locale 번역본)을 base로 변경 |
| 14 | "전체 언어 재번역" 클릭 시 현재 필터된 locale만 대상이 됨 | `handleSelectiveAllLocales`가 필터링된 locale 목록을 사용 | 항상 `TARGET_LOCALES` 전체를 대상으로 실행하도록 수정 |

---

## Batch B — TranslationSheetContainer 타입 안전성 2건

**커밋**: `2bb712f` | **파일**: `TranslationSheetContainer.tsx`

| # | 문제 | 원인 | 수정 |
|---|------|------|------|
| 5 | `initialConfirmedValues`에서 `confirmed`가 string인 경우 pre-fill 오류 | `lastConfirmedTerms`의 `confirmed` 타입이 `string \| Record<string, string>`이나 Record로만 가정 | `typeof prev === 'object' && prev !== null` 타입 가드 추가, string이면 pre-fill 스킵 |
| 10 | Sheet를 닫았다 열면 이전 용어 목록이 남아있어 새 용어와 불일치 | `initialTerms` 비교가 referential equality(참조 비교)라 내용이 같아도 갱신 안 됨 | `initialTerms.map(t => t.original).join('\0')` 직렬화 비교로 변경 |

---

## Batch D — Sheet 전환 경합 방지 + 버튼 loading

**커밋**: `081d3c6` | **파일**: `posts/[id]/edit/page.tsx`, `posts/new/page.tsx`

| # | 문제 | 원인 | 수정 |
|---|------|------|------|
| 1 | "번역 용어 검토" → "번역본 확인" Sheet 전환 중 빠른 클릭 시 두 Sheet가 동시에 열림 | Sheet close→open에 800ms `setTimeout`이 있으나 그 사이 중복 클릭을 막지 않음 | `sheetTransitionRef` 가드 도입 — 전환 중이면 클릭 무시 |
| — | 글 수정/작성 완료 버튼이 mutation 중에도 활성 상태 | `isSubmitting` 상태가 버튼에 반영되지 않음 | `disabled={submitDisabled \|\| isSubmitting}` + `LoaderIcon` 로딩 표시 추가 |

---

## Batch E — 이미지 alt fallback + 문서화

**커밋**: `2ba52aa` | **파일**: `TranslationSheet.tsx`, `html-sections.ts`

| # | 문제 | 원인 | 수정 |
|---|------|------|------|
| 18 | 이미지를 재업로드(src 변경)하면 번역된 alt가 매칭되지 않아 소실됨 | alt 매칭이 `src` 기반이라 재업로드 시 src가 달라짐 | `find(t => t.src === orig.src)` 실패 시 `selectedTranslation.image_alts[i]` index 기반 fallback 추가 |
| 3 | `splitHtmlIntoSections`을 Server Action에서 호출하면 빈 배열 반환 (DOMParser 미존재) | client-only 함수라는 문서화 부재 | JSDoc에 "Client-only: DOMParser 사용. Server Action/API Route에서 호출 시 빈 배열 반환" 명시 |

---

## Batch C — GPT 응답 구조 불일치 대응

**커밋**: `9eb2aca` | **파일**: `translation/api/client.ts`

| # | 문제 | 원인 | 수정 |
|---|------|------|------|
| 9 | Selective 모드에서 GPT가 `content_sections` 대신 `content`만 반환하면 전체 덮어쓰기됨 | `content_sections` 응답만 핸들링하고 `content` fallback 분기가 없었음 | `content` 반환 시 `targetSectionIndices` 기반 섹션 머지 fallback 분기 추가 |
| 4 | GPT가 섹션 구조를 변경하여 반환 섹션 수가 원본보다 적을 때 undefined 접근 가능 | `returnedSections[s.index]` 접근 시 bounds check 없음 | `s.index < returnedSections.length` 조건 추가로 범위 초과 시 원본 유지 |

---

## 수정 범위 요약

| 배치 | 수정 건수 | 변경 파일 |
|------|-----------|-----------|
| A | 5건 | `TranslationSheet.tsx` |
| B | 2건 | `TranslationSheetContainer.tsx` |
| D | 2건 | `edit/page.tsx`, `new/page.tsx` |
| E | 2건 | `TranslationSheet.tsx`, `html-sections.ts` |
| C | 2건 | `api/client.ts` |
| **합계** | **13건** | **5개 파일** |

---

## QA 검증 결과

전체 판정: **APPROVE WITH CONDITIONS** (조건부 승인)

### 수정 검증 — 정상 동작 확인

| 배치 | # | 판정 | 비고 |
|------|---|------|------|
| A | 2 | OK | `.catch`로 unhandled rejection 방지. 내부 try/catch가 이미 toast.error 처리 |
| A | 7 | OK | 함수형 setState로 stale closure 문제 정확히 해결 |
| A | 8 | OK | 직렬화 비교가 되돌림+재수정 감지에 적합. 성능 영향 없음 (필드 수 < 20) |
| A | 11 | OK | `translatedSections` base 변경으로 한국어 혼입 원천 차단 |
| A | 14 | OK | 항상 전체 locale 대상. "전체 언어" 버튼 의미와 일치 |
| B | 5 | OK | `typeof` 가드가 string/object/null/undefined 모든 런타임 타입 커버 |
| B | 10 | OK | 직렬화 비교로 내용 기반 갱신 판단 정확 |
| D | 1 | OK | `sheetTransitionRef` 가드로 800ms 경합 방지 |
| D | Submit | OK | `finally` 블록에서 `isSubmitting` 리셋하여 모든 실패 경로 커버 |
| E | 18 | OK | src 매칭 → index fallback 2단계 전략. 기존 대비 개선 |
| E | 3 | OK | JSDoc 문서화로 서버 호출 방지 안내 |
| C | 9 | OK | 3단계 fallback 체인 (`content_sections` → `content` 머지 → raw) |
| C | 4 | OK | bounds check로 undefined 접근 방지, 실패 시 원본 유지 |

### 보완 권장 사항

#### 권장 (Recommended)

| 우선순위 | 대상 | 내용 | 이유 |
|----------|------|------|------|
| 1 | Batch A #2 | `.catch(() => {})` → `.catch((err) => console.error('pendingRetranslation failed:', err))` | 빈 catch는 미래 리팩토링 시 에러를 완전히 삼킬 위험. console.error 한 줄 추가로 디버깅 안전망 확보 |
| 2 | Batch D #1 | `sheetTransitionRef` unmount cleanup 추가: `useEffect(() => () => { sheetTransitionRef.current = false }, [])` | 800ms 타이머 진행 중 페이지 이탈 → 복귀 시 ref가 true로 남아 클릭이 무시될 수 있음 |
| 3 | Batch C #9 | `content` fallback 진입 시 `console.warn` 추가 | GPT가 비정상 포맷으로 응답한 사실을 로그로 남겨 운영 디버깅 지원 |

#### 선택 (Optional)

| 대상 | 내용 | 이유 |
|------|------|------|
| Batch B #10 | `join('\0')` → `JSON.stringify(...)` | null char 충돌 가능성은 극히 낮으나 collision-proof 대안. 실용적 리스크 없어 현행 유지 가능 |
| Batch E #3 | `isTranslatableSection`에도 `typeof window === 'undefined'` 가드 추가 | `splitHtmlIntoSections`만 서버 가드가 있고, 같은 파일의 `isTranslatableSection`은 누락. 기존 이슈이나 일관성 차원 |
| Batch C | `edit/page.tsx` 인라인 머지 로직을 `new/page.tsx`의 `mergeSelectiveResult` 함수처럼 추출 | 두 페이지의 섹션 머지 로직이 동일하나 한쪽만 함수로 추출됨. 향후 유지보수 시 불일치 위험 |

### 알려진 한계 (Known Limitations)

| 대상 | 한계 | 영향 |
|------|------|------|
| Batch C #9 | `content` fallback에서 positional index 가정 — GPT가 대상 섹션만 반환하면 위치 불일치 발생 가능 | 번역 소실 (원본 유지로 안전하게 degradation). `content_sections`가 정상 경로이므로 발생 빈도 극히 낮음 |
| Batch E #18 | index fallback은 이미지 순서가 변경되면 잘못된 alt 매칭 가능 | 이미지 삭제+재삽입 시 발생 가능하나, 기존 대비 개선 (alt 소실 → 잘못된 alt). 근본 해결은 stable image ID 도입 필요 |
| Batch A #14 | "전체 언어 재번역"이 이미 완료된 locale도 재실행 | 의도된 동작 (버튼명 "전체 언어"와 일치). API 비용 미미하게 증가하나 UX 명확성 우선 |
