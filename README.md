# __REPO_NAME__

Source-of-truth repo for **__CLIENT_NAME__** Code Zaps on the Zapier Durables platform. One sub-directory per Zap.

## Repo structure

One sub-directory per Zap. Each Durable directory contains:

| File | Purpose |
| --- | --- |
| `workflow.ts` | The durable workflow source, as published on Zapier |
| `zap.json` | Deployment metadata: workflow ID, current version ID, trigger URL, runtime/dependency versions |
| `README.md` | Brief description of the Zap: what it does, trigger, a Mermaid diagram of the workflow, maintainer notes |

A Zap with an AI step additionally carries a `*-prompt.md` holding the prompt (repo rule 6).

Repo-wide helper scripts live in [`scripts/`](scripts/):

| Script | Purpose |
| --- | --- |
| [`detect-changed-zaps.mjs`](scripts/detect-changed-zaps.mjs) | Works out which Zap deployments a diff affects. Used by the publish pipeline. |
| [`publish-changed-zaps.mjs`](scripts/publish-changed-zaps.mjs) | Republishes every affected deployment on merge to `main` and commits the new `current_version_id` back into `zap.json`. `--audit` compares declared triggers against live ones without publishing. |
| [`check-prompts.mjs`](scripts/check-prompts.mjs) | Verifies every `*-prompt.md` matches the copy embedded in its Zap's source (`--fix` re-injects). |

## Rules

The engineering rules for this repo live in two places:

- [`.claude/rules/durables.md`](.claude/rules/durables.md) — universal rules for any Zapier Durables repo. **Byte-identical across every Zap repo**, synced from the template; don't edit it here for a repo-specific reason.
- [`CLAUDE.md`](CLAUDE.md) — facts specific to __CLIENT_NAME__: account id, connections, reference implementations, tooling baseline.

Both load automatically into every Claude Code session.

## Publishing

Edit `workflow.ts` on a branch → open a PR → merge to `main`. The [`Publish Zaps` workflow](.github/workflows/publish-zaps.yml) republishes automatically and syncs `zap.json` back. **Merging is deploying.**

## Zaps

| Zap | Status | Description |
| --- | --- | --- |
| _none yet_ | | |
