import { expect, test } from "bun:test"
import { popularProviders } from "./order"

test("lists Uhuru first and keeps upstream's hosted gateways out of the featured list", () => {
  expect(popularProviders[0]).toBe("uhuru")
  expect(popularProviders).not.toContain("opencode")
  expect(popularProviders).not.toContain("opencode-go")
})
