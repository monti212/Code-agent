import { describe, expect, test } from "bun:test"
import { Effect } from "effect"
import { Integration } from "@opencode/core/integration"
import { Plugin } from "@opencode/core/plugin"
import { PluginHost } from "@opencode/core/plugin/host"
import { ProviderPlugins } from "@opencode/core/plugin/provider"
import { ProviderAllowlistPlugin } from "@opencode/core/plugin/provider/allowlist"
import { Provider } from "@opencode/core/provider"
import { testEffect } from "../lib/effect"
import { PluginTestLayer } from "./fixture"

const it = testEffect(PluginTestLayer)

const addPlugin = Effect.fn(function* () {
  const plugin = yield* Plugin.Service
  const host = yield* PluginHost.make(plugin)
  yield* ProviderAllowlistPlugin.effect(host)
})

describe("ProviderAllowlistPlugin", () => {
  test("runs after every other provider plugin", () => {
    expect(ProviderPlugins.at(-1)?.id).toBe("opencode.provider.allowlist")
  })

  it.effect("keeps Uhuru, OpenAI and Anthropic and removes every other provider", () =>
    Effect.gen(function* () {
      const catalog = yield* Provider.Service
      yield* catalog.transform((editor) => {
        for (const id of ["uhuru", "openai", "anthropic", "google", "opencode", "openrouter"])
          editor.update(Provider.ID.make(id), () => {})
      })
      yield* addPlugin()
      const ids = (yield* catalog.all()).map((item) => item.id).toSorted()
      expect(ids).toEqual([Provider.ID.anthropic, Provider.ID.openai, Provider.ID.uhuru])
    }),
  )

  it.effect("removes provider sign-ins but keeps MCP server sign-ins", () =>
    Effect.gen(function* () {
      const integrations = yield* Integration.Service
      yield* integrations.transform((editor) => {
        for (const id of ["uhuru", "openai", "google", "github-copilot", "mcp_0123456789abcdef"])
          editor.update(Integration.ID.make(id), (item) => (item.name = id))
      })
      yield* addPlugin()
      const ids = (yield* integrations.list()).map((item) => item.id).toSorted()
      expect(ids).toEqual(["mcp_0123456789abcdef", "openai", "uhuru"].map((id) => Integration.ID.make(id)))
    }),
  )
})
