// U Code documents UCODE_* environment variables while the runtime keeps
// reading the upstream OPENCODE_* names. Import this module first in every
// entrypoint: module evaluation follows import order, so the aliases land in
// process.env before any flag module reads it, and child processes inherit them.
// An explicit OPENCODE_* value wins so existing setups keep working.

const from = "UCODE_"
const to = "OPENCODE_"

for (const [key, value] of Object.entries(process.env)) {
  if (!key.startsWith(from) || value === undefined) continue
  const target = to + key.slice(from.length)
  if (process.env[target] === undefined) process.env[target] = value
}
