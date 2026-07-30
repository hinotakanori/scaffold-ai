# Scaffold AI

Scaffold AI turns an early product idea into an editable, structured development plan.

## MVP features

- Japanese product-idea input form
- Structured plan generation covering summary, user stories, screens, data, API, tasks, and risks
- Direct editing of every generated section
- Browser-local save and restore
- Markdown and JSON export
- Responsive layout with no build step or external runtime dependency
- Automated tests for the planning and export logic
- Versioned JSON Schema and runtime output validation
- GitHub Actions continuous integration

The current MVP uses a deterministic local planning engine. It does not send input to an external AI service. The generation interface is isolated in `planner.mjs` so a server-side AI provider can replace it later without changing the page workflow.

## Run locally

Requirements: Python 3 (for the local static server). Node.js is required only for tests.

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Test

```bash
npm test
```

## Structure

```text
.
├── docs/product-requirements.md
├── schemas/plan.schema.json
├── tests/planner.test.mjs
├── app.js
├── index.html
├── planner.mjs
├── styles.css
├── package.json
└── README.md
```

## Security and privacy

- The MVP processes input locally in the browser.
- Saved projects use browser `localStorage`.
- No API key is required or included.
- Do not commit local `.env` files or credentials.

## Next development steps

1. Introduce a server endpoint for an AI provider with strict structured output.
2. Add persistent projects and authentication.
3. Add browser-level accessibility and export tests.
4. Add continuous deployment for the static MVP.

## License

MIT. See [LICENSE](LICENSE).
