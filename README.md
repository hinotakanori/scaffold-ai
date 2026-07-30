# Scaffold AI

Scaffold AI turns an early product idea into an editable, structured development plan.

## MVP features

- Japanese product-idea input form
- Structured plan generation covering summary, user stories, screens, data, API, tasks, and risks
- Direct editing of every generated section
- Browser-local save and restore
- Markdown and JSON export
- OpenAI Responses API integration with strict structured output
- Automatic local-generation fallback when the AI endpoint is unavailable
- Responsive layout with no frontend build step
- Automated tests for the planning and export logic
- Versioned JSON Schema and runtime output validation
- GitHub Actions continuous integration

The Node server uses the OpenAI Responses API when `OPENAI_API_KEY` is configured. The API key remains server-side. If the endpoint is unavailable—such as on the static GitHub Pages deployment—the browser automatically uses the deterministic local planner.

## Run locally

Requirements: Node.js 18 or later.

```bash
cp .env.example .env
# Add OPENAI_API_KEY to .env, then:
npm run dev
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
├── tests/ai-planner.test.mjs
├── ai-planner.mjs
├── app.js
├── index.html
├── planner.mjs
├── server.mjs
├── styles.css
├── package.json
└── README.md
```

## Security and privacy

- AI input is sent to OpenAI only through the server endpoint.
- Saved projects use browser `localStorage`.
- The API key is never sent to the browser or included in exports.
- Do not commit local `.env` files or credentials.

## Next development steps

1. Deploy the Node server to a host with secret management.
2. Add rate limiting, persistent projects, and authentication.
3. Add browser-level accessibility and export tests.
4. Add continuous deployment for the static MVP.

## License

MIT. See [LICENSE](LICENSE).
