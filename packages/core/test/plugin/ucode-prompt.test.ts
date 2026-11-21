import { describe, expect } from "bun:test"
import { SystemPart } from "@opencode/ai"
import { Effect } from "effect"
import { HttpClient, HttpClientResponse } from "effect/unstable/http"
import { Agent } from "@opencode/core/agent"
import { Model } from "@opencode/core/model"
import { Plugin } from "@opencode/core/plugin"
import { PluginHooks } from "@opencode/core/plugin/hooks"
import { PluginHost } from "@opencode/core/plugin/host"
import { UhuruPlugin } from "@opencode/core/plugin/provider/uhuru"
import { UCodePromptPlugin } from "@opencode/core/plugin/ucode-prompt"
import { Provider } from "@opencode/core/provider"
import { Session } from "@opencode/core/session"
import type { SessionHooks } from "@opencode/plugin/effect/session"
import { withEnv } from "../fixture/env"
import { testEffect } from "../lib/effect"
import { PluginTestLayer } from "./fixture"

const it = testEffect(PluginTestLayer)
const prompt = "# Who you are\n\nU Code platform prompt (fixture)."

const platform = (requests: string[], status = 200) =>
  HttpClient.make((request) =>
    Effect.sync(() => {
      requests.push(`${request.url} ${request.headers.authorization ?? ""}`)
      return HttpClientResponse.fromWeb(
        request,
        Response.json({ object: "prompt", version: "test", prompt }, { status }),
      )
    }),
  )

const addPlugins = Effect.fn(function* (client: HttpClient.HttpClient) {
  const plugin = yield* Plugin.Service
  const host = yield* PluginHost.make(plugin)
  yield* UhuruPlugin.effect(host)
  yield* UCodePromptPlugin.Plugin.effect(host).pipe(Effect.provideService(HttpClient.HttpClient, client))
})

const ownKeyModel = Effect.fn(function* () {
  const catalog = yield* Provider.Service
  yield* catalog.transform((editor) => {
    editor.models.update(Provider.ID.openai, Model.ID.make("gpt-5"), (model) => {
      model.name = "GPT-5"
    })
  })
})

const context = (providerID: Provider.ID, id: string): SessionHooks["context"] => ({
  sessionID: Session.ID.make("ses_ucode_prompt"),
  agent: Agent.ID.make("build"),
  model: Model.Ref.make({ providerID, id: Model.ID.make(id) }),
  system: [SystemPart.make("Agent prompt")],
  messages: [],
  tools: {},
  options: {},
})

describe("UCodePromptPlugin", () => {
  it.effect("leads an own-key model's instructions with the platform prompt, fetched with the Uhuru key", () =>
    withEnv({ UHURU_API_KEY: "uhuru_sk_test", OPENAI_API_KEY: "sk-test" }, () =>
      Effect.gen(function* () {
        const requests: string[] = []
        const hooks = yield* PluginHooks.Service
        yield* ownKeyModel()
        yield* addPlugins(platform(requests))
        expect(requests).toEqual(["https://ucloud.orionx.xyz/functions/v1/ucode-api/v1/prompt Bearer uhuru_sk_test"])

        const own = context(Provider.ID.openai, "gpt-5")
        yield* hooks.trigger("session", "context", own)
        expect(own.system.map((part) => part.text)).toEqual([prompt, "Agent prompt"])

        // Uhuru models get the prompt from the platform itself, so the client adds nothing.
        const uhuru = context(Provider.ID.uhuru, "uhuru-4.0")
        yield* hooks.trigger("session", "context", uhuru)
        expect(uhuru.system.map((part) => part.text)).toEqual(["Agent prompt"])
      }),
    ),
  )

  it.effect("disables every non-Uhuru model when there is no Uhuru key to fetch the prompt with", () =>
    withEnv({ UHURU_API_KEY: undefined, OPENAI_API_KEY: "sk-test" }, () =>
      Effect.gen(function* () {
        const requests: string[] = []
        const models = yield* Model.Service
        yield* ownKeyModel()
        yield* addPlugins(platform(requests))
        expect(requests).toEqual([])
        expect((yield* models.get(Provider.ID.openai, Model.ID.make("gpt-5")))?.enabled).toBe(false)
      }),
    ),
  )

  it.effect("disables every non-Uhuru model when the platform does not serve the prompt", () =>
    withEnv({ UHURU_API_KEY: "uhuru_sk_test", OPENAI_API_KEY: "sk-test" }, () =>
      Effect.gen(function* () {
        const models = yield* Model.Service
        yield* ownKeyModel()
        yield* addPlugins(platform([], 503))
        expect((yield* models.get(Provider.ID.openai, Model.ID.make("gpt-5")))?.enabled).toBe(false)
        expect((yield* models.get(Provider.ID.uhuru, Model.ID.make("uhuru-4.0")))?.enabled).toBe(true)
      }),
    ),
  )
})
