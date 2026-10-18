<!--
Sync Impact Report
Version change: 1.2.0 -> 2.0.0
Modified principles: I. Browser-First Spaniel Matching (redefined); II. Traceable
Results (redefined); III. Tested and Typed Python (retained and clarified);
IV. Resilient Interaction (retained); V. Simplicity and Explicit Behavior
(retained); VI. Welcoming User Experience (retained).
Added sections: Application and Data Constraints; Deployment and Privacy.
Removed sections: none.
Follow-up TODOs: Confirm the original ratification date.
-->
# Spot The Spaniel Constitution

## Core Principles

### I. Browser-First Spaniel Matching
The product MUST remain a Python application with a browser-based user experience and a CLI 
entry point for running or operating the application. The web interface MUST let a user submit 
a Spaniel photograph and receive a Spaniel-match result. Operational commands and user-facing 
workflows MUST have clear, documented responsibilities.
The product MUST provide a browser-based experience that accepts a clear JPG/JPEG dog photo
and evaluates it with the published Teachable Machine spaniel model
`YfNmBnU00`. The active user-facing match flow MUST NOT depend on the legacy local CLIP
database or the training dataset. The model's `Not A Dog` class MUST be used to reject
non-dog inputs, and accepted results MUST select the highest-confidence spaniel prediction.
Equal top-confidence spaniel predictions MUST be shown together.

### II. Honest, Traceable Results
Every accepted result MUST show the model confidence as an estimate, not a guaranteed breed
identification. The application MUST reject results below the configured confidence threshold,
results without the required lead over the next non-tied class, and results where `Not A Dog`
is at least as probable as the best spaniel class. Representative gallery photos MUST be
resolved from the published static gallery and MUST be labeled as representative rather than
the closest training image.

### III. Tested and Typed Python
All production Python code MUST have type hints. Application code MUST have relevant unit,
integration, and browser-flow tests. The project MUST maintain strictly greater than 80%
automated test coverage when coverage is applicable. Changes MUST include tests for changed
behavior and failure cases, and focused tests MUST pass before merge.

### IV. Resilient Interaction
Model loading, gallery loading, image decoding, and browser inference failures MUST be handled
explicitly. The interface MUST preserve a usable state where possible and provide a clear
user-facing error when recovery requires user action. Failures MUST NOT be reported as
successful matches.

### V. Simplicity and Explicit Behavior
The implementation MUST prefer the simplest design that meets the requirements and MUST avoid
unneeded abstractions. Input validation, confidence filtering, tie handling, gallery lookup,
and user-visible error states MUST be explicit and testable. New dependencies or complexity
MUST be justified by a concrete requirement.

### VI. Welcoming User Experience
The user interface MUST use the product name “Spot The Spaniel” and maintain a friendly,
approachable tone across upload, loading, result, and error states. This tone MUST NOT
compromise accessibility, readability, or accurate communication of model limitations.

## Application and Data Constraints

The production matching experience MUST be deployable as a static browser application or as a
thin web server that only serves the application assets. Uploaded photos MUST be processed by
browser inference and MUST NOT be uploaded to or stored by this application server. The
representative gallery is the only local image collection required by the active browser flow.
The legacy `Dog-Breeds-Dataset`, CLIP model, generated index, and database matcher MAY remain
for development and evaluation, but MUST NOT be required for deployment of the active flow.
The application MUST retain required image attribution when distributing gallery assets.

## Deployment and Privacy

The application MUST support a public deployment through a free static host or free web
service, including GitHub Pages or Render. Deployment configuration MUST document the build,
start, and public-link setup. No user accounts, personal details, uploaded-photo storage,
match-history storage, or raw image logging may be introduced without an amended constitution
and explicit user-facing disclosure.

## Development Workflow and Quality Gates

Changes MUST be reviewed for constitution compliance. Before merge, focused tests covering the
changed behavior MUST pass, production Python type hints MUST be present, and automated
coverage MUST remain strictly greater than 80% when the affected Python code is covered.
Browser-facing changes MUST include a browser-flow test or an explicit documented reason why
one is not applicable. Documentation MUST describe active behavior rather than legacy behavior.

## Governance

This constitution governs project design and delivery. Amendments MUST update this document,
explain their rationale, and increment the version according to semantic versioning: MAJOR for
incompatible governance or principle changes, MINOR for new or materially expanded
requirements, and PATCH for clarifications that do not change requirements. Reviewers MUST
verify compliance with the principles and quality gates for each change. When another project
document conflicts with this constitution, the conflict MUST be resolved or explicitly
amended before affected work is accepted. The constitution's active version and amendment date
MUST be recorded in the version line below.

**Version**: 2.0.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm original adoption date | **Last Amended**: 2026-10-17
