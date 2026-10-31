export * as UCodePromptPlugin from "./ucode-prompt.js"

import { SystemPart } from "@opencode/ai"
import { define } from "@opencode/plugin/effect/plugin"
import type { SessionHooks } from "@opencode/plugin/effect/session"
import { Duration, Effect, Schema, Stream } from "effect"
import type { Scope } from "effect"
import { HttpClient, HttpClientRequest, HttpClientResponse } from "effect/unstable/http"
import { Bus } from "../bus.js"
import { Credential } from "../credential.js"
import { Integration } from "../integration.js"
import { Provider } from "../provider.js"
import { allowed } from "./provider/allowlist.js"
import { baseURL } from "./provider/uhuru.js"

// U Code's system prompt lives on the Uhuru platform (ucode-api/prompt.ts), not in this repository. Uhuru models
// get it server-side on every request. A model the user brings with their own key never passes through the
// platform, so this plugin fetches the same prompt with the user's Uhuru key and leads those requests with it.
// Until the prompt is in hand, the own-key providers U Code offers (OpenAI, Anthropic) are disabled, so no model U
// Code offers runs without the identity. A provider the user writes into their own config is theirs: it gets the
// prompt once it is available and is otherwise left as they configured it.
const Payload = Schema.Struct({ object: Schema.Literal("prompt"), version: Schema.String, prompt: Schema.String })
const uhuru = Integration.ID.make(Provider.ID.uhuru)
const ownKey = allowed.filter((id) => id !== Provider.ID.uhuru)

export const Plugin = define<HttpClient.HttpClient | Bus.Service | Scope.Scope>({
  id: "opencode.prompt.ucode",
  effect: Effect.fn("UCodePromptPlugin")(function* (ctx) {
    const http = HttpClient.filterStatusOk(yield* HttpClient.HttpClient)
    const bus = yield* Bus.Service
    const state = { prompt: undefined as string | undefined }

    // No Uhuru connection clears the prompt; a failed fetch keeps the last one, so a platform hiccup does not
    // switch off models mid-session.
    const load = Effect.gen(function* () {
      const connection = yield* ctx.integration.connection.active(uhuru)
      if (!connection) return undefined
      const credential = yield* ctx.integration.connection.resolve(connection)
      if (!credential) return undefined
      const token = credential.type === "oauth" ? credential.access : credential.key
      const payload = yield* http
        .execute(
          HttpClientRequest.get(`${baseURL}/prompt`).pipe(
            HttpClientRequest.acceptJson,
            HttpClientRequest.bearerToken(token),
          ),
        )
        .pipe(Effect.flatMap(HttpClientResponse.schemaBodyJson(Payload)), Effect.timeout(Duration.seconds(10)))
      return payload.prompt
    }).pipe(
      Effect.catch((cause) =>
        Effect.logWarning("failed to load the U Code prompt", { cause }).pipe(Effect.as(state.prompt)),
      ),
    )
    const refresh = load.pipe(
      Effect.tap((prompt) => Effect.sync(() => (state.prompt = prompt))),
      Effect.andThen(ctx.model.reload()),
    )

    state.prompt = yield* load
    yield* ctx.model.transform((models) => {
      if (state.prompt) return
      for (const model of models.list()) {
        if (!ownKey.includes(Provider.ID.make(model.providerID))) continue
        models.update(model.providerID, model.id, (draft) => {
          draft.enabled = false
        })
      }
    })

    const hook = (event: SessionHooks["context"]) =>
      Effect.sync(() => {
        if (event.model.providerID === Provider.ID.uhuru || !state.prompt) return
        event.system.splice(0, 0, SystemPart.make(state.prompt))
      })
    yield* ctx.session.hook("context", hook)
    yield* ctx.session.hook("compaction", hook)
    yield* ctx.session.hook("generate", hook)

    yield* bus.subscribe(Credential.Event.Switched).pipe(
      Stream.filter((event) => event.data.integrationID === uhuru),
      Stream.runForEach(() => refresh),
      Effect.forkScoped({ startImmediately: true }),
    )
    // The platform improves the prompt without a client release, so pick up a new version hourly.
    yield* Effect.sleep(Duration.hours(1)).pipe(Effect.andThen(refresh), Effect.forever, Effect.forkScoped)
  }),
})
