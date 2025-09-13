# Tasks: 모바일 UI/UX 최적화 개선

**Input**: Design documents from `/specs/003-ui-ux/`
**Prerequisites**: plan.md (required)

## Execution Flow (main)
```
1. Load plan.md from feature directory
2. Generate tasks by category:
   → Setup: 환경 준비, 의존성 확인
   → Tests: 각 UI 요소별 뷰포인트 테스트 (playwright mcp)
   → Core: UI/UX 개선 구현 (shadcn mcp 활용)
   → Polish: 최종 점검, 문서화
3. Apply task rules:
   → 병렬 가능 작업은 [P]로 표시 (Codex mcp 활용)
   → 각 태스크 완료 후 playwright mcp로 뷰포인트 테스트
4. Number tasks sequentially (T001, T002...)
5. Validate task completeness
```

## Phase 3.1: Setup
- [x] T001 프로젝트 환경 및 의존성 점검 (pnpm, Tailwind, shadcn/ui, playwright 등)

## Phase 3.2: Tests First (TDD)
- [x] T002 [P] 기존 모바일 뷰에서 하단 테이블, 패널, 캔버스, 슬라이더가 정상적으로 보이지 않는지 playwright e2e 테스트 작성 및 실패 확인 (tests/e2e/ui-mobile.spec.ts)

## Phase 3.3: Core Implementation
- [x] T003 [P] 하단 테이블 영역 모바일 레이아웃 개선 (src/components/grid-world/UtilityDisplay.tsx 등)
- [x] T004 [P] 조정 패널/헤더 패딩 추가 (src/components/grid-world/ControlPanel.tsx, app/layout.tsx 등)
- [x] T005 [P] 에이전트 캔버스 영역 미세한 패딩/테두리 적용 (src/components/grid-world/GridCanvas.tsx)
- [x] T006 [P] 슬라이더 핸들 불투명 스타일 적용 (src/components/ui/slider.tsx)

## Phase 3.4: Integration & Polish
- [x] T007 [P] 각 UI 개선 태스크별로 playwright mcp로 다양한 뷰포인트(모바일/태블릿/데스크탑)에서 정상 동작 확인 (tests/e2e/ui-mobile.spec.ts)
- [x] T008 최종 산출물(문서, 체크리스트, 코드) 점검 및 정리

## Parallel Execution Examples
- T003, T004, T005, T006은 서로 다른 파일을 수정하므로 Codex mcp로 병렬 실행 가능 ([P] 표시)
- 각 태스크 완료 후 T007에서 playwright mcp로 뷰포인트 테스트 필수

## Dependency Notes
- T001 → T002 → (T003, T004, T005, T006) [병렬] → T007 → T008
- T002는 TDD 원칙에 따라 반드시 실패하는 테스트를 먼저 작성
- 각 구현 태스크(T003~T006)는 병렬 가능, 완료 후 반드시 T007로 통합 테스트

---

- [x] T001 프로젝트 환경 및 의존성 점검 (pnpm, Tailwind, shadcn/ui, playwright 등)
- [x] T002 [P] 기존 모바일 뷰에서 하단 테이블, 패널, 캔버스, 슬라이더가 정상적으로 보이지 않는지 playwright e2e 테스트 작성 및 실패 확인 (tests/e2e/ui-mobile.spec.ts)
- [x] T003 [P] 하단 테이블 영역 모바일 레이아웃 개선 (src/components/grid-world/UtilityDisplay.tsx 등)
- [x] T004 [P] 조정 패널/헤더 패딩 추가 (src/components/grid-world/ControlPanel.tsx, app/layout.tsx 등)
- [x] T005 [P] 에이전트 캔버스 영역 미세한 패딩/테두리 적용 (src/components/grid-world/GridCanvas.tsx)
- [x] T006 [P] 슬라이더 핸들 불투명 스타일 적용 (src/components/ui/slider.tsx)
- [x] T007 [P] 각 UI 개선 태스크별로 playwright mcp로 다양한 뷰포인트(모바일/태블릿/데스크탑)에서 정상 동작 확인 (tests/e2e/ui-mobile.spec.ts)
- [x] T008 최종 산출물(문서, 체크리스트, 코드) 점검 및 정리
