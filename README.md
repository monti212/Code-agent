<p align="center">
  <a href="https://code.uhuruai.co">
    <img src="packages/web/src/assets/ucode-mark.svg" alt="U Code" width="96" height="96">
  </a>
</p>
<h1 align="center">U Code</h1>
<p align="center">The Uhuru coding agent.</p>

---

U Code is an AI coding agent from [Uhuru AI](https://uhuruai.co), built by OrionX in Gaborone, Botswana. It works in
your terminal, in a desktop app, and in the browser: it reads your project, plans changes, edits files, runs commands
with your permission, and explains what it did.

U Code is built for Uhuru models. If you already pay for OpenAI or Anthropic, you can also bring your own API key for
them.

## Install from source

U Code does not publish packages or installers yet. Install it from source with [Bun](https://bun.sh) 1.4.2 or newer:

```bash
git clone https://github.com/monti212/Code-agent
cd Code-agent
bun install
bun run dev
```

`bun run dev` starts U Code from the checkout. Pass a directory to open another project, for example
`bun run dev ~/code/my-project`.

To build a standalone `ucode` binary for your platform:

```bash
bun run --cwd packages/cli build --single
```

The binary is written under `packages/cli/dist/`. Put it on your `PATH` to run `ucode` anywhere.

Other interfaces have their own scripts: `bun run dev:desktop` for the desktop app and `bun run dev:web` for the web
app.

## Connect Uhuru AI

1. Create an API key at [uhuruai.co](https://uhuruai.co) under **Settings → API Keys**. Keys start with `uhuru_sk_`.
2. Run `ucode auth login`, choose **Uhuru AI**, and paste the key. Or set it in your environment:

   ```bash
   export UHURU_API_KEY=uhuru_sk_...
   ```

3. Start U Code and pick **Uhuru 4.5** with `/models`.

> [!NOTE]
> The Uhuru Public API does not accept tool definitions yet. With an Uhuru model, U Code can answer and write code in
> its replies, but it cannot run tools such as file edits or shell commands until tool support reaches the API.

### Bring your own OpenAI or Anthropic key

If you already pay for OpenAI or Anthropic, connect your own API key with `ucode auth login` or `/connect` in the TUI,
or set `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`. Those models keep their own names and are billed by that provider.
U Code offers no other providers.

## Configure

Project configuration lives in `ucode.json` (or `ucode.jsonc`) and the `.ucode/` directory. Global configuration lives
in `~/.config/ucode/`. U Code also reads files with the upstream names `opencode.json` and `.opencode/`; when both exist,
the `ucode` ones win.

```jsonc title="ucode.jsonc"
{
  "$schema": "https://opencode.ai/config.json",
  "model": "uhuru/uhuru-4.5",
}
```

Environment variables use the `UCODE_` prefix, for example `UCODE_SERVER_PASSWORD` or `UCODE_LOG_LEVEL`.

Full documentation: [code.uhuruai.co/docs](https://code.uhuruai.co/docs).

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and [BRANDING.md](./BRANDING.md) for what carries the U
Code name and what keeps its upstream spelling. Report security issues as described in [SECURITY.md](./SECURITY.md).

## Licence

U Code is built on opencode (MIT). See [LICENSE](./LICENSE).
