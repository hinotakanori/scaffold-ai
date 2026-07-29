# Scaffold AI

AI-powered scaffold planning platform.

Scaffold AI turns a short product idea into a structured development plan. The
planned MVP will generate a product brief, screen map, data model, API outline,
and prioritized implementation tasks from a user's description.

## Status

This repository is in the planning and foundation phase. Application code has
not been implemented yet. The current focus is validating the MVP scope and
choosing the initial technology stack.

## Planned MVP

- Accept a product or application idea
- Ask for essential missing requirements
- Generate a structured project plan
- Present screens, data entities, API endpoints, and development tasks
- Export the generated plan in Markdown and JSON
- Save and revisit generated projects

See [docs/product-requirements.md](docs/product-requirements.md) for the initial
requirements and acceptance criteria.

## Repository structure

```text
.
├── docs/
│   └── product-requirements.md
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

Application directories and setup commands will be added after the technology
stack is selected. Do not add real credentials to `.env.example` or commit a
local `.env` file.

## Next steps

1. Confirm the target user and primary use case.
2. Choose the web framework, AI provider, database, and deployment platform.
3. Define the generated-plan JSON schema.
4. Build the idea input and generated-plan result screens.
5. Add automated tests and continuous integration.

## Contributing

Please open an issue before starting a large change. Keep pull requests focused
and include tests once application code is introduced.

## License

MIT. See [LICENSE](LICENSE).
