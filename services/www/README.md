# U Code website

The Astro website for U Code's documentation, served at `https://code.uhuruai.co/docs`. The only deployment-specific path is the `base` setting in `astro.config.ts`; application code uses `import.meta.env.BASE_URL`.

- `src/pages/` owns website routes.
- `src/docs/` is the self-contained documentation feature rendered under `/docs`.
- `/docs/llms.txt` lists every page for language-model readers.
- `/install` explains how to install from source (U Code has no published installer yet).
- `/openapi.json` serves the generated OpenAPI specification.

The deployment sets `base: "/"`. In production the worker route only claims `code.uhuruai.co/docs*`, so the U Code app keeps the rest of the host; root-level routes (`/install`, `/openapi.json`, and the built `/_astro` assets) need their own routing decision before deploy.

## Development

From this directory, run:

```bash
bun dev
```

The local URL includes the base configured in `astro.config.ts`.

## Verification

```bash
bun typecheck
bun run check:generated
bun run build
```
