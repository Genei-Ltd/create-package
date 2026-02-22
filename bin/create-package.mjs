#!/usr/bin/env node

import { execSync } from 'node:child_process'

const TEMPLATE_REPO = 'Genei-Ltd/ts-package-template'
const GITHUB_ORG = 'Genei-Ltd'

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

// ── Parse arguments ──────────────────────────────────────────────

const [name, description = 'A TypeScript package published to @coloop-ai'] =
  process.argv.slice(2)

if (!name) {
  console.log('Usage: bun create @coloop-ai/package <name> ["description"]')
  console.log('')
  console.log(
    'Example: bun create @coloop-ai/package my-cool-lib "A really cool library"',
  )
  process.exit(1)
}

// ── Preflight checks ─────────────────────────────────────────────

for (const cmd of ['gh', 'git', 'bun']) {
  if (!check(`command -v ${cmd}`)) {
    console.error(`Error: '${cmd}' is required but not installed.`)
    process.exit(1)
  }
}

if (!check('gh auth status')) {
  console.error(
    "Error: GitHub CLI is not authenticated. Run 'gh auth login' first.",
  )
  process.exit(1)
}

// ── Create repo from template ────────────────────────────────────

console.log(`Creating ${GITHUB_ORG}/${name} from template...`)
run(
  `gh repo create ${GITHUB_ORG}/${name} --template ${TEMPLATE_REPO} --clone --public`,
)

// ── Run init.sh ──────────────────────────────────────────────────

run(`./init.sh ${name} "${description}"`, { cwd: name })

// ── Push ─────────────────────────────────────────────────────────

console.log('Pushing to origin...')
run('git push -u origin main --force', { cwd: name })

console.log('')
console.log(`Your package @coloop-ai/${name} is live at:`)
console.log(`  https://github.com/${GITHUB_ORG}/${name}`)
