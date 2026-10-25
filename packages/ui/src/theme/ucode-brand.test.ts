import { describe, expect, test } from "bun:test"
import { contrastRatio } from "./color"
import type { DesktopTheme, HexColor } from "./types"
import { UCODE_CHAT, UCODE_THEME } from "./ucode-brand"
import { resolveThemeV2 } from "./v2/resolve"

const theme: DesktopTheme = await Bun.file(new URL("./themes/oc-2.json", import.meta.url)).json()

describe("the U Code theme wears the chat's palette", () => {
  test.each(["light", "dark"] as const)("oc-2.json carries the %s palette (run `bun run generate:v2-oc2`)", (mode) => {
    const variant = theme[mode]
    expect(variant.palette).toEqual(UCODE_THEME[mode].palette)
    expect(variant.overrides).toMatchObject(UCODE_THEME[mode].overrides)
    expect(variant.v2Overrides).toMatchObject(UCODE_THEME[mode].v2Overrides)
  })

  test("dark: the deep ground, the base panel and the first layer are the chat's three steps", () => {
    const tokens = resolved("dark")
    expect(tokens("v2-background-bg-deep")).toBe(hex(UCODE_CHAT.dark.ground))
    expect(tokens("v2-background-bg-base")).toBe(hex(UCODE_CHAT.dark.panel))
    expect(tokens("v2-background-bg-layer-01")).toBe(hex(UCODE_CHAT.dark.raised))
    expect(tokens("v2-text-text-base")).toBe(hex(UCODE_CHAT.dark.ink))
  })

  test("light: white panels on the chat's sand page, with navy text", () => {
    const tokens = resolved("light")
    expect(tokens("v2-background-bg-deep")).toBe(hex(UCODE_CHAT.light.page))
    expect(tokens("v2-background-bg-base")).toBe(hex(UCODE_CHAT.light.surface))
    expect(tokens("v2-text-text-base")).toBe(hex(UCODE_CHAT.light.ink))
  })

  test.each(["light", "dark"] as const)("%s: text stays readable on the panel and on the ground", (mode) => {
    const tokens = resolved(mode)
    for (const ground of ["v2-background-bg-base", "v2-background-bg-deep"]) {
      const on = (role: string) => contrastRatio(tokens(role), tokens(ground))
      expect(on("v2-text-text-base")).toBeGreaterThanOrEqual(7)
      expect(on("v2-text-text-muted")).toBeGreaterThanOrEqual(4.5)
      expect(on("v2-text-text-accent")).toBeGreaterThanOrEqual(4.5)
      expect(on("v2-text-text-faint")).toBeGreaterThanOrEqual(3)
    }
  })
})

function resolved(mode: "light" | "dark") {
  const tokens = resolveThemeV2(theme)[mode]
  const resolve = (value: string): HexColor =>
    value.startsWith("var(--") ? resolve(tokens[value.slice(6, -1)]) : (value.slice(0, 7) as HexColor)
  return (name: string) => resolve(tokens[name])
}

function hex(value: HexColor) {
  return value.toLowerCase() as HexColor
}
