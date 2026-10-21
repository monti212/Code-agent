const stage = process.env.SST_STAGE || "dev"

export default {
  url: stage === "production" ? "https://code.uhuruai.co" : `https://${stage}.code.uhuruai.co`,
  // Sign-in for OpenCode Zen, a third-party model gateway U Code users may connect. Not a U Code service.
  console: "https://opencode.ai/auth",
  email: "hello@orionx.xyz",
  github: "https://github.com/monti212/Code-agent",
  headerLinks: [
    { name: "app.header.home", url: "/" },
    { name: "app.header.docs", url: "/docs/" },
  ],
}
