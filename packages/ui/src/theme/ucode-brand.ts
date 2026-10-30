import type { ColorValue, HexColor, ThemePaletteColors, V2ColorValue } from "./types"

// U Code wears the Uhuru chat's palette, so the two read as one product. The values below are
// the chat's own: its night ground, panels, lines and text (uhuruorionx `src/site/styles/site.css`,
// the `--o-*` tokens) and its sand page and navy ink (`src/components/Chat/v3/styles/colors_and_type.css`).
// Change them there first, then here, then run `bun run generate:v2-oc2`, which writes them into
// the "U Code" theme (`themes/oc-2.json`). `ucode-brand.test.ts` fails if the two drift apart.
export const UCODE_CHAT = {
  dark: {
    ground: "#08131F",
    panel: "#0A1725",
    raised: "#0C1B2B",
    line: "#1B3243",
    chipLine: "#2A4257",
    ink: "#F2EFEA",
    body: "#A9BAC7",
    muted: "#7F97AA",
    ghost: "#476580",
    accent: "#2AB6D0",
    accentHover: "#55CDE3",
  },
  light: {
    page: "#F7F5F2",
    surface: "#FFFFFF",
    background: "#FCFCFB",
    border: "#EAE7E3",
    ink: "#19324A",
    inkSoft: "#2E4A6A",
    subtle: "#8BA3BC",
    deep: "#0D1B28",
    accent: "#0096B3",
  },
} as const satisfies Record<"dark" | "light", Record<string, HexColor>>

const dark = UCODE_CHAT.dark
const light = UCODE_CHAT.light
const v2 = (hex: HexColor) => `${hex.toLowerCase()}ff`
const clear = (hex: HexColor) => `${hex.toLowerCase()}00`

// The chat's teal scale stands in for the blue ramp in both modes, so every "blue" accent is teal.
const teal: Record<string, V2ColorValue> = {
  "v2-blue-100": "#f0fafcff",
  "v2-blue-200": "#e6f7faff",
  "v2-blue-300": "#b3e6efff",
  "v2-blue-400": "#80d4e3ff",
  "v2-blue-500": "#4dc1d8ff",
  "v2-blue-600": "#0089a3ff",
  "v2-blue-700": "#006f8aff",
  "v2-blue-800": "#005472ff",
  "v2-blue-900": "#004563ff",
  "v2-blue-1000": "#003a59ff",
  "v2-blue-1100": "#002f4bff",
  "v2-blue-1200": "#001f33ff",
}

type Mode = {
  palette: ThemePaletteColors
  overrides: Record<string, ColorValue>
  v2Overrides: Record<string, V2ColorValue>
}

export const UCODE_THEME: Record<"dark" | "light", Mode> = {
  dark: {
    // The derived scales mix the neutral seed toward the ink, so both sit on the navy hue: a warm ink
    // would swing the mix through green. The seed resolves to the chat's panel.
    palette: {
      neutral: "#1a2938",
      ink: "#ebf0f5",
      primary: dark.accent,
      success: "#12c905",
      warning: "#fcd53a",
      error: "#fc533a",
      info: "#edb2f1",
      interactive: "#0096B3",
      diffAdd: "#c8ffc4",
      diffDelete: "#fc533a",
    },
    overrides: {
      "text-strong": dark.ink,
      "text-base": dark.body,
      "text-weak": dark.muted,
      "text-weaker": dark.ghost,
      "border-weak-base": dark.line,
      "border-weaker-base": "#142737",
      "icon-base": dark.muted,
      "icon-weak-base": dark.chipLine,
      "surface-base": "#0F1F2E",
      "surface-raised-base": "#142737",
      "surface-raised-base-hover": "#172B3B",
      "surface-interactive-weak": "#0F2737",
    },
    v2Overrides: {
      // Ground, panel and raised are the chat's three steps; line, chip line and ghost follow, then
      // its muted, body and ink text, with the steps between body and ink mixed in OKLab.
      "v2-grey-50": "#ffffffff",
      "v2-grey-100": v2(dark.ink),
      "v2-grey-200": "#e7e7e5ff",
      "v2-grey-300": "#dcdfe0ff",
      "v2-grey-400": "#c9d2d7ff",
      "v2-grey-500": v2(dark.body),
      "v2-grey-600": v2(dark.muted),
      "v2-grey-700": v2(dark.ghost),
      "v2-grey-800": v2(dark.chipLine),
      "v2-grey-900": v2(dark.line),
      "v2-grey-1000": v2(dark.raised),
      "v2-grey-1100": v2(dark.panel),
      "v2-grey-1200": v2(dark.ground),
      ...teal,
      "v2-text-text-accent": v2(dark.accent),
      "v2-text-text-accent-hover": v2(dark.accentHover),
      "v2-icon-icon-accent": v2(dark.accent),
      "v2-icon-icon-accent-hover": v2(dark.accentHover),
      // A teal at 20% over the panel lands on the chat's line, and stays a line over any layer.
      "v2-border-border-muted": "rgba(95, 158, 187, 0.12)",
      "v2-border-border-base": "rgba(95, 158, 187, 0.2)",
      "v2-border-border-strong": "rgba(95, 158, 187, 0.32)",
      "v2-overlay-simple-tab-active-scrim": clear(dark.raised),
      "v2-overlay-simple-tab-hover-scrim": clear(dark.chipLine),
      "v2-overlay-simple-tab-scrim": clear(dark.ground),
      "v2-avatar-bg-gray": v2(dark.ghost),
      "v2-avatar-border-gray": v2(dark.body),
    },
  },
  light: {
    palette: {
      neutral: "#f4f5f6",
      ink: light.ink,
      primary: light.accent,
      success: "#12c905",
      warning: "#ffdc17",
      error: "#fc533a",
      info: "#a753ae",
      interactive: light.accent,
      diffAdd: "#9ff29a",
      diffDelete: "#fc533a",
    },
    overrides: {
      "background-base": light.background,
      "text-strong": light.ink,
      "text-base": "#486D8D",
      "text-weak": "#6E8DAA",
      "text-weaker": "#BAC8D6",
      "border-weak-base": "#D9D4CC",
      "border-weaker-base": light.border,
      "icon-base": "#6E8DAA",
      "icon-weak-base": "#BAC8D6",
      "surface-base": "#F9F7F5",
      "surface-raised-base": "#F4F1ED",
      "surface-raised-base-hover": "#EEEBE6",
      "surface-interactive-weak": "#F0FAFC",
    },
    v2Overrides: {
      // White panels on the chat's sand page, sand hairlines, and navy text. Muted text (700) is the
      // chat's navy-300 a step darker, so it holds 4.5:1 on sand as well as on white.
      "v2-grey-50": v2(light.surface),
      "v2-grey-100": v2(light.page),
      "v2-grey-200": "#f0eeeaff",
      "v2-grey-300": v2(light.border),
      "v2-grey-400": "#d9d4ccff",
      "v2-grey-500": v2(light.subtle),
      "v2-grey-600": "#6e8daaff",
      "v2-grey-700": "#486d8dff",
      "v2-grey-800": v2(light.inkSoft),
      "v2-grey-900": "#25405dff",
      "v2-grey-1000": "#1e3852ff",
      "v2-grey-1100": v2(light.ink),
      "v2-grey-1200": v2(light.deep),
      ...teal,
      "v2-text-text-accent": "var(--v2-blue-700)",
      "v2-text-text-accent-hover": "var(--v2-blue-800)",
      // A warm brown at 12% over white lands on the chat's sand border.
      "v2-border-border-muted": "rgba(80, 55, 22, 0.08)",
      "v2-border-border-base": "rgba(80, 55, 22, 0.12)",
      "v2-border-border-strong": "rgba(80, 55, 22, 0.2)",
      "v2-overlay-simple-tab-active-scrim": clear(light.page),
      "v2-overlay-simple-tab-hover-scrim": clear(light.border),
      "v2-overlay-simple-tab-scrim": clear(light.page),
      "v2-avatar-bg-gray": "#486d8dff",
      "v2-avatar-border-gray": v2(light.inkSoft),
    },
  },
}

// The page behind everything, painted before the theme loads (index.html, the preload script, the
// desktop window), so the first frame is already the chat's ground rather than a flash of grey.
export const UCODE_GROUND = { dark: dark.ground, light: light.page } as const
