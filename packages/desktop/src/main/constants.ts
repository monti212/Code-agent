import { app } from "electron"

type Channel = "local" | "dev" | "beta" | "prod"
const raw = import.meta.env.OPENCODE_CHANNEL
export const CHANNEL: Channel = raw === "local" || raw === "dev" || raw === "beta" || raw === "prod" ? raw : "dev"
export const VERSION = app.isPackaged ? app.getVersion() : (process.env.OPENCODE_VERSION ?? app.getVersion())

// U Code has no desktop release feed yet, and upstream's feed would replace U Code with opencode.
// Auto-update stays off until this names a U Code feed origin (serving `/update/api/...`).
export const UPDATE_FEED: string | undefined = undefined

export const UPDATER_ENABLED = app.isPackaged && CHANNEL !== "dev" && UPDATE_FEED !== undefined
