import { define } from "@opencode/plugin/effect/plugin"
import { Integration } from "@opencode/schema/integration"
import { Money } from "@opencode/schema/money"
import { Effect } from "effect"
import { Model } from "../../model.js"
import { Provider } from "../../provider.js"

// Uhuru AI is U Code's own provider: listed first, and the default model whenever a key is
// present and the user has not chosen one. Keys come from uhuruai.co Settings -> API Keys.
const providerID = Provider.ID.uhuru
const integrationID = Integration.ID.make(providerID)
const packageName = "@opencode/ai/providers/openai-compatible"
const baseURL = "https://ucloud.orionx.xyz/functions/v1/uhuru-public-api/v1"
const defaultModelID = Model.ID.make("uhuru-4.5")
const free = {
  input: Money.USDPerMillionTokens.zero,
  output: Money.USDPerMillionTokens.zero,
  cache: { read: Money.USDPerMillionTokens.zero, write: Money.USDPerMillionTokens.zero },
}

// Only models verified live on the public API are listed. The public API drops client-defined
// tools today, so the model answers in chat but cannot run U Code's tools; `tools: false` says
// so in the model pickers. Flip it once uhuru-public-api forwards `tools` and returns `tool_calls`.
// Usage is billed per Uhuru plan rather than per token, hence the zero cost.
const models: Model.Info[] = [
  {
    id: defaultModelID,
    modelID: defaultModelID,
    providerID,
    name: "Uhuru 4.5",
    family: Model.Family.make("uhuru"),
    settings: { provider: providerID },
    capabilities: { tools: false, input: ["text"], output: ["text"] },
    variants: [],
    time: { released: Date.parse("2026-08-17") },
    cost: [free],
    status: "active",
    enabled: true,
    // The public API caps visible output at 16384 tokens; the context window is a
    // conservative assumption until the API publishes one.
    limit: { context: 128_000, output: 16_384 },
  },
]

export const UhuruPlugin = define({
  id: "opencode.provider.uhuru",
  effect: Effect.fn(function* (ctx) {
    yield* ctx.integration.transform((integrations) => {
      integrations.update(integrationID, (integration) => (integration.name = "Uhuru AI"))
      integrations.method.update({ integrationID, method: { type: "key" } })
      integrations.method.update({ integrationID, method: { type: "env", names: ["UHURU_API_KEY"] } })
    })
    yield* ctx.provider.transform((providers) => {
      providers.add({
        info: {
          id: providerID,
          integrationID,
          name: "Uhuru AI",
          activation: "auto",
          package: packageName,
          settings: { baseURL },
        },
        models,
      })
    })
    yield* ctx.model.transform((editor) => {
      if (editor.default.get() !== undefined) return
      if (!editor.get(providerID, defaultModelID)?.enabled) return
      editor.default.set(providerID, defaultModelID)
    })
  }),
})
