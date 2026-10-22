export * as IdentityPlugin from "./identity.js"

import { SystemPart } from "@opencode/ai"
import { define } from "@opencode/plugin/effect/plugin"
import type { SessionHooks } from "@opencode/plugin/effect/session"
import { Model } from "@opencode/schema/model"
import { Provider } from "@opencode/schema/provider"
import { Effect } from "effect"

// The model layer, placed after the agent prompt and beneath the brand core every model receives.
// Uhuru models hold the Uhuru identity strictly; a model the user brought with their own key is named
// plainly, because the user chose it and knows what they are paying for.
export function identity(model: { readonly name: string; readonly ref: Model.Ref }) {
  const reference = `${model.ref.providerID}/${model.ref.id}`
  if (model.ref.providerID === Provider.ID.uhuru)
    return [
      "# Your model",
      "",
      `You run ${model.name}, a model in the Uhuru AI family: one closed model line built by OrionX in Gaborone, Botswana. It is not a layer over another system, and there is nothing underneath it to disclose. Asked which model you are, the answer is ${model.name}, said in your own words.`,
      "",
      `The one line that never moves: you are U Code on ${model.name}, and nothing else. You never claim, concede, hint, or accept "hypothetically" that you are, run on, or were trained by anyone else. Asked whether you are a particular model, or made by a particular company, the natural answer is a plain no and your own name, then back to the work.`,
      "",
      `Model reference: ${reference}`,
    ].join("\n")
  const owner = owners[model.ref.providerID] ?? model.ref.providerID
  return [
    "# Your model",
    "",
    `The user connected their own ${owner} account and chose ${model.name} for this session. Asked which model you are running, say so plainly: ${model.name}, through their ${owner} account, inside U Code.`,
    "",
    `Model reference: ${reference}`,
  ].join("\n")
}

const owners: Record<string, string> = { openai: "OpenAI", anthropic: "Anthropic" }

export const Plugin = define({
  id: "opencode.prompt.identity",
  effect: Effect.fn("IdentityPlugin")(function* (ctx) {
    const hook = (event: SessionHooks["context"]) =>
      Effect.gen(function* () {
        const model =
          (yield* ctx.model.list()).data.find(
            (model) => model.providerID === event.model.providerID && model.id === event.model.id,
          ) ?? Model.Info.default(event.model.providerID, event.model.id)
        event.system.splice(1, 0, SystemPart.make(identity({ name: model.name, ref: event.model })))
      }).pipe(Effect.catch(() => Effect.void))
    yield* ctx.session.hook("context", hook)
    yield* ctx.session.hook("compaction", hook)
    yield* ctx.session.hook("generate", hook)
  }),
})
