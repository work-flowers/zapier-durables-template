#!/usr/bin/env node
// Bootstrap a new Zap repo created from work-flowers/zapier-durables-template.
//
// Replaces the __PLACEHOLDER__ tokens across the template's docs, then removes
// itself and SETUP.md. Run once, immediately after `gh repo create --template`.
//
//   node scripts/bootstrap.mjs
//   node scripts/bootstrap.mjs --client "Knoxx Foods" --org Knoxx-Foods \
//     --repo knoxx-code-zaps --account-id 12345678 --owner Dennis
//
// Deliberately dependency-free: a fresh clone has no node_modules.

import { readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { stdin, stdout, argv, exit } from "node:process";

/** Files the placeholders appear in. Missing files are skipped, not an error. */
const TARGETS = ["CLAUDE.md", "README.md"];

/** Placeholder -> { flag, question, validate }. Order is the prompt order. */
const FIELDS = [
  {
    token: "__CLIENT_NAME__",
    flag: "client",
    question: "Client display name (e.g. Knoxx Foods)",
    validate: (v) => (v.trim() ? null : "required"),
  },
  {
    token: "__GITHUB_ORG__",
    flag: "org",
    question: "GitHub org or user that owns this repo (e.g. work-flowers)",
    validate: (v) =>
      /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(v.trim())
        ? null
        : "must be a valid GitHub org/user name",
  },
  {
    token: "__REPO_NAME__",
    flag: "repo",
    question: "Repository name (e.g. knoxx-code-zaps)",
    validate: (v) =>
      /^[A-Za-z0-9._-]+$/.test(v.trim()) ? null : "must be a valid repo name",
  },
  {
    token: "__ZAPIER_ACCOUNT_ID__",
    flag: "account-id",
    question: "Zapier account id (the number in a hooks.zapier.com catch URL)",
    validate: (v) =>
      /^\d+$/.test(v.trim()) ? null : "must be digits only — find it in any catch URL",
  },
  {
    token: "__OWNER_NAME__",
    flag: "owner",
    question: "Who must approve a Zap-affecting merge (e.g. Dennis)",
    validate: (v) => (v.trim() ? null : "required"),
  },
];

function parseFlags(args) {
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith("--")) continue;
    const key = args[i].slice(2);
    const val = args[i + 1];
    if (val === undefined || val.startsWith("--")) {
      console.error(`--${key} needs a value`);
      exit(1);
    }
    out[key] = val;
    i++;
  }
  return out;
}

const flags = parseFlags(argv.slice(2));

// Refuse to run twice: a second run would find no placeholders and silently
// "succeed", which reads as confirmation that the first run worked.
const present = TARGETS.filter((f) => existsSync(f));
if (!present.length) {
  console.error("No template files found. Run this from the repo root.");
  exit(1);
}
const anyPlaceholder = present.some((f) =>
  FIELDS.some((field) => readFileSync(f, "utf8").includes(field.token)),
);
if (!anyPlaceholder) {
  console.error(
    "No __PLACEHOLDER__ tokens left — this repo looks already bootstrapped.\n" +
      "Nothing changed. Edit CLAUDE.md and README.md directly from here.",
  );
  exit(1);
}

const values = {};
const rl = createInterface({ input: stdin, output: stdout });
try {
  for (const field of FIELDS) {
    let v = flags[field.flag];
    while (true) {
      if (v === undefined) v = await rl.question(`${field.question}: `);
      const err = field.validate(v);
      if (!err) break;
      console.error(`  ${err}`);
      v = undefined;
    }
    values[field.token] = v.trim();
  }
} finally {
  rl.close();
}

let edits = 0;
for (const file of present) {
  const before = readFileSync(file, "utf8");
  let after = before;
  for (const [token, value] of Object.entries(values)) {
    after = after.split(token).join(value);
  }
  if (after !== before) {
    writeFileSync(file, after);
    edits++;
    console.log(`  updated ${file}`);
  }
}

// The sync workflow keys off the repo slug to avoid syncing to itself; nothing
// else needs rewriting, since the scripts and workflows are already generic.

for (const f of ["SETUP.md", "scripts/bootstrap.mjs"]) {
  if (existsSync(f)) {
    rmSync(f);
    console.log(`  removed ${f}`);
  }
}

console.log(`\nBootstrapped ${edits} file(s). Remaining manual steps:

  1. Set repo secrets ZAPIER_CLIENT_ID and ZAPIER_CLIENT_SECRET
     (Publish Zaps and verify-zapier-credentials both need them).
  2. Set TEMPLATE_SYNC_TOKEN — a fine-grained PAT with read-only Contents
     access to the template — so shared rules stay in sync. Optional; the
     sync job skips cleanly without it.
  3. Fill in the Connections list in CLAUDE.md before authoring any Zap.
  4. Choose the tooling baseline in CLAUDE.md (MCP or CLI) and delete the other.
  5. Commit.
`);
