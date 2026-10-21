# U Code Desktop

The U Code Desktop app, built with Electron.

## Development

```bash
bun install
bun dev
```

## Build

Run the `build` script to build the app's JS assets, then `package` to
bundle the assets as an application. The resulting app will be in `dist/`.

```bash
bun run build && bun run package
```

Production builds require a prebuilt V2 CLI distribution. The release workflow supplies the artifact from the same run:

```bash
OPENCODE_CHANNEL=prod OPENCODE_CLI_DIST=/absolute/path/to/packages/cli/dist bun run build
OPENCODE_CHANNEL=prod bun run package
```

Set `OPENCODE_CLI_TARGET` when packaging for a different architecture. The CLI is placed outside `app.asar` in the
application's resources directory, and packaging fails if it is missing.

CLI preparation uses these channel rules:

| Channel                                | Without `OPENCODE_CLI_DIST`                       | With `OPENCODE_CLI_DIST`                     |
| -------------------------------------- | ------------------------------------------------- | -------------------------------------------- |
| `dev`, `local`, unset, or unrecognized | Fail: U Code CLI packages are not published yet   | Copy the supplied CLI; fail if it is missing |
| `beta`                                 | Fail: U Code CLI packages are not published yet   | Copy the supplied CLI; fail if it is missing |
| `prod`, `latest`                       | Fail before changing resources                    | Copy the supplied CLI; fail if it is missing |

Build the CLI first with `bun run --cwd packages/cli build --single` and point `OPENCODE_CLI_DIST` at
`packages/cli/dist`.

`bun dev` is separate from packaging: it uses local renderer/server mode, the dev app identity, and the CLI source by
default. `bun dev --download-server <version>` needs a published U Code CLI package and fails until one exists. Neither
path requires `OPENCODE_CLI_DIST` or runs the production prebuild.
