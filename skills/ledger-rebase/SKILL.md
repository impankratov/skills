---
name: ledger-rebase
description: Ledger-first rebase overlay — mandatory conflict ledgers, project-doc verify, fallout commit, optional MR thread.
disable-model-invocation: true
---

# ledger-rebase

Overlay on [`git-rebase`](https://github.com/pedronauck/skills/blob/main/skills/mine/git-rebase/SKILL.md) (pedronauck/skills). Activate `git-rebase` when available (Step 0).

## Invoke

`ledger-rebase`, `ledger rebase`, `rebase-with-ledger`, `rebase with ledger`.

## Non-negotiables

- **Ledger-first** — for each conflicted path: complete ledger on disk **before** `git add` on that path; **ledger gate** (below) **before** every `git rebase --continue`.
- **Ledgers stay untracked** — `N. CONFLICT-*.md` at repo root; hand off to human for review; stage and commit only resolved source paths.
- **Ledger naming** — `N. CONFLICT-<slug>.md`; `N` = encounter ordinal across the whole run (including post-rebase ledgers).
- **One ledger per conflicted path** (content or modify/delete), not per hunk.
- **Full paths** in every ledger — complete repo-relative paths; renames list both old and new.
- **Key code in every ledger** — fenced snippets of decisive hunks (HEAD / Incoming / Landed); prose-only ledgers are incomplete.
- **Union bias** — keep both sides' independent additions; ours/theirs only when ledger **Rationale** says union failed.
- **Serial resolve** — finish editing a path, then `git add` it.
- **Push** only when the user explicitly asks.

## Ledger gate

Run **before** every `git rebase --continue` and **before** declaring Step 1 or the skill done.

For **every** path that was unmerged at the current stop (or across the whole run when finishing):

1. Untracked `N. CONFLICT-<slug>.md` exists at the **repository root** (match path to ledger via **Paths** in the file).
2. Ledger has all required sections from [ledger-template.md](ledger-template.md) filled — especially **Paths**, **Key code** (with snippets), **Resolution**, **Rationale**.
3. Ledger paths are **not** staged (`git diff --cached --name-only` contains zero `CONFLICT-*.md`).

Check unmerged paths:

```bash
git diff --name-only --diff-filter=U
```

List ledgers at repo root:

```bash
ls -1 | grep -E '^[0-9]+\. CONFLICT-.*\.md$' || true
```

**Gate passes** only when unmerged list is empty for this stop, ledger count for handled paths matches (one ledger per conflicted path), and every ledger passes the section check above. A green rebase with zero ledgers after conflicts = **Step 1 incomplete** — go back and write ledgers.

## Execution

### Step 0 — `git-rebase`

Read and follow `git-rebase` for backup, fetch, strategy, conflict pauses, continue/abort.

**Completion**: backup branch exists; agreed target ref named; rebase started (`git status` shows rebase in progress) or user explicitly skipped `git-rebase` and rebase already running.

### Step 1 — Ledger-first resolve (each stop)

At each conflict pause, list unmerged paths:

```bash
git diff --name-only --diff-filter=U
# plus modify/delete unmerged paths from git status if needed
```

For **each** path in that list, in order:

1. **Ledger** — next `N` → write `N. CONFLICT-<slug>.md` at repo root from [ledger-template.md](ledger-template.md) (Non-negotiables satisfied). **Stop here until the file exists and sections are filled.**
2. **Resolve** — edit the source path (union bias; `git-rebase` patterns when loaded).
3. **Stage** — `git add` only that resolved source path(s).
4. Repeat for every path in this stop.

Then run **Ledger gate**. Only if it passes:

5. **Continue** — `git rebase --continue` (or equivalent from `git-rebase`).

Repeat the whole stop cycle until rebase finishes.

**Completion**: rebase finished; ledger gate passes for the full run; every conflicted path has exactly one complete untracked ledger; zero ledger files staged; you can list every `N. CONFLICT-*.md` path.

### Step 2 — Verify

Read project markdown (`AGENTS.md`, `CONTRIBUTING.md`, `README.md`, `docs/`, other workflow `*.md`) for verify commands; cross-check format, lint, typecheck, build, unit tests, integration tests, e2e tests, other. Run every command collected (default order when docs silent: format → lint → typecheck → build → unit → integration → e2e → other). Fix before Step 3; conflict-adjacent fixes ledger-first (`N. CONFLICT-post-rebase-<slug>.md`). **Completion**: all collected commands green.

### Step 3 — Commit fallout

Commit all remaining tracked changes from resolution/verify. Use `git-commit` skill or project commit docs. Unstage any ledger paths before commit (Non-negotiables).

**Completion**: clean tracked tree; only untracked `N. CONFLICT-*.md` (plus unrelated pre-existing untracked).

### Step 4 — Hand off ledgers

Report rebase + verify green. **List every** untracked `N. CONFLICT-*.md` path (full repo-relative paths from ledgers). If conflicts occurred and the list is empty, Step 1 is incomplete — write ledgers first.

**Completion**: user has the full ledger path list.

### Step 5 — MR/PR thread? (branch)

Ask whether to open a new MR/PR discussion thread. If yes — [mr-pr-formatting.md](mr-pr-formatting.md) (inline all ledgers; hardest-conflicts summary first). Forge: `glab` / `gh`; `git-pr` / `glab` skills as needed.

**Completion**: user answered; if yes, thread URL reported.

## Done

Steps 0–4 complete (including ledger gate + full ledger path list); Step 5 answered.
