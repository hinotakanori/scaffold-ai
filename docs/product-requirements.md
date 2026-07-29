# Scaffold AI: initial product requirements

## Product goal

Help an individual developer turn an early application idea into a concrete,
reviewable implementation plan without requiring them to know every technical
question in advance.

## Target user

The initial user is an individual developer or small product team preparing a
new web application.

## Core workflow

1. The user enters an application idea, intended users, and desired outcome.
2. Scaffold AI identifies important missing information and asks concise
   follow-up questions.
3. Scaffold AI generates a structured plan.
4. The user reviews and edits the plan.
5. The user exports the result as Markdown or JSON.

## Generated plan

The MVP output should contain:

- Product summary and goals
- Assumptions and unanswered questions
- User stories
- Screen list and navigation outline
- Core data entities and relationships
- Proposed API endpoints
- Recommended technical stack with reasons
- Security and privacy considerations
- Prioritized development tasks
- MVP acceptance criteria

## Functional requirements

- A user can submit a project idea.
- Required fields are validated before generation.
- Generated output follows a versioned JSON schema.
- A failed generation produces a useful, retryable error.
- A user can edit generated sections.
- A user can save and reopen a project.
- A user can export a plan as Markdown and JSON.

## Non-functional requirements

- Secrets remain on the server and are never exposed to the browser.
- User input and model output are treated as untrusted data.
- Each generation has input-size, output-size, and timeout limits.
- Logs do not contain credentials or unnecessary personal information.
- The main workflow is usable on desktop and mobile screen sizes.
- Core schema validation and generation behavior have automated tests.

## Out of scope for the first MVP

- Generating and deploying a complete production application
- Supporting every programming language and framework
- Autonomous changes to a user's external repository
- Team permissions, billing, or enterprise administration
- A public template marketplace

## Open decisions

- Web framework and hosting platform
- AI provider and model
- Database and authentication provider
- Whether anonymous use is supported
- Project retention and deletion policy
- Default language of generated plans

## MVP completion criteria

The MVP is complete when a user can enter an idea, answer follow-up questions,
receive a schema-valid plan containing all required sections, edit it, save it,
and export it as Markdown and JSON, with tests covering the successful and
failed generation paths.
