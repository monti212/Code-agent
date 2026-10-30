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

test("names an Uhuru model the way the platform does", () => {
  expect(
    IdentityPlugin.identity({
      name: "U4.0",
      ref: Model.Ref.make({ providerID: Provider.ID.uhuru, id: Model.ID.make("uhuru-4.0") }),
    }),
  ).toBe("# YOUR MODEL\nYou are U4.0.")
})

test("gives a model brought with the user's own key no model layer", () => {
  expect(
    IdentityPlugin.identity({
      name: "GPT-4o mini",
      ref: Model.Ref.make({ providerID: Provider.ID.make("openai"), id: Model.ID.make("gpt-4o-mini") }),
    }),
  ).toBeUndefined()
})

const context = (providerID: Provider.ID, id: string): SessionHooks["context"] => ({
  sessionID: Session.ID.make("ses_model_identity"),
  agent: Agent.ID.make("build"),
  model: Model.Ref.make({ providerID, id: Model.ID.make(id) }),
  system: [SystemPart.make("Agent prompt"), SystemPart.make("Initial context")],
  messages: [],
  tools: {},
  options: {},
})

it.effect("inserts the model layer after the agent prompt for Uhuru models only", () =>
  Effect.gen(function* () {
    const catalog = yield* Provider.Service
    const hooks = yield* PluginHooks.Service
    const plugins = yield* Plugin.Service
    const pluginHost = yield* PluginHost.make(plugins)
    yield* catalog.transform((editor) => {
      editor.models.update(Provider.ID.uhuru, Model.ID.make("uhuru-4.0"), (model) => {
        model.name = "U4.0"
      })
    })
    yield* IdentityPlugin.Plugin.effect(pluginHost)

    const named = context(Provider.ID.uhuru, "uhuru-4.0")
    yield* hooks.trigger("session", "context", named)
    expect(named.system.map((part) => part.text)).toEqual([
      "Agent prompt",
      "# YOUR MODEL\nYou are U4.0.",
      "Initial context",
    ])

    const fallback = context(Provider.ID.uhuru, "unknown-model")
    yield* hooks.trigger("session", "context", fallback)
    expect(fallback.system.map((part) => part.text)).toEqual([
      "Agent prompt",
      "# YOUR MODEL\nYou are unknown-model.",
      "Initial context",
    ])

    const own = context(Provider.ID.make("openai"), "gpt-5")
    yield* hooks.trigger("session", "context", own)
    expect(own.system.map((part) => part.text)).toEqual(["Agent prompt", "Initial context"])
  }),
)
