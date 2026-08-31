---
name: ledger-rebase
description: Ledger rebase overlay — conflict ledgers, project-doc verify, fallout commit, optional MR thread.
disable-model-invocation: true
---

# ledger-rebase

Overlay on [`git-rebase`](https://github.com/pedronauck/skills/blob/main/skills/mine/git-rebase/SKILL.md) (pedronauck/skills). Activate `git-rebase` when available (Step 0).

## Invoke

`ledger-rebase`, `ledger rebase`, `rebase-with-ledger`, `rebase with ledger`.

## Non-negotiables

- **Ledgers stay untracked** — `N. CONFLICT-*.md` at repo root; hand off to human for review; stage and commit only resolved source paths.
- **Ledger naming** — `N. CONFLICT-<slug>.md`; `N` = encounter ordinal across the whole run (including post-rebase ledgers).
- **One ledger per conflicted path** (content or modify/delete), not per hunk.
- **Full paths** in every ledger — complete repo-relative paths; renames list both old and new.
- **Key code in every ledger** — fenced snippets of decisive hunks (HEAD / Incoming / Landed); prose-only ledgers are incomplete.
- **Union bias** — keep both sides' independent additions; ours/theirs only when ledger **Rationale** says union failed.
- **Serial resolve** — finish editing a path, then `git add` it.
- **Push** only when the user explicitly asks.

## Execution

### Step 0 — `git-rebase`

Read and follow `git-rebase` for backup, fetch, strategy, conflict pauses, continue/abort.

**Completion**: backup branch exists; agreed target ref named; rebase started (`git status` shows rebase in progress) or user explicitly skipped `git-rebase` and rebase already running.

### Step 1 — Ledger + resolve each stop

For each path in `git diff --name-only --diff-filter=U` (and modify/delete unmerged):

1. Next `N` → create `N. CONFLICT-<slug>.md` from [ledger-template.md](ledger-template.md) (Non-negotiables satisfied).
2. Resolve (union bias; `git-rebase` patterns when loaded).
3. `git add` only resolved source path(s).
4. Continue rebase when stop is clear.

**Completion**: no unmerged paths; each conflicted path has a complete untracked ledger; rebase finished; zero ledger files staged.

### Step 2 — Verify (project docs)

Read docs that mandate verify (e.g. `AGENTS.md`, `CONTRIBUTING.md`, `docs/`). Run **every** command they specify.

Fix rebase-caused failures. Conflict-adjacent fixes → continue `N` sequence (`N. CONFLICT-post-rebase-<slug>.md`); same ledger rules.

**Completion**: every doc-mandated verify command exits 0 (flaky e2e ok if final run green).

### Step 3 — Commit fallout

Commit all remaining tracked changes from resolution/verify. Use `git-commit` skill or project commit docs. Unstage any ledger paths before commit (Non-negotiables).

**Completion**: clean tracked tree; only untracked `N. CONFLICT-*.md` (plus unrelated pre-existing untracked).

### Step 4 — Hand off ledgers

Report rebase + verify green; list untracked `N. CONFLICT-*.md` paths for human review.

**Completion**: user has path list.

### Step 5 — MR/PR thread? (branch)

Ask whether to open a new MR/PR discussion thread. If yes — [mr-pr-formatting.md](mr-pr-formatting.md) (inline all ledgers; hardest-conflicts summary first). Forge: `glab` / `gh`; `git-pr` / `glab` skills as needed.

**Completion**: user answered; if yes, thread URL reported.

## Done

Steps 0–4 complete; Step 5 answered.
