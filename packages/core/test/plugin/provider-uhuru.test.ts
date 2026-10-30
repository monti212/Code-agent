import { describe, expect, test } from "bun:test"
import { Effect } from "effect"
import { Model } from "@opencode/core/model"
import { Plugin } from "@opencode/core/plugin"
import { PluginHost } from "@opencode/core/plugin/host"
import { ProviderPlugins } from "@opencode/core/plugin/provider"
import { UhuruPlugin } from "@opencode/core/plugin/provider/uhuru"
import { Provider } from "@opencode/core/provider"
import { withEnv } from "../fixture/env"
import { testEffect } from "../lib/effect"
import { PluginTestLayer } from "./fixture"

const it = testEffect(PluginTestLayer)

const addPlugin = Effect.fn(function* () {
  const plugin = yield* Plugin.Service
  const host = yield* PluginHost.make(plugin)
  yield* UhuruPlugin.effect(host)
})

describe("UhuruPlugin", () => {
  test("is the first registered provider plugin", () => {
    expect(ProviderPlugins[0]?.id).toBe("opencode.provider.uhuru")
  })

  it.effect("registers the U Code endpoint as an OpenAI-compatible provider", () =>
    withEnv({ UHURU_API_KEY: undefined }, () =>
      Effect.gen(function* () {
        const catalog = yield* Provider.Service
        yield* addPlugin()
        const provider = yield* catalog.get(Provider.ID.uhuru)
        expect(provider?.name).toBe("Uhuru AI")
        expect(provider?.package).toBe("@opencode/ai/providers/openai-compatible")
        expect(provider?.settings?.baseURL).toBe("https://ucloud.orionx.xyz/functions/v1/ucode-api/v1")
        expect((yield* catalog.available()).map((item) => item.id)).not.toContain(Provider.ID.uhuru)
      }),
    ),
  )

  it.effect("becomes available and the default model with UHURU_API_KEY", () =>
    withEnv({ UHURU_API_KEY: "uhuru_sk_test" }, () =>
      Effect.gen(function* () {
        const catalog = yield* Provider.Service
        const models = yield* Model.Service
        yield* addPlugin()
        expect((yield* catalog.available()).map((item) => item.id)).toContain(Provider.ID.uhuru)
        const model = yield* models.default()
        expect(model?.providerID).toBe(Provider.ID.uhuru)
        expect(model?.id).toBe(Model.ID.make("uhuru-4.0"))
        expect(model?.name).toBe("U4.0")
        expect(model?.capabilities.tools).toBe(true)
      }),
    ),
  )

  it.effect("offers U4.0 and U5.0, with tools, images and every reasoning level", () =>
    withEnv({ UHURU_API_KEY: "uhuru_sk_test" }, () =>
      Effect.gen(function* () {
        const models = yield* Model.Service
        yield* addPlugin()
        for (const [id, name] of [["uhuru-4.0", "U4.0"], ["uhuru-5.0", "U5.0"]] as const) {
          const model = yield* models.get(Provider.ID.uhuru, Model.ID.make(id))
          expect(model?.name).toBe(name)
          expect(model?.capabilities.tools).toBe(true)
          expect(model?.capabilities.input).toContain("image")
          expect(model?.limit).toEqual({ context: 1_000_000, output: 64_000 })
          expect(model?.variants.map((variant) => String(variant.id))).toEqual(["low", "medium", "high", "xhigh", "max"])
        }
      }),
    ),
  )
})
