import { expect, test } from "bun:test"
import { SystemPart } from "@opencode/ai"
import { Agent } from "@opencode/core/agent"
import { IdentityPlugin } from "@opencode/core/plugin/identity"
import { Plugin } from "@opencode/core/plugin"
import { PluginHooks } from "@opencode/core/plugin/hooks"
import { PluginHost } from "@opencode/core/plugin/host"
import { Session } from "@opencode/core/session"
import type { SessionHooks } from "@opencode/plugin/effect/session"
import { Model } from "@opencode/schema/model"
import { Provider } from "@opencode/core/provider"
import { Effect } from "effect"
import { testEffect } from "../lib/effect"
import { PluginTestLayer } from "./fixture"

const it = testEffect(PluginTestLayer)

test("names a model the user brought with their own key plainly", () => {
  expect(
    IdentityPlugin.identity({
      name: "GPT-4o mini",
      ref: Model.Ref.make({ providerID: Provider.ID.make("openai"), id: Model.ID.make("gpt-4o-mini") }),
    }),
  ).toBe(
    [
      "# Your model",
      "",
      "The user connected their own OpenAI account and chose GPT-4o mini for this session. Asked which model you are running, say so plainly: GPT-4o mini, through their OpenAI account, inside U Code.",
      "",
      "Model reference: openai/gpt-4o-mini",
    ].join("\n"),
  )
})

test("holds the Uhuru identity strictly for Uhuru models", () => {
  const text = IdentityPlugin.identity({
    name: "Uhuru 4.5",
    ref: Model.Ref.make({ providerID: Provider.ID.uhuru, id: Model.ID.make("uhuru-4.5") }),
  })
  expect(text).toContain("You run Uhuru 4.5, a model in the Uhuru AI family")
  expect(text).toContain("you are U Code on Uhuru 4.5, and nothing else")
  expect(text).toContain("Model reference: uhuru/uhuru-4.5")
})

const identity = (name: string, id: string) =>
  IdentityPlugin.identity({
    name,
    ref: Model.Ref.make({ providerID: Provider.ID.make("test"), id: Model.ID.make(id) }),
  })

const context = (id: string): SessionHooks["context"] => ({
  sessionID: Session.ID.make("ses_model_identity"),
  agent: Agent.ID.make("build"),
  model: Model.Ref.make({ providerID: Provider.ID.make("test"), id: Model.ID.make(id) }),
  system: [SystemPart.make("Agent prompt"), SystemPart.make("Initial context")],
  messages: [],
  tools: {},
  options: {},
})

it.effect("inserts the structured model block after the agent prompt", () =>
  Effect.gen(function* () {
    const catalog = yield* Provider.Service
    const hooks = yield* PluginHooks.Service
    const plugins = yield* Plugin.Service
    const pluginHost = yield* PluginHost.make(plugins)
    yield* catalog.transform((editor) => {
      editor.models.update(Provider.ID.make("test"), Model.ID.make("meta/muse-spark-1.1"), (model) => {
        model.name = "Muse Spark"
      })
    })
    yield* IdentityPlugin.Plugin.effect(pluginHost)

    const named = context("meta/muse-spark-1.1")
    yield* hooks.trigger("session", "context", named)
    expect(named.system.map((part) => part.text)).toEqual([
      "Agent prompt",
      identity("Muse Spark", "meta/muse-spark-1.1"),
      "Initial context",
    ])

    const fallback = context("unknown-model")
    yield* hooks.trigger("session", "context", fallback)
    expect(fallback.system.map((part) => part.text)).toEqual([
      "Agent prompt",
      identity("unknown-model", "unknown-model"),
      "Initial context",
    ])
  }),
)
