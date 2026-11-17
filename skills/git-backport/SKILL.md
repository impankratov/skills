---
name: git-backport
description: >
  Port a merged MR or PR onto another branch line per project conventions.
  Use when the user asks to backport, forward-port, or cherry-pick a change
  onto another branch.
---

# git-backport

Port from **source line** to **target branch**, then hand off to `git-pr` for the MR.

## Execution

### Step 1 — Read project guidelines (HARD GATE)

You MUST find and read the project's port/backport documentation **in full** before proceeding. If none exists, use the defaults in Steps 2–3.

- Never pass a `limit` (or equivalent partial read) on any port/backport doc file.
- Search the repo for all related docs (`*backport*`, `*forward*`, `*cherry*`, `*release*`) and read each match that applies to cross-line ports.
- Read the primary procedure end-to-end when present (branch naming, which commits to pick, cherry-pick vs patch, allowed source/target pairs, title/body hints for the port MR).
- Pin the project's **integration branch** (default line: `main`, `master`, or what docs name) and how it labels release or maintenance branches.

**Proof of work (required in your first port reply):** one line listing the doc files read and sections used, e.g. "Read BACKPORT.md: cherry-pick range, branch prefix". Name only the files you actually read.

**Completion**: Allowed source/target rules, commit selection, branch naming, port workflow, and integration branch identified.

### Step 2 — Resolve the source change

Identify what to port from user input (PR/MR URL or number, source branch or line, or explicit SHAs).

**Current-branch default:** User named no source and checkout is **not** on the integration branch → source is **this branch** (its PR/MR if any, else commits on the branch).

- Resolve the PR/MR for that branch when one exists (`gh pr view`, `glab mr view`, or the project's CLI).
- Confirm merged-on-line when the port expects a merge (or follow the doc for open branches).
- Record the SHAs or range to apply (squash merge commit, branch commits, or per-doc list).
- Record the **source line** and original PR/MR id for the port MR.

Explicit PR, branch, or SHAs from the user override the current-branch default.

Only ask the user when the source is ambiguous or the doc requires a choice you cannot infer.

**Completion**: Source PR/MR (if any), source line, and commit set to port pinned.

### Step 3 — Resolve the target

Determine the **target branch** from user input, project rules, and the **base branch of the source PR/MR** when the user did not name a target.

**Default from the source PR/MR base branch** (project docs override when they define the pair):

| Source PR/MR base | Port target |
|-------------------|-------------|
| Release or maintenance line | Integration branch |
| Integration branch | Another line — ask the user which (e.g. `release/x.y`) |

- Fetch remotes so the target tip is current.
- Confirm the source→target pair is allowed by project docs when they restrict direction.
- Name the port branch per project convention (default: `backport/<pr>-<target-short>` or what the doc requires; use the project's forward-port prefix when the doc distinguishes direction).

**Completion**: Target branch, remote tip, and port branch name ready.

### Step 4 — Create the port branch

Create and check out the port branch from the target tip using the project's branch tooling (plain `git` or Worktrunk `wt` when the repo is managed).

**Completion**: Port branch exists at the correct base commit on the target line.

### Step 5 — Apply the port

Apply the pinned commits using the method the project's doc requires (typically `git cherry-pick`).

- Pick in doc order; use `-x` or equivalent only when required.
- On conflicts: resolve to preserve the intended fix on the target base; stage and continue. Resolve on the target base only — no unrelated history rewrites or global git config changes.
- If the doc forbids cherry-pick for this case, follow its alternate path (patch, manual port) instead.

**Completion**: Ported changes committed on the port branch (or a clean working tree ready to commit per doc).

### Step 6 — Open the port MR/PR via git-pr

Load the `git-pr` skill and run its execution **from Step 2 onward** on the current port branch, with MR/PR base = the **target branch** from Step 3.

**Completion**: `git-pr` completion criteria met (URL reported).