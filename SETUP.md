# Setting up a new Zap repo from this template

This file is deleted by `scripts/bootstrap.mjs`. If you're reading it in a
client repo, bootstrap hasn't been run yet.

## 1. Create the repo

```bash
gh repo create <org>/<repo-name> --template work-flowers/zapier-durables-template --private
```

Use `--template`, not a fork: a fork carries the template's whole commit
history, and a "Use this template" copy starts at one clean commit.

## 2. Bootstrap

```bash
node scripts/bootstrap.mjs
```

It prompts for the client name, GitHub org, repo name, Zapier account id and
approving owner, rewrites `CLAUDE.md` and `README.md`, then deletes itself and
this file. Non-interactive form:

```bash
node scripts/bootstrap.mjs --client "Acme Ltd" --org work-flowers --repo acme-code-zaps --account-id 12345678 --owner Dennis
```

## 3. Repo secrets

| Secret | Needed by | Notes |
| --- | --- | --- |
| `ZAPIER_CLIENT_ID` | `publish-zaps.yml`, `verify-zapier-credentials.yml` | Required, or nothing can publish |
| `ZAPIER_CLIENT_SECRET` | same | Required |
| `TEMPLATE_SYNC_TOKEN` | `sync-shared-rules.yml` | Optional. Fine-grained PAT, read-only Contents on the template repo. Without it the sync job skips cleanly rather than failing |

Run the **Verify Zapier credentials** workflow manually once to confirm the
first two work before authoring a Zap.

## 4. Fill in `CLAUDE.md` before writing any Zap

Blank on purpose and may silently cause damage if left wrong:

- **Tooling baseline** — MCP or CLI. Pick one, delete the other. This is
  deliberately not in the shared rules file so each repo can differ.

## 5. What this template deliberately does NOT include

- **The interactive workflow map** (`scripts/build-map.mjs`, `check-map.yml`,
  `docs/map-overlay.json`). It's genuinely useful, but it carries a per-repo
  curation burden and publishes to GitHub Pages, which isn't automatically
  appropriate for a client repo. To adopt it, copy those three files from
  `work-flowers/zapier-sdk`, change `GITHUB_BASE` in `build-map.mjs`, and add
  the map back to `publish-zaps.yml` — the sync-back step regenerates it there
  so a first publish (which fills in `workflow_id`) can't leave the map stale.
- **Any Zap.** The template ships the pipeline, rules and skills only.

## 6. How the shared rules stay current

`.claude/rules/durables.md` is byte-identical across every Zap repo.
`sync-shared-rules.yml` checks the template daily and opens a PR when it
differs.

**Never fix a repo-specific problem by editing that file** — the next sync
reverts you. Put the exception in `CLAUDE.md`, and fix the shared file
upstream in the template so every repo benefits.
