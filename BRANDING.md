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
| Default model provider | Uhuru (`uhuru`): U4.0 and U5.0 through the U Code endpoint (`ucode-api`)            | `packages/core/src/plugin/provider/uhuru.ts` |

TypeScript code uses `import { Brand } from "@opencode/util/brand"` rather than repeating literals.
Static files (markdown, JSON, HTML, i18n tables) use the literal values above.

### Look: the Uhuru chat's

U Code looks like the Uhuru chat (uhuruai.co), so the two read as one product. The default theme,
"U Code" (id `oc-2`, kept for merges), wears the chat's own palette; the values live in one place,
`packages/ui/src/theme/ucode-brand.ts`, copied from the chat's `src/site/styles/site.css` (the
`--o-*` night tokens) and `src/components/Chat/v3/styles/colors_and_type.css` (sand and navy) in
uhuruorionx. Change them there first, then in `ucode-brand.ts`, then run `bun run generate:v2-oc2`
in `packages/ui`; `ucode-brand.test.ts` fails if `oc-2.json` drifts from the module.

| Role                      | Dark      | Light     |
| ------------------------- | --------- | --------- |
| Ground (shell, `bg-deep`) | `#08131F` | `#F7F5F2` |
| Panel (`bg-base`)         | `#0A1725` | `#FFFFFF` |
| Raised (`layer-01`)       | `#0C1B2B` | `#F7F5F2` |
| Line                      | `#1B3243` | `#EAE7E3` |
| Text                      | `#F2EFEA` | `#19324A` |
| Muted text                | `#A9BAC7` | `#486D8D` |
| Accent / links            | `#2AB6D0` | `#006F8A` |
| Primary action            | `#0089A3` | `#0089A3` |
| Brand teal (the mark)     | `#0096B3` | `#0096B3` |
| Orange (the mark's dot)   | `#FF6A00` | `#FF6A00` |

Light muted text is the chat's navy-300 one step darker, so it holds 4.5:1 on sand as well as white.

Type follows the chat too: **Space Grotesk** for titles (dialog titles, settings headings),
**Inter** for reading, **JetBrains Mono** for code. All three are bundled (`packages/app/public/assets`,
`services/www/src/docs/assets/fonts`, with their OFL licences), so the desktop app never fetches a font.

The chat's mud-cloth print (`packages/app/public/assets/pattern-mask.png`) is drawn faintly on the home
screen and the desktop splash when the U Code theme is on, never behind code, diffs or the terminal.
The terminal UI's `ucode` theme (`packages/tui/src/theme/assets/ucode.json`) and the docs
(`services/www`, `packages/web`) use the same palette.

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
never part of U Code's identity. **U Code's own copy never advertises other vendors' models** (Monti,
2026-10-25): no "Claude, GPT, Gemini" in tips, notes or upsells, and no third-party gateway named on
every web search. A provider's name appears where the user picks or signs in to that provider (the
connect list, its sign-in options), because they bring their own key and need to know which is which.
Custom providers are described by capability ("the standard chat-completions API"), not by vendor.
Translations of that copy were removed rather than left naming vendors, so other languages fall
back to the neutral English until they are retranslated.

In particular **OpenCode Zen** and **OpenCode Go** (the provider
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
the upstream release workflows under `.github/` (apart from runner labels and upstream-only guards, see
[CI runners](#ci-runners)).

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

### CI runners

Upstream runs CI on Blacksmith, a paid runner provider whose `blacksmith-*` labels do not exist for this
repository: a job that keeps one waits in the queue until GitHub cancels it. Runner labels in
`.github/workflows/` are therefore ours. When a merge conflicts on a `runs-on` or matrix `host` line,
keep our label, and map any label upstream adds to the GitHub-hosted image of the same OS:

| Upstream label                     | U Code label       |
| ---------------------------------- | ------------------ |
| `blacksmith-4vcpu-ubuntu-2404`     | `ubuntu-24.04`     |
| `blacksmith-4vcpu-ubuntu-2404-arm` | `ubuntu-24.04-arm` |
| `blacksmith-4vcpu-windows-2025`    | `windows-2025`     |

GitHub-hosted images do not ship ripgrep, which core's search tests need on `PATH`, so the `unit` job in
`test.yml` installs it. Keep that step.

Jobs wired to upstream's own product (its `opencode` CLI from `opencode.ai`, its model gateway, its
GitHub App, its release artifacts) are limited to `github.repository == 'anomalyco/opencode'`, so they
skip here: triage, duplicate-issues, review, the `/oc` agent, pr-management's duplicate check and the
final publish job. Give a new upstream job of that kind the same guard. Jobs that need only a
credential this repository can hold itself (publish-vscode for the `orionx` publisher, notify-discord,
the nix-hashes commit) stay enabled and fail until that secret is set.

After a merge, the first command must print nothing; the second lists new upstream wiring to guard:

```bash
grep -rnE 'blacksmith-[0-9]+vcpu' .github/
git diff ORIG_HEAD -- .github/ | grep -nE '^\+.*(OPENCODE_API_KEY|opencode\.ai/install|anomalyco/opencode/github)'
```
