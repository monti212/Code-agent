import { define } from "@opencode/plugin/effect/plugin"
import { Effect } from "effect"
import { Provider } from "../../provider.js"

// U Code serves Uhuru models, plus OpenAI and Anthropic for users who bring their own key. This plugin
// is registered after every other provider plugin, so catalog, gateway and local-server providers are
// all pruned. Providers a user writes into their own ucode.json are applied later and stay: that is the
// user's explicit choice, not something U Code offers.
export const allowed: readonly Provider.ID[] = [Provider.ID.uhuru, Provider.ID.openai, Provider.ID.anthropic]

export const ProviderAllowlistPlugin = define({
  id: "opencode.provider.allowlist",
  effect: Effect.fn(function* (ctx) {
    yield* ctx.integration.transform((integrations) => {
      for (const item of integrations.list()) {
        // MCP servers register their OAuth integrations as mcp_<hash>; they are not model providers.
        if (allowed.includes(Provider.ID.make(item.id)) || item.id.startsWith("mcp_")) continue
        integrations.remove(item.id)
      }
    })
    yield* ctx.provider.transform((providers) => {
      for (const item of providers.list()) {
        if (!allowed.includes(item.provider.id)) providers.remove(item.provider.id)
      }
    })
  }),
})
