# Feature Specification: Spot The Spaniel

**Feature Branch**: `001-dog-breed-matching`

**Created**: 2026-10-17

**Status**: Active

**Input**: User description: A welcoming browser experience where people upload a dog photo
and receive the most confident spaniel prediction, a representative breed photo, and an
honest confidence estimate. Non-dog and uncertain photos are rejected. The application must
be shareable through a free public deployment, and the legacy dog database is not required by
the active matching experience.

## User Scenarios & Testing

### User Story 1 - Identify a Spaniel (Priority: P1)

A dog owner uploads a clear JPG/JPEG photo and receives the spaniel breed with the highest
model confidence, its confidence percentage, and a representative photo.

**Why this priority**: This is the primary user value of Spot The Spaniel.

**Independent Test**: Submit a valid spaniel photo and verify that the result identifies one
or more top-confidence spaniel breeds, shows the confidence estimate, and displays the
corresponding representative photo.

**Acceptance Scenarios**:

1. **Given** a valid spaniel photo, **When** the user submits it, **Then** the page displays
   the highest-confidence spaniel breed and a representative breed photo.
2. **Given** one breed has the highest confidence, **When** the result is displayed, **Then**
   only that breed is shown with its rounded confidence percentage.
3. **Given** two or more spaniel breeds have equal highest confidence, **When** the result is
   displayed, **Then** all tied breeds and a representative photo for each are shown.

---

### User Story 2 - Reject Invalid or Uncertain Photos (Priority: P1)

A user receives clear feedback when the selected file is unsupported, unreadable, not a dog,
or does not produce a sufficiently confident spaniel result.

**Why this priority**: Honest rejection prevents users from treating weak or invalid results
as breed identifications.

**Independent Test**: Submit unsupported, unreadable, non-dog, and low-confidence photos and
verify that no breed result or representative photo is presented.

**Acceptance Scenarios**:

1. **Given** a non-JPG or unreadable file, **When** the user submits it, **Then** the page
   provides an actionable error and allows another selection.
2. **Given** the model considers `Not A Dog` at least as likely as the best spaniel class,
   **When** processing completes, **Then** the page rejects the photo without a breed result.
3. **Given** the best spaniel confidence is below 50% or does not lead the next non-tied
   class by at least 10 percentage points, **When** processing completes, **Then** the page
   explains that no confident match was found.

---

### User Story 3 - Share and Use the Application (Priority: P2)

A visitor opens a public link on a supported desktop or mobile browser and can use the
matching experience without an account.

**Why this priority**: Public access allows the project to be shared with others at no cost.

**Independent Test**: Open the deployed link in a supported browser, submit a valid photo, and
complete the primary flow without local project files or a local database.

**Acceptance Scenarios**:

1. **Given** a visitor opens the public link, **When** the page loads, **Then** the upload
   control is ready within five seconds on typical broadband.
2. **Given** a visitor submits a photo from a desktop or narrow mobile viewport, **When** the
   result appears, **Then** content remains readable without horizontal scrolling or overlap.
3. **Given** a visitor uses the public deployment, **When** a match is processed, **Then**
   the photo is handled in the browser and is not stored by the application service.

### Edge Cases

- The selected file has an unsupported type, is corrupt, or cannot be decoded.
- The photo contains no dog, multiple dogs, or a dog that is too small or obscured.
- The prediction is below the confidence threshold or fails the margin requirement.
- Two or more classes have exactly equal top confidence.
- A predicted breed has no corresponding representative gallery photo.
- The model library, model asset, or representative gallery cannot be loaded.
- The visitor is offline or has a slow connection.
- The page is viewed on a narrow mobile screen.

## Requirements

### Functional Requirements

- **FR-001**: The application MUST provide the product experience under the name
  “Spot The Spaniel” without requiring an account.
- **FR-002**: The application MUST accept JPG and JPEG uploads and provide actionable errors
  for unsupported, corrupt, or unreadable files.
- **FR-003**: The application MUST evaluate uploaded photos against the published spaniel
  classification model in the browser.
- **FR-004**: The application MUST treat the `Not A Dog` class as a rejection signal when
  it is at least as probable as the best spaniel class.
- **FR-005**: The application MUST accept a result only when the best spaniel class is at
  least 50% confidence and leads the next non-tied class by at least 10 percentage points.
- **FR-006**: The application MUST show the single highest-confidence spaniel class, or all
  classes tied for the highest confidence.
- **FR-007**: The application MUST show the confidence estimate as an integer percentage and
  label it as a model estimate rather than guaranteed breed certainty.
- **FR-008**: The application MUST show a representative gallery photo for every displayed
  breed and identify the photo as representative rather than the closest training image.
- **FR-009**: The application MUST provide clear loading, model-loading, gallery-loading,
  inference, and failure states without presenting an error as a successful result.
- **FR-010**: The active browser matching flow MUST NOT require the legacy dog dataset, local
  CLIP model, generated index, or database matcher.
- **FR-011**: The application MUST be deployable through a free public static host or web
  service and the deployment instructions MUST identify how to obtain its public link.
- **FR-012**: The application MUST NOT add social networking, adoption, accounts, photo
  retention, match history, or raw image logging.

### Key Entities

- **Uploaded Photo**: A user-selected JPG/JPEG image used for the current browser prediction.
- **Spaniel Prediction**: A breed label and model confidence returned for the uploaded photo.
- **Top Prediction Set**: The single highest-confidence spaniel prediction or all predictions
  sharing that highest confidence.
- **Representative Breed Photo**: A static gallery image associated with a displayed spaniel
  label.
- **Match Result**: The top prediction set, rounded confidence percentage, and representative
  photo or photos.

## Success Criteria

### Measurable Outcomes

- **SC-001**: At least 9 out of 10 first-time participants can upload a valid photo and
  identify the displayed breed and confidence within two minutes without assistance.
- **SC-002**: At least 95% of valid test photos that produce an accepted result display the
  highest-confidence class or all tied highest-confidence classes.
- **SC-003**: 100% of non-dog test cases where `Not A Dog` is at least as probable as the
  best spaniel class are rejected without a breed result.
- **SC-004**: 100% of accepted results in the test set display at least one corresponding
  representative breed photo.
- **SC-005**: The public page is ready to accept a photo within five seconds for at least
  95% of test loads on typical broadband.
- **SC-006**: The primary flow works on supported desktop and mobile browsers without
  horizontal scrolling, blocking overlap, or account creation.

## Assumptions

- Users have a modern browser with JavaScript enabled and temporary network access to load
  the published model and application assets.
- The published model's class labels remain stable enough for representative gallery lookup.
- The 50% confidence and 10-percentage-point margin are the initial product thresholds and
  may be revised after measured evaluation.
- Representative gallery assets remain available and retain their required attribution.
- A free public host may sleep or have cold-start delays; this does not change the browser
  matching behavior.
- The legacy dataset and CLIP implementation remain available only for development,
  evaluation, or future product decisions.
