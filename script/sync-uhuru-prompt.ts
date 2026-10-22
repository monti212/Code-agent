#!/usr/bin/env bun

// Regenerates U Code's core prompt from the Uhuru platform, so the brand identity has one source.
// The text is exactly what the platform builds for its U Code agent:
//   injectIdentityProtocol(buildCorePrompt("code-agent", undefined, { includeOutputFormats: false }))
// from supabase/functions/_shared in the uhuruorionx repository. Output formats are left out because
// they name chat-surface tools U Code does not have. Never edit the generated file by hand; change the
// platform and re-run this script.
//
//   bun script/sync-uhuru-prompt.ts /path/to/uhuruorionx

import path from "path"

const source = Bun.argv[2]
if (!source) throw new Error("Usage: bun script/sync-uhuru-prompt.ts /path/to/uhuruorionx")

const shared = path.resolve(source, "supabase/functions/_shared")
const core = await import(path.join(shared, "core_prompt.ts"))
const guard = await import(path.join(shared, "identity_guard.ts"))
const text = guard.injectIdentityProtocol(
  core.buildCorePrompt("code-agent", undefined, { includeOutputFormats: false }),
)

const commit = (await Bun.$`git -C ${source} rev-parse HEAD`.text()).trim()
const dirty = (await Bun.$`git -C ${source} status --porcelain -- supabase/functions/_shared`.text()).trim()
if (dirty) throw new Error(`Uncommitted changes in ${shared}; sync only from a committed platform tree`)

const target = path.resolve(import.meta.dir, "../packages/core/src/session/runner/prompt")
await Bun.write(path.join(target, "uhuru-core.txt"), text)
await Bun.write(
  path.join(target, "uhuru-core.json"),
  JSON.stringify(
    {
      source: "monti212/uhuruorionx",
      commit,
      build: 'injectIdentityProtocol(buildCorePrompt("code-agent", undefined, { includeOutputFormats: false }))',
      files: ["supabase/functions/_shared/core_prompt.ts", "supabase/functions/_shared/identity_guard.ts"],
      sha256: new Bun.CryptoHasher("sha256").update(text).digest("hex"),
    },
    null,
    2,
  ) + "\n",
)
console.log(`uhuru-core.txt synced from uhuruorionx@${commit.slice(0, 9)} (${text.length} characters)`)
