# __REPO_NAME__

Source-of-truth repo for __CLIENT_NAME__ Code Zaps on the Zapier Durables platform. One sub-directory per Zap.

<!-- The universal engineering rules for a Zap repo — publishing pipeline, trigger
     handling, determinism guard, empty-ping guard, AI tiers, concurrency — live in
     .claude/rules/durables.md, which loads automatically every session and is kept
     BYTE-IDENTICAL across every Zap repo. This file holds only what is specific to
     __CLIENT_NAME__. Put a universal lesson in the rules file, not here, or it will
     never reach the other repos. -->

Universal rules live in [`.claude/rules/durables.md`](.claude/rules/durables.md) — loaded automatically each session, and byte-identical across every Zap repo. **A new lesson that would be true in any Zap repo belongs there, not in this file.** This file holds only __CLIENT_NAME__-specific facts.

## Workspace facts

- **Zapier account id `__ZAPIER_ACCOUNT_ID__`** — the `<account-id>` in a static catch URL, `https://hooks.zapier.com/hooks/catch/__ZAPIER_ACCOUNT_ID__/<code>/`.
- **Source-of-truth comment prefix** (repo rule 2): `// Source of truth: https://github.com/__GITHUB_ORG__/__REPO_NAME__/tree/main/<zap-name>`
- **Connections.** Record every connection this repo binds, by alias, id and title, and say which system each one points at. Getting this wrong is a silent cross-workspace write.
  <!-- e.g. - `notion_client` — `NotionCLIAPI` connection `<uuid>` (titled `…`). -->
- **Zaps that are private and stay that way** (repo rule 7 grandfathering): _none yet._
- **Zaps pinning a catch URL with `params._zap_static_hook_code`**: _none yet._ Never let that key fall out of their `zap.json`.

## Reference implementations

The shared rules cite these helpers by name; record where this repo's copy lives as soon as one exists.

| Helper | Location |
| --- | --- |
| `isEmptyPing` | _not yet in this repo_ |
| `createItemWithTemplate` | _not yet in this repo_ |
| `daysFromCivil` / `isoDateFromEpochMs` / `daysInMonth` | _not yet in this repo_ |

## Tooling baseline for this repo

<!-- Set this deliberately. It is NOT in the shared rules file precisely because
     it differs per repo, and a shared default would silently override the choice.
     Pick one and delete the other. -->

**Baseline: the Zapier MCP connector.** Use MCP tools (`list_workflows`, `get_workflow_version`, publish tools) as the default path; the Zapier SDK CLI is available but not assumed, so anyone working in this repo can be productive without a CLI login.

<!-- OR:
**Baseline: the Zapier SDK CLI.** Prefer the CLI wherever possible — it's faster and
more cost-effective; fall back to the MCP connector only when the CLI can't do the job.
-->

Either way, **publishing a durable defaults to the merge pipeline** (see `.claude/rules/durables.md`), and any direct `publish-workflow-version`, by CLI or MCP, bypasses PR review.

## Repo-specific notes

- Each Durable directory contains `workflow.ts` (the source as published on Zapier), `zap.json` (workflow ID, current version ID, trigger URL, enabled state, runtime/dependency versions), and `README.md`.
- **Never merge a Zap-affecting PR without __OWNER_NAME__'s explicit go-ahead.** Merging is what deploys.
