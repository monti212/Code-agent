# U Code branding

U Code is the Uhuru coding agent: a terminal, desktop and web agent built by OrionX on top of the
open-source opencode harness (MIT). This file is the rulebook for what carries the U Code brand,
what deliberately keeps its upstream spelling, and how to merge upstream without losing either.

## The rule

**Everything a user reads, types or installs says U Code. Everything only code reads keeps the
upstream name.** Internal names are kept so that `git merge upstream/v2` stays a small, mechanical
operation. A rename that no user can see buys nothing and costs a conflict on every merge.

## Identity

| Thing                  | Value                                                                               | Source of truth                              |
| ---------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------- |
| Product name           | **U Code** (two words, space, capital C)                                            | `packages/util/src/brand.ts`                 |
| Command                | `ucode`                                                                             | `Brand.command`                              |
| Company                | Uhuru AI, built by OrionX in Gaborone, Botswana                                     | `Brand.company`, `Brand.maker`               |
| Home                   | `https://code.uhuruai.co`                                                           | `Brand.home`                                 |
| Docs                   | `https://code.uhuruai.co/docs/<page>`                                               | `Brand.docsURL(page)`                        |
| Contact                | `hello@orionx.xyz`                                                                  | `Brand.contact`                              |
| Source                 | `https://github.com/monti212/Code-agent`                                            | `Brand.repository`                           |
| Global dirs            | `~/.config/ucode`, `~/.local/share/ucode`, `~/.cache/ucode`, `~/.local/state/ucode` | `packages/util/src/global.ts`                |
| Project config         | `ucode.json` / `ucode.jsonc`, `.ucode/`                                             | `packages/core/src/config/discovery.ts`      |
| Env vars               | `UCODE_*` (aliased onto the upstream `OPENCODE_*` reads)                            | `packages/util/src/brand-env.ts`             |
| Default model provider | Uhuru (`uhuru`), Uhuru Public API                                                   | `packages/core/src/plugin/provider/uhuru.ts` |

TypeScript code uses `import { Brand } from "@opencode/util/brand"` rather than repeating literals.
Static files (markdown, JSON, HTML, i18n tables) use the literal values above.

### Palette (Uhuru AI brand book, `docs/brand-book/03-color-system.md` in uhuruorionx)

| Token               | Hex       | Use                                            |
| ------------------- | --------- | ---------------------------------------------- |
| teal-500 (primary)  | `#0096B3` | primary actions, active states, the mark       |
| teal-300            | `#4DC1D8` | primary on dark backgrounds                    |
| teal-700            | `#006F8A` | pressed / hover on light                       |
| orange-500 (accent) | `#FF6A00` | accent, agent indicator, the mark's dot        |
| deep navy           | `#002F4B` | primary text on light, dark surfaces           |
| near-black          | `#0A0A0B` | dark background (matches the U Code app shell) |

### The mark

The U Code mark is a rounded square in teal with a white "U" and an orange dot:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0096B3"/><path d="M19 16v22.5c0 7.1 4.7 11.5 13 11.5s13-4.4 13-11.5V16h-7v22c0 3.5-2.1 5.7-6 5.7s-6-2.2-6-5.7V16h-7z" fill="#FFFFFF"/><circle cx="49" cy="46" r="3.5" fill="#FF6A00"/></svg>
```

Raster app icons (desktop installers, tray, dock) are the Uhuru U Code icon set, copied from
`src-tauri/icons/` in the uhuruorionx repository.

## What changes (user-visible)

- Product name in prose, UI, window titles, notifications, errors, help text, docs: "OpenCode" /
  "opencode" (as a name) → **U Code**.
- The command in instructions and help: `opencode run` → `ucode run`.
- Config file and directory names shown to users: `opencode.json` → `ucode.json`,
  `.opencode/` → `.ucode/`. (Both spellings are still read; the U Code ones win.)
- Environment variables shown to users: `OPENCODE_FOO` → `UCODE_FOO`.
- Links: `opencode.ai`, `opencode.ai/docs/...` → `code.uhuruai.co`, `code.uhuruai.co/docs/...`.
  Issue/source links → `github.com/monti212/Code-agent`. Upstream Discord, X and community links
  are removed, not redirected.
- Logos, favicons, app icons, ASCII wordmarks, default theme colours.
- Agent identity in system prompts: the agent is U Code, Uhuru's coding agent.

## What stays (internal, on purpose)

- Package names and scopes (`@opencode/*`, `opencode-ai` on npm), import paths, workspace names.
- Effect service tags (`"@opencode/..."`), plugin ids (`opencode.*`), database tables, event names,
  generated client code (regenerate with `bun run generate` in `packages/client`; never hand-edit).
- `OPENCODE_*` reads in code, build-time defines (`OPENCODE_VERSION`), internal file names.
- Wire protocol identifiers (`ai.opencode/...` meta keys, `x-opencode-*` headers, `User-Agent`).
- Code samples that import real published packages (for example `@opencode-ai/plugin` in plugin
  docs): a sample has to run, so the real package name stays, as in Uhuru's SDK-interoperability rule.
- `LICENSE`: the upstream MIT notice must stay; it is a licence condition.

## Third-party providers are not us

Users may still connect other model providers. Their names are ordinary provider names in a picker,
never part of U Code's identity. In particular **OpenCode Zen** and **OpenCode Go** (the provider
with id `opencode`) are upstream's hosted gateway: keep their names exactly as a third-party
provider, never rename them to "U Code Zen", never describe them as provided by U Code, and never
present them as the recommended or default provider. Uhuru is the recommended and default provider.

The agent itself never claims to be, run on, or be trained by another provider's model, whichever
model the user picks. Other AI companies are ordinary subject matter.

## Upstream-owned surfaces U Code does not ship

These packages run upstream's own hosted business (billing console, stats, enterprise sharing,
infrastructure) and are not deployed by U Code. They are left untouched so merges stay clean:
`packages/console`, `packages/stats`, `packages/enterprise`, `packages/function`, `packages/posts`,
`services/update`, `services/files`, `infra/`, `sst.config.ts`, `artifacts/`, `perf/`, `specs/`, and
the upstream release workflows under `.github/`.

`services/www` is the exception: it holds the current docs and is branded, built for
`code.uhuruai.co/docs`. Its `wrangler.jsonc` deliberately still carries upstream's worker names and
routes, which cannot deploy from this repository. Pointing it at `code.uhuruai.co/docs*` is a
routing decision for the live U Code app on that host, so it is made on purpose, not by a merge. `packages/web` holds upstream's older V1 docs and landing page, also branded.

## Network endpoints that would leak the user to upstream

| Feature              | Upstream behaviour                                                        | U Code behaviour                                    |
| -------------------- | ------------------------------------------------------------------------- | --------------------------------------------------- |
| CLI self-update      | downloads from `opencode.ai`, which would replace U Code with opencode    | off until a U Code release channel exists           |
| Desktop auto-update  | upstream GitHub releases                                                  | off until a U Code release feed exists              |
| OpenCode Zen gateway | switched on with a shared public key, so a fresh install sends code to it | active only after the user connects it              |
| Model catalog        | `models.opencode.ai`                                                      | kept: read-only public model metadata, no user data |

## Merging upstream

```bash
git remote add upstream https://github.com/anomalyco/opencode.git   # once
git fetch upstream v2
git merge upstream/v2
```

Conflicts land in user-visible strings and in the files listed in the Identity table. Resolve them
by taking upstream's logic and re-applying the rule above. After a merge, sweep new user-visible
strings:

```bash
git diff ORIG_HEAD -- packages/{app,ui,session-ui,tui,cli,desktop,web,core} | grep -n '^+.*OpenCode'
```
