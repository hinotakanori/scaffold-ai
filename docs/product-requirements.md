# Scaffold AI: initial product requirements

## Product goal

Help an individual developer turn an early application idea into a concrete,
reviewable implementation plan without requiring them to know every technical
question in advance.

## MVP workflow

1. Enter an application idea, intended users, and delivery platform.
2. Generate a structured implementation plan locally.
3. Review and directly edit each section.
4. Save the plan in the current browser.
5. Export the plan as Markdown or JSON.

## Required output

- Product summary
- User stories
- Screen list
- Core data model
- API outline
- Prioritized development tasks
- Risks and unanswered questions

## Current boundary

This release deliberately uses a deterministic browser-local planning engine.
External model calls, user accounts, cloud persistence, collaboration, and
automatic repository modification are outside this milestone.

## Acceptance criteria

- Required form fields are validated.
- Every required output section is generated.
- Generated sections can be edited.
- The latest plan can be saved and restored locally.
- Markdown and JSON files can be exported.
- Core planning and export functions have automated tests.
- The main workflow remains usable on mobile and desktop screens.
