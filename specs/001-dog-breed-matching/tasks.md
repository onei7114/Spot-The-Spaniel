# Tasks: Spot The Spaniel

**Input**: Design documents from `specs/001-dog-breed-matching/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, and
`quickstart.md` are retained as historical design references. The active requirements are in
`spec.md` and the project constitution.

**Current implementation status**: The browser application, representative gallery, GitHub
Pages deployment, Render configuration, and focused tests are implemented. Completed tasks are
marked `[X]`. Remaining unchecked tasks require an explicit future change or external action.

## Phase 1: Setup

**Purpose**: Establish the browser-only product assets and deployment packaging.

- [X] T001 [P] Define the Spot The Spaniel product page and browser asset entry points in `src/dog_match/static/index.html`
- [X] T002 [P] Configure package metadata and static gallery inclusion in `pyproject.toml`
- [X] T003 [P] Exclude the legacy local dataset and generated development artifacts from publication in `.gitignore`
- [X] T004 [P] Add the GitHub Pages workflow in `.github/workflows/deploy-pages.yml`
- [X] T005 [P] Add the Render service configuration in `render.yaml`

## Phase 2: Foundational Browser Flow

**Purpose**: Provide the shared upload, model, gallery, and error-handling behavior required by
all user stories.

- [X] T006 Load Teachable Machine model `YfNmBnU00` and the representative gallery manifest in `src/dog_match/static/app.js`
- [X] T007 Validate JPG/JPEG selections, decode uploaded images, and release object URLs in `src/dog_match/static/app.js`
- [X] T008 Normalize breed labels and resolve representative gallery photos in `src/dog_match/static/app.js`
- [X] T009 Handle model, gallery, decoding, inference, and representative-image failures with recoverable messages in `src/dog_match/static/app.js`
- [X] T010 Provide accessible upload, loading, result, and error regions in `src/dog_match/static/index.html`
- [X] T011 Provide responsive layouts and readable result/gallery presentation in `src/dog_match/static/styles.css`

## Phase 3: User Story 1 - Identify a Spaniel (Priority: P1)

**Goal**: Show the highest-confidence spaniel prediction, tied top predictions, confidence, and
representative image or images.

**Independent Test**: Submit a valid spaniel image and verify the top prediction, rounded
confidence, and representative gallery image are displayed.

- [X] T012 [P] [US1] Filter the `Not A Dog` class and select the highest-confidence spaniel prediction in `src/dog_match/static/app.js`
- [X] T013 [US1] Apply the 50% confidence threshold and 10-percentage-point non-tied margin in `src/dog_match/static/app.js`
- [X] T014 [US1] Display all predictions tied for the highest confidence and their representative photos in `src/dog_match/static/app.js`
- [X] T015 [US1] Label the result as a model confidence estimate and representative breed photo in `src/dog_match/static/index.html`
- [X] T016 [US1] Cover successful single-result, tied-result, gallery, and responsive flows in `tests/e2e/test_match_flow.py`

## Phase 4: User Story 2 - Reject Invalid or Uncertain Photos (Priority: P1)

**Goal**: Reject invalid, non-dog, and insufficiently confident inputs without showing a
fabricated result.

**Independent Test**: Submit invalid files, non-dog predictions, and low-confidence predictions
and verify an actionable error with no result panel.

- [X] T017 [P] [US2] Reject unsupported file types and missing files in `src/dog_match/static/app.js`
- [X] T018 [P] [US2] Reject `Not A Dog` predictions and missing or weak spaniel confidence in `src/dog_match/static/app.js`
- [X] T019 [US2] Clear stale results and restore retry-ready controls after failures in `src/dog_match/static/app.js`
- [X] T020 [US2] Test invalid upload and failed-result recovery behavior in `tests/e2e/test_match_flow.py`

## Phase 5: User Story 3 - Share and Use the Application (Priority: P2)

**Goal**: Make the browser app usable from a free public URL without the legacy database.

**Independent Test**: Build the static site, serve it locally, and open the deployed GitHub Pages
URL; verify the page and gallery assets load.

- [X] T021 [P] [US3] Copy static assets and rewrite GitHub Pages paths in `scripts/build-pages.py`
- [X] T022 [US3] Include representative gallery images and relative gallery URLs in the Pages artifact
- [X] T023 [US3] Deploy and verify the public GitHub Pages site at `https://onei7114.github.io/Spot-The-Spaniel/`
- [X] T024 [US3] Document clone, build, local-server, GitHub Pages, and Render workflows in `README.md`
- [ ] T025 [US3] Create and verify a public Render service from `render.yaml`

## Phase 6: Polish and Cross-Cutting Validation

**Purpose**: Keep documentation, tests, and governance aligned with the active product.

- [X] T026 [P] Update the active requirements and acceptance criteria in `specs/001-dog-breed-matching/spec.md`
- [X] T027 [P] Update the project constitution for browser-first spaniel matching in `.specify/memory/constitution.md`
- [X] T028 Run focused unit, integration, and browser-flow tests and confirm the current suite passes in `tests/`
- [X] T029 Verify the static build contains `dist/index.html`, `dist/app.js`, `dist/gallery-manifest.json`, and gallery images using `scripts/build-pages.py`
- [ ] T030 Acceptance: upload, progress, result, and error flows are operable and readable on desktop/mobile viewports in latest stable Chrome, Firefox, Edge.
      Confirm native Safari on a macOS test host before release browser certification.
- [X] T031 Validate JPEG MIME type and 10 MB file size before browser inference in `src/dog_match/static/app.js`
- [X] T032 Reject excessive decoded image dimensions and handle browser memory/allocation failures before or during TensorFlow inference in `src/dog_match/static/app.js`
- [X] T033 Cover MIME, file-size, and decoded-dimension rejection in `tests/e2e/test_match_flow.py`

## Dependencies and Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on the static package and page entry points from Phase 1.
- **User Story 1 (Phase 3)**: Depends on the model, gallery, and shared browser flow from Phase 2.
- **User Story 2 (Phase 4)**: Depends on the prediction path from User Story 1.
- **User Story 3 (Phase 5)**: Depends on the completed static browser assets from Phases 1-4.
- **Polish (Phase 6)**: Can run after the affected story work; T030 requires a macOS test host.

### User Story Dependencies

- **US1 (P1)**: Depends on Phase 2 and is the MVP.
- **US2 (P1)**: Depends on the shared prediction path from US1, but is independently testable with mocked model output.
- **US3 (P2)**: Depends on the completed static asset tree and deployment configuration.

### Parallel Opportunities

- T001-T005 can run in parallel.
- T006-T011 can be split across model/gallery, markup, and styling work.
- T017-T018 can run in parallel because they modify separate validation branches in `app.js`.
- T026-T027 can run in parallel with deployment verification.

## MVP Implementation Strategy

1. Complete Phase 1 and Phase 2.
2. Complete User Story 1 and verify a confident spaniel result and tied-result behavior.
3. Complete User Story 2 and verify invalid, non-dog, and uncertain-photo rejection.
4. Publish the static artifact through GitHub Pages as the MVP shareable deployment.
5. Treat Render publication and native Safari verification as follow-up release checks.

## Notes

- The active browser flow does not require `Dog-Breeds-Dataset`, the legacy CLIP model, a
  generated vector index, or the legacy `/api/v1/matches` endpoint.
- The static representative gallery remains required because it supplies the displayed breed
  photos after prediction.
- The current focused test suite has passed 52 tests; rerun it after future changes.
- T025 and T030 are the only intentionally incomplete tasks because they require external
  deployment/account or hardware/browser verification.
