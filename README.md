# @coloop-ai/create-package

Scaffold a new @coloop-ai TypeScript package from the [template](https://github.com/Genei-Ltd/ts-package-template).

## Usage

```bash
bun create @coloop-ai/package my-cool-lib "A really cool library"
```

Or with npx:

```bash
npx @coloop-ai/create-package my-cool-lib "A really cool library"
```

## Prerequisites

- [Bun](https://bun.sh)
- [GitHub CLI](https://cli.github.com) (`gh auth login`)
- Write access to the [Genei-Ltd](https://github.com/Genei-Ltd) GitHub org

## What it does

1. Creates a new GitHub repo from the [ts-package-template](https://github.com/Genei-Ltd/ts-package-template)
2. Replaces template placeholders with your package name and description
3. Installs dependencies
4. Builds the package (generates `exports` field via tsdown)
5. Makes an initial commit and pushes

## License

MIT
