import { define } from "@opencode/plugin/effect/plugin"
import { Integration } from "@opencode/schema/integration"
import { Money } from "@opencode/schema/money"
import { Effect } from "effect"
import { Model } from "../../model.js"
import { Provider } from "../../provider.js"

// Uhuru AI is U Code's own provider: listed first, and the default model whenever a key is
// present and the user has not chosen one. Keys come from uhuruai.co Settings -> API Keys.
//
// It calls the U Code endpoint on Uhuru Cloud, which serves U4.0 and U5.0 with tools. U Code's
// own instructions are applied there, server-side, so improving them never needs a client release.
const providerID = Provider.ID.uhuru
const integrationID = Integration.ID.make(providerID)
const packageName = "@opencode/ai/providers/openai-compatible"
const baseURL = "https://ucloud.orionx.xyz/functions/v1/ucode-api/v1"
const defaultModelID = Model.ID.make("uhuru-4.0")
const deepModelID = Model.ID.make("uhuru-5.0")
const family = Model.Family.make("uhuru")
// Usage is metered per Uhuru account rather than priced per token here, hence the zero cost.
const free = {
  input: Money.USDPerMillionTokens.zero,
  output: Money.USDPerMillionTokens.zero,
  cache: { read: Money.USDPerMillionTokens.zero, write: Money.USDPerMillionTokens.zero },
}
// Every U Code model takes these reasoning levels; the endpoint applies the model's own default
// when none is chosen (U4.0 medium, U5.0 high).
const efforts = ["low", "medium", "high", "xhigh", "max"] as const
const variants = efforts.map((effort) => ({ id: Model.VariantID.make(effort), settings: { reasoningEffort: effort } }))

const model = (id: Model.ID, name: string): Model.Info => ({
  id,
  modelID: id,
  providerID,
  name,
  family,
  settings: { provider: providerID },
  capabilities: { tools: true, input: ["text", "image"], output: ["text"] },
  variants,
  time: { released: Date.parse("2026-10-25") },
  cost: [free],
  status: "active",
  enabled: true,
  limit: { context: 1_000_000, output: 64_000 },
})

const models: Model.Info[] = [model(defaultModelID, "U4.0"), model(deepModelID, "U5.0")]

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
