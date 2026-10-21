# U Code

Use this guide as the starting point for work involving U Code itself. It
covers the core concepts needed to configure and customize U Code, extend it
with plugins, and build integrations with the U Code SDK, clients, and API.

Full documentation is available at <https://code.uhuruai.co/docs/>. This overview is
only an index of core concepts. Before answering a question about a topic below,
fetch the URL named in that section and use the full page as the source of
truth. Follow links from that page when the question needs more detail. Fetch
<https://code.uhuruai.co/docs/> first when you need to discover the relevant
documentation page.

A machine-readable documentation index is available at
<https://code.uhuruai.co/docs/llms.txt>.

## Version policy

Use only <https://code.uhuruai.co/docs/> as the source of truth, and do not use
general web search to resolve a documentation question when those docs or
linked pages cover it. Configuration files may include the editor schema URL
<https://opencode.ai/config.json>; it exists for editor integration only and
may describe an older schema, so never use it to infer field names or shapes.
If the documentation is missing or contradictory, state the uncertainty or ask
for clarification instead of guessing.

Users migrating from opencode V1 may bring V1 configuration or plugins. Treat
V1 syntax only as migration input; outputs and recommendations must use the
current format.

## [CLI](https://code.uhuruai.co/docs/cli)

For questions about the terminal interface, command-line invocation, `run`,
`mini`, terminal providers, or other CLI behavior, fetch the
[CLI guide](https://code.uhuruai.co/docs/cli) and the relevant page linked from
that section.

CLI and TUI preferences are separate from U Code's server and project
configuration. They live in the global `~/.config/ucode/cli.json`, or
`$XDG_CONFIG_HOME/ucode/cli.json` when `XDG_CONFIG_HOME` is set. There is no
project-local CLI configuration. Most preferences can also be changed from the
TUI by pressing `Ctrl+P` and selecting **Open settings**.

Fetch the full [CLI configuration guide](https://code.uhuruai.co/docs/cli/config)
before editing `cli.json`. It covers terminal-only settings such as themes,
keybindings, terminal plugins, scrolling, attention alerts, diff presentation,
and terminal integration. Do not put these settings in `ucode.json(c)`.

### [Keybinds](https://code.uhuruai.co/docs/cli/keybinds)

Configure keybindings under `keybinds` in `cli.json`. The leader key is the
`keybinds.leader` entry; leader timing is configured separately under
`leader.timeout`. Bindings can use a string, an array of strings, or an object
when event behavior such as `preventDefault` is required. Disable a binding
with `"none"` or `false`.

Never guess a command ID, default binding, or accepted key syntax. Fetch the
full [keybind reference](https://code.uhuruai.co/docs/cli/keybinds), which lists
the current IDs and defaults, before answering or editing a binding.

## [U Code configuration](https://code.uhuruai.co/docs/config)

U Code's server and project configuration uses JSON or JSONC. Include the
published schema so the user's editor can validate fields and provide
autocomplete:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
}
```

Global configuration lives at `~/.config/ucode/ucode.json(c)` and applies
to every project for that user. Project configuration can live in any directory
as `ucode.json(c)` or `.ucode/ucode.json(c)`, including nested packages
in a monorepo.

During ordinary project discovery, U Code searches the current Location
directory and every ancestor through the filesystem root, including directories
above the detected project or repository root. It merges direct
`ucode.json(c)` files from the farthest ancestor to the current directory,
then does the same for `.ucode/ucode.json(c)` files. This means every
discovered `.ucode` config overrides every discovered direct config. Global
filesystem configuration has lower precedence than these discovered documents.

Common configuration fields include `model`, `default_agent`, `permissions`,
`agents`, `commands`, `plugins`, `providers`, `mcp`, `skills`, `instructions`,
`references`, `formatter`, and `lsp`.

This configuration is distinct from `cli.json`. Use the
[CLI configuration guide](https://code.uhuruai.co/docs/cli/config) for terminal
preferences, especially themes and keybindings.

Do not guess field names or shapes. Fetch the V2 configuration guide and its
linked topic guide as the source of truth, and preserve unrelated settings when
editing an existing file. Keep the published `$schema` URL in configuration
examples, but do not fetch it to determine the V2 configuration shape.

See the [full configuration guide](https://code.uhuruai.co/docs/config) for
every field, examples, config locations, and links to dedicated feature guides.

## [MCP servers](https://code.uhuruai.co/docs/mcp-servers)

Configure MCP servers under `mcp.servers`. Prefer the CLI because it preserves
unrelated configuration. Use `--global` when the user asks to set up a service
for themselves without limiting it to the current project; omit it when they
explicitly want project-local configuration.

```sh
ucode mcp add <name> --global --url <remote-url>
ucode mcp list
```

Remote servers use OAuth by default. If `mcp list` reports that a server needs
authentication, tell the user to run `/mcps`, select the server, and sign in.
Do not run `ucode mcp auth` through the shell tool: it starts an interactive
flow whose authorization link can be hidden in background process output.
Use the user-facing MCP interface instead.

Report the server as configured but awaiting sign-in until its connection
status confirms it is connected.

OAuth credentials are stored outside the U Code configuration. Do not ask for or
store an API key when the server supports OAuth. Use header-based credentials
only when OAuth is unavailable or the user explicitly requires them, and use an
environment substitution such as `{env:MCP_API_KEY}` instead of writing a
secret into configuration.

## [V1 to V2 migration](https://code.uhuruai.co/docs/migrate-v1)

For any request to migrate U Code configuration, agents, commands, skills,
plugins, integrations, or other behavior from V1 to V2, read the full
[migration guide](https://code.uhuruai.co/docs/migrate-v1) before acting. In
the repository, its source is `services/www/src/docs/content/migrate-v1.mdx`.

V1 config files and `.ucode/` definitions are intended to remain compatible.
The only intentional breaking changes are the server API and plugin API. Native
V2 config uses more ergonomic shapes, but conversion is optional. When the user
requests conversion, inspect the complete configuration, preserve behavior and
unrelated settings, and apply only the relevant migrations from the guide. For
plugin migrations, fetch and follow both the migration guide and the full
[plugins guide](https://code.uhuruai.co/docs/build/plugins). If non-API V1
functionality fails in V2, use the `report` skill to file it as a compatibility
bug.

## [Plugins](https://code.uhuruai.co/docs/build/plugins)

For questions about creating, configuring, loading, publishing, or migrating
plugins, fetch the full [plugins guide](https://code.uhuruai.co/docs/build/plugins)
before answering. Refer to this guide when the user wants to build a plugin. It
covers hooks, transforms, tools, plugin context capabilities, and package
entrypoints. Plugins can also extend the TUI; for those, fetch the
[CLI plugin guide](https://code.uhuruai.co/docs/build/plugins/cli).
For custom methods and events shared with other plugins or clients, fetch the
[RPC guide](https://code.uhuruai.co/docs/build/plugins/rpc).

## [Service](https://code.uhuruai.co/docs/troubleshooting#check-the-background-service)

U Code uses a client-server architecture. Interfaces such as the TUI connect
to a background U Code service, which owns sessions, configuration, plugins,
permissions, and tool execution.

U Code normally discovers or starts the shared background service
automatically. If the service is stuck or unhealthy, restart it:

```sh
ucode service restart
```

Check its status after restarting:

```sh
ucode service status
```

## [API](https://code.uhuruai.co/docs/api)

U Code exposes an HTTP API from its server. The API is described by an
OpenAPI document available from the running server at `/openapi.json`.

Use U Code's built-in `api` command for local requests. It uses the same
discovery and authentication flow as the TUI and may start the background
service when no compatible healthy service is available. It accepts either an
HTTP method and path or an OpenAPI operation ID.

Call an endpoint with an HTTP method and path:

```sh
ucode api get /api/status
```

Pass a request body with `--data` or `-d`, and additional headers with
`--header` or `-H`:

```sh
ucode api post /api/example --data '{"key":"value"}'
ucode api get /api/example --header 'X-Example:value'
```

Request bodies default to `Content-Type: application/json`. When U Code is
connected to an explicit server instead of its managed background service, use
the same configured server and authentication context rather than constructing
an unauthenticated request separately.

See the [full API reference](https://code.uhuruai.co/docs/api) for available
endpoints, parameters, request bodies, and response schemas. The
raw [OpenAPI specification](https://code.uhuruai.co/docs/openapi.json) is also
available for code generation and other tooling.

## [Client](https://code.uhuruai.co/docs/build/client)

For questions about connecting an application to U Code over the network,
fetch the full [client guide](https://code.uhuruai.co/docs/build/client) before
answering.

`@opencode/client` is the generated TypeScript client for the U Code HTTP
API. Its methods and types come from the same contract as the API reference.
The default entrypoint exposes Promise-based resource clients and async
iterables for streaming endpoints. The `@opencode/client/effect` entrypoint
exposes typed Effects, Streams, and decoded U Code schema values. Its
`Service` API can discover, start, stop, and authenticate with the local
background service from a Node application.

## [SDK](https://code.uhuruai.co/docs/build/sdk)

For questions about embedding U Code directly in an application, fetch the
full [SDK guide](https://code.uhuruai.co/docs/build/sdk) before answering. The SDK
hosts U Code in the application without opening an HTTP listener.

Use the [Effect SDK guide](https://code.uhuruai.co/docs/build/sdk/effect) for
Effect applications. For Cloudflare Durable Objects, use the
[Cloudflare SDK guide](https://code.uhuruai.co/docs/build/sdk/cloudflare).

## [Troubleshooting](https://code.uhuruai.co/docs/troubleshooting)

U Code runs a client and a background server. Start by determining whether a
problem belongs to the client, the shared server, or one project.

- Check the service with `ucode service status` and verify the API with
  `ucode api get /api/status`.
- Compare with `ucode --standalone`, which runs the TUI with a private
  server, to isolate shared-service issues.
- Inspect `~/.local/share/ucode/log/opencode.log`. Filter `role=cli` for
  client startup and `role=server` for sessions, providers, plugins,
  permissions, and tools.
- Run one reproduction with `UCODE_LOG_LEVEL=DEBUG` when normal logs are not
  sufficient.
- Do not delete or edit the database, service registration, or service config
  while diagnosing a problem. Back up persistent data before inspecting it
  with external tools.
- Redact API keys, authorization headers, prompts, file contents, and other
  sensitive data before sharing diagnostics.

See the [full troubleshooting guide](https://code.uhuruai.co/docs/troubleshooting)
for service lifecycle commands, API inspection, log locations, explicit server
connections, issue-reporting details, and local development paths.
