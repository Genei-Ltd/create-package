#!/usr/bin/env node

import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'

const TEMPLATE_REPO = 'Genei-Ltd/ts-package-template'

function run(cmd, opts = {}) {
  execSync(cmd, { stdio: 'inherit', ...opts })
}

function check(cmd) {
  try {
    execSync(cmd, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function printUsage() {
  console.log(
    'Usage: pnpm create @coloop-ai/package <name> ["description"] [--remote <owner/repo>]',
  )
  console.log('')
  console.log('Examples:')
  console.log(
    '  pnpm create @coloop-ai/package my-cool-lib "A really cool library"',
  )
  console.log(
    '  pnpm create @coloop-ai/package my-cool-lib "A really cool library" --remote Genei-Ltd/my-cool-lib',
  )
  console.log('')
  console.log(
    'By default only a local package is scaffolded. Pass --remote <owner/repo>',
  )
  console.log(
    'to also create the GitHub repository and push the initial commit.',
  )
}

// ── Parse arguments ──────────────────────────────────────────────

const argv = process.argv.slice(2)
let remote = null
const positional = []

for (let i = 0; i < argv.length; i++) {
  const arg = argv[i]
  if (arg === '--remote') {
    remote = argv[++i]
    if (remote === undefined) {
      console.error('Error: --remote requires a value in the form <owner>/<repo>.')
      process.exit(1)
    }
  } else if (arg.startsWith('--remote=')) {
    remote = arg.slice('--remote='.length)
  } else if (arg.startsWith('-')) {
    console.error(`Error: Unknown option '${arg}'.`)
    console.log('')
    printUsage()
    process.exit(1)
  } else {
    positional.push(arg)
  }
}

const [name, description = 'A TypeScript package published to @coloop-ai'] =
  positional

if (!name) {
  printUsage()
  process.exit(1)
}

if (remote !== null && !/^[\w.-]+\/[\w.-]+$/.test(remote)) {
  console.error(
    `Error: --remote must be in the form <owner>/<repo>, got '${remote}'.`,
  )
  process.exit(1)
}

// ── Preflight checks ─────────────────────────────────────────────

const requiredCommands = remote ? ['gh', 'git', 'pnpm'] : ['git', 'pnpm']

for (const cmd of requiredCommands) {
  if (!check(`command -v ${cmd}`)) {
    console.error(`Error: '${cmd}' is required but not installed.`)
    process.exit(1)
  }
}

if (existsSync(name)) {
  console.error(`Error: Directory '${name}' already exists.`)
  process.exit(1)
}

if (remote) {
  if (!check('gh auth status')) {
    console.error(
      "Error: GitHub CLI is not authenticated. Run 'gh auth login' first.",
    )
    process.exit(1)
  }

  if (check(`gh repo view ${remote}`)) {
    console.error(`Error: Repository ${remote} already exists on GitHub.`)
    process.exit(1)
  }
}

// ── Clone template locally ───────────────────────────────────────

console.log(`Cloning template ${TEMPLATE_REPO}...`)
run(`git clone --depth 1 https://github.com/${TEMPLATE_REPO}.git ${name}`)
run('git remote remove origin', { cwd: name })

// ── Run init.sh ──────────────────────────────────────────────────

run(
  remote
    ? `./init.sh ${name} "${description}" ${remote}`
    : `./init.sh ${name} "${description}"`,
  { cwd: name },
)

// ── Optionally create the GitHub repo and push ───────────────────

if (remote) {
  console.log(`Creating ${remote} on GitHub and pushing...`)
  run(`gh repo create ${remote} --source . --public --push`, { cwd: name })

  console.log('')
  console.log(`Your package @coloop-ai/${name} is live at:`)
  console.log(`  https://github.com/${remote}`)
} else {
  console.log('')
  console.log(`Your package @coloop-ai/${name} is ready in ./${name}`)
  console.log('')
  console.log('No GitHub repository was created. To set one up later:')
  console.log(`  cd ${name}`)
  console.log('  gh repo create <owner>/<repo> --source . --public --push')
}
