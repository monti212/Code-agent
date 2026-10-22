import { expect, test } from "bun:test"
import path from "path"
import { SessionSystemPrompt } from "@opencode/core/session/system-prompt"

const manifest = await Bun.file(path.resolve(import.meta.dir, "../src/session/runner/prompt/uhuru-core.json")).json()

test("the Uhuru core prompt is exactly what script/sync-uhuru-prompt.ts generated", () => {
  // A mismatch means uhuru-core.txt was edited by hand. Change the platform and re-run the sync script.
  expect(new Bun.CryptoHasher("sha256").update(SessionSystemPrompt.core).digest("hex")).toBe(manifest.sha256)
})

test("the Uhuru core prompt opens with the platform identity protocol", () => {
  expect(SessionSystemPrompt.core.startsWith("# Who you are\n\nYou are Uhuru AI, Uhuru for short.")).toBe(true)
})
