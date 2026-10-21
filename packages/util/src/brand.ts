// U Code product identity. Everything a user reads or types (product name,
// command, data directory, links) resolves through here, so an upstream merge
// that touches branding conflicts in this file instead of across the tree.
// Internal identifiers (package scopes, service tags, OPENCODE_* reads) keep
// their upstream spelling on purpose; see BRANDING.md at the repository root.

export const name = "U Code"
export const command = "ucode"
// Directory name under the XDG roots and the per-project `.ucode/` folder.
export const app = "ucode"
export const company = "Uhuru AI"
export const maker = "OrionX"
export const tagline = "The Uhuru coding agent."
export const home = "https://code.uhuruai.co"
export const docs = "https://code.uhuruai.co/docs"
export const contact = "hello@orionx.xyz"
export const repository = "https://github.com/monti212/Code-agent"
// Users may set UCODE_* everywhere upstream documents OPENCODE_*; see brand-env.ts.
export const envPrefix = "UCODE_"

export function docsURL(page = "") {
  return page ? `${docs}/${page.replace(/^\/+/, "")}` : docs
}

export * as Brand from "./brand.js"
