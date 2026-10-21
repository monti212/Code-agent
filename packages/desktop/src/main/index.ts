// Must stay first: maps UCODE_* onto OPENCODE_* before any module reads the environment.
import "@opencode/util/brand-env"

export {}

await import("./desktop")
