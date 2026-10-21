import { Brand } from "@opencode/util/brand"
import { resolveChannel } from "./utils"

const arg = process.argv[2]
const channel = arg === "dev" || arg === "beta" || arg === "prod" ? arg : resolveChannel()

const appId = channel === "prod" ? "xyz.orionx.ucode.desktop" : `xyz.orionx.ucode.desktop.${channel}`
const productName =
  channel === "prod" ? Brand.name : `${Brand.name} ${channel.charAt(0).toUpperCase() + channel.slice(1)}`
const summary = `${Brand.tagline.replace(/\.$/, "")}${channel !== "prod" ? ` (${channel})` : ""}`

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<component type="desktop-application">
  <id>${appId}</id>

  <metadata_license>CC0-1.0</metadata_license>
  <project_license>MIT</project_license>

  <name>${productName}</name>
  <summary>${summary}</summary>

  <developer id="xyz.orionx">
    <name>${Brand.maker}</name>
  </developer>

  <description>
    <p>
      ${Brand.name} is the ${Brand.company} coding agent. It helps you write and run code, built by ${Brand.maker}.
    </p>
  </description>

  <launchable type="desktop-id">${appId}.desktop</launchable>

  <content_rating type="oars-1.1" />

  <url type="bugtracker">${Brand.repository}/issues</url>
  <url type="homepage">${Brand.home}</url>
  <url type="vcs-browser">${Brand.repository}</url>
</component>
`

await Bun.write(`resources/${appId}.metainfo.xml`, xml)
console.log(`Generated metainfo for ${channel} at resources/${appId}.metainfo.xml`)
