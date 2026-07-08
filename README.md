# @coloop-ai/create-package

Scaffold a new @coloop-ai TypeScript package from the [template](https://github.com/Genei-Ltd/ts-package-template).

## Usage

```bash
pnpm create @coloop-ai/package my-cool-lib "A really cool library"
```

Or with npx:

```bash
npx @coloop-ai/create-package my-cool-lib "A really cool library"
```

By default this only scaffolds a local package. No GitHub repository is created.

To also create the GitHub repository and push the initial commit, pass `--remote`:

```bash
pnpm create @coloop-ai/package my-cool-lib "A really cool library" --remote Genei-Ltd/my-cool-lib
```

The repository is created public under the given `owner/repo`.

## Prerequisites

- [pnpm](https://pnpm.io)
- git

With `--remote`, additionally:

- [GitHub CLI](https://cli.github.com) (`gh auth login`)
- Write access to the target GitHub owner or org

## What it does

1. Clones the [ts-package-template](https://github.com/Genei-Ltd/ts-package-template) locally
2. Replaces template placeholders with your package name, description, and repo
3. Installs dependencies
4. Builds the package (generates `exports` field via tsdown)
5. Makes an initial commit
6. With `--remote owner/repo`: creates the GitHub repository and pushes

## License

MIT
