import type { APIRoute } from "astro"
import { renderLlmsTxt } from "../../docs/lib/llms"

export const prerender = true

// Served at /docs/llms.txt, next to the pages it indexes.
export const GET: APIRoute = ({ site }) =>
  new Response(renderLlmsTxt(site ?? new URL("https://code.uhuruai.co")), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
