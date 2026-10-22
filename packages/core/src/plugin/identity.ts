export * as IdentityPlugin from "./identity.js"

import { SystemPart } from "@opencode/ai"
import { define } from "@opencode/plugin/effect/plugin"
import type { SessionHooks } from "@opencode/plugin/effect/session"
import { Model } from "@opencode/schema/model"
import { Provider } from "@opencode/schema/provider"
import { Effect } from "effect"

// The model layer, beneath the Uhuru core prompt every model receives. An Uhuru model is named the way the
// platform names its models ("You are U4.7."); the core prompt already holds the identity. A model the
// user brought with their own key gets no model layer, so the core identity stands for every model and
// no upstream provider or model id ever reaches the instructions.
export function identity(model: { readonly name: string; readonly ref: Model.Ref }) {
  if (model.ref.providerID !== Provider.ID.uhuru) return undefined
  return `# YOUR MODEL\nYou are ${model.name}.`
}

export const Plugin = define({
  id: "opencode.prompt.identity",
  effect: Effect.fn("IdentityPlugin")(function* (ctx) {
    const hook = (event: SessionHooks["context"]) =>
      Effect.gen(function* () {
        const model =
          (yield* ctx.model.list()).data.find(
            (model) => model.providerID === event.model.providerID && model.id === event.model.id,
          ) ?? Model.Info.default(event.model.providerID, event.model.id)
        const text = identity({ name: model.name, ref: event.model })
        if (text) event.system.splice(1, 0, SystemPart.make(text))
      }).pipe(Effect.catch(() => Effect.void))
    yield* ctx.session.hook("context", hook)
    yield* ctx.session.hook("compaction", hook)
    yield* ctx.session.hook("generate", hook)
  }),
})
