---
name: ledger-rebase
description: Ledger-first rebase — conflict ledgers on disk, verify, fallout commit; ask-gate before any MR comment; ledger-thread only (one full ledger per discussion) plus one summary thread flagging worth-verifying conflicts.
disable-model-invocation: true
---

# ledger-rebase

Overlay on [`git-rebase`](https://github.com/pedronauck/skills/blob/main/skills/mine/git-rebase/SKILL.md) (pedronauck/skills). Activate `git-rebase` when available (Step 0).

## Invoke

`ledger-rebase`, `ledger rebase`, `rebase-with-ledger`, `rebase with ledger`.

## Non-negotiables

- **Ledger-first** — for each conflicted path: complete ledger on disk **before** `git add` on that path; **ledger gate** (below) **before** every `git rebase --continue`.
- **Ledgers stay untracked** — `N. CONFLICT-*.md` at repo root; hand off to human for review; stage and commit only resolved source paths.
- **Ledger naming** — `N. CONFLICT-<slug>.md`; `N` = encounter ordinal across the whole run (including post-rebase ledgers). Summary is assembled last and takes the next `N`: `N. LEDGER-REBASE-SUMMARY.md` — not a conflicted path; excluded from per-path counts.
- **One ledger per conflicted path** (content or modify/delete), not per hunk.
- **Full paths** in every ledger — complete repo-relative paths; renames list both old and new.
- **Code in every ledger** — fenced snippets of decisive hunks (HEAD / Incoming / Landed); prose-only ledgers are incomplete.
- **Union bias** — keep both sides' independent additions; ours/theirs only when the resolution's **Rationale** line says union failed.
- **Serial resolve** — finish editing a path, then `git add` it.
- **Worth verifying** — every ledger's closing **Worth verifying** line is `⚠️ yes` (carries a why-line) or `✅ no`; the summary thread flags `⚠️ yes` conflicts.
- **Push** only when the user explicitly asks.
- **ask-gate** — zero MR/PR comments until Step 5 user says yes. `git push --force-with-lease` is not a comment; it satisfies "update MR" by refreshing the diff only.
- **ledger-thread** — when Step 5 is yes: one discussion thread per `N. CONFLICT-*.md`; body = that ledger's full content per [mr-pr-formatting.md](mr-pr-formatting.md). One thread, one ledger — plus the **summary thread** posted last (index only; ledger references become links to their threads).

## Ledger gate

Run **before** every `git rebase --continue` and **before** declaring Step 1 or the skill done. Items 1–3 check a stop's ledgers. Item 4 is the whole-run check and applies only once the summary exists — after Step 2 assembles it (the summary must be the *last* ledger artifact, so it always covers post-rebase ledgers).

For **every** path that was unmerged at the current stop (or across the whole run when finishing):

1. Untracked `N. CONFLICT-<slug>.md` exists at the **repository root** (match path to ledger via its bold path line).
2. Ledger has all required blocks from [ledger-template.md](ledger-template.md) filled — especially the bold path line, **Context**, **Code** (with snippets; **Landed** when the tree is authored), and the closing **Worth verifying** line (`⚠️ yes` carries a why-line, or `✅ no`).
3. Ledger paths are **not** staged (`git diff --cached --name-only` contains zero `CONFLICT-*.md`).
4. **Whole-run only:** untracked `N. LEDGER-REBASE-SUMMARY.md` exists at repo root, is **not** staged, and covers every `N. CONFLICT-*.md` — one entry per ledger, flags read from the ledgers, not re-judged.

Check unmerged paths:

```bash
git diff --name-only --diff-filter=U
```

List ledgers at repo root:

```bash
ls -1 | grep -E '^[0-9]+\. CONFLICT-.*\.md$' || true
```

**Gate passes** only when unmerged list is empty for this stop, ledger count for handled paths matches (one ledger per conflicted path), every ledger passes the section check above, and (whole-run) the summary covers every ledger. A green rebase with zero ledgers after conflicts = **Step 1 incomplete** — go back and write ledgers.

## Execution

### Step 0 — `git-rebase`

Read and follow `git-rebase` for backup, fetch, strategy, conflict pauses, continue/abort.

**Target ref** — name the branch you rebase onto before starting:

1. User, handoff, or open MR/PR for this branch
2. `git branch -vv`; `git log --oneline --graph --decorate -20`; divergence against plausible candidates (`origin/<candidate>..HEAD`, `HEAD..origin/<candidate>`)
3. Still unclear → ask user

Use `origin/<target>` (or the named ref) for fetch, rebase, and verify `--base` flags.

**Completion**: backup branch exists; target ref named; rebase started (`git status` shows rebase in progress) or user explicitly skipped `git-rebase` and rebase already running.

### Step 1 — Ledger-first resolve (each stop)

At each conflict pause, list unmerged paths:

```bash
git diff --name-only --diff-filter=U
# plus modify/delete unmerged paths from git status if needed
```

For **each** path in that list, in order:

1. **Ledger** — next `N` → write `N. CONFLICT-<slug>.md` at repo root from [ledger-template.md](ledger-template.md) (Non-negotiables satisfied). **Stop here until the file exists and its blocks are filled.**
2. **Resolve** — edit the source path (union bias; `git-rebase` patterns when loaded).
3. **Stage** — `git add` only that resolved source path(s).
4. Repeat for every path in this stop.

Then run **Ledger gate**. Only if it passes:

5. **Continue** — `git rebase --continue` (or equivalent from `git-rebase`).

Repeat the whole stop cycle until rebase finishes.

**Completion**: rebase finished; ledger gate passes for the full run; every conflicted path has exactly one complete untracked ledger; zero ledger files staged; you can list every `N. CONFLICT-*.md` path. (The summary is not assembled here — post-rebase ledgers from Step 2 would miss it.)

### Step 2 — Verify

Read project markdown (`AGENTS.md`, `CONTRIBUTING.md`, `README.md`, `docs/`, other workflow `*.md`) for verify commands; cross-check format, lint, typecheck, build, unit tests, integration tests, e2e tests, other. Run every command collected (default order when docs silent: format → lint → typecheck → build → unit → integration → e2e → other). Fix before Step 3; conflict-adjacent fixes ledger-first (`N. CONFLICT-post-rebase-<slug>.md`).

**Assemble the summary only after every command is green** — the last ledger artifact, so no post-rebase ledger can appear after it: `N. LEDGER-REBASE-SUMMARY.md` at repo root (next `N` after the last ledger). A numbered list — one item per ledger, encounter order, using that ledger's `N` as the list marker: `N. CONFLICT-<slug>`, with `⚠️` appended when that ledger's **Worth verifying** flags `⚠️ yes` (no mark on `✅ no`). No paths, no why-lines — the slug *is* the filename, and the linked thread carries everything else. Mirror the flags verbatim, don't re-judge them.

**Completion**: all collected commands green; summary assembled at repo root and covers every `N. CONFLICT-*.md` (conflicted + post-rebase); summary untracked.

### Step 3 — Commit fallout

Commit all remaining tracked changes from resolution/verify. Use `git-commit` skill or project commit docs. Unstage any ledger paths before commit (Non-negotiables).

**Completion**: clean tracked tree; only untracked `N. CONFLICT-*.md` and `N. LEDGER-REBASE-SUMMARY.md` (plus unrelated pre-existing untracked).

### Step 4 — Hand off ledgers

Report rebase + verify green **in chat only**. List every untracked `N. CONFLICT-*.md` path (full repo-relative paths from ledgers) **and** the `N. LEDGER-REBASE-SUMMARY.md` path. If conflicts occurred and the ledger list is empty, Step 1 is incomplete — write ledgers first.

**Completion**: user has the full ledger + summary path list in chat; no MR/PR comments posted.

### Step 5 — ask-gate → ledger-thread?

**Stop. Ask the user** (exact intent, one question):

> Post conflict ledgers to the MR/PR as separate discussion threads (one full ledger per thread) plus a summary thread flagging which are worth verifying?

Wait for yes or no. **ask-gate**: until they answer, run no `glab mr note`, `gh pr comment`, or other MR/PR discussion API.

| Answer | Action |
|--------|--------|
| **No** | Skill done. MR refresh = push only (if already authorized). |
| **Yes** | Post **ledger-thread** for each `N. CONFLICT-*.md` in order, then the **summary thread** last — read [mr-pr-formatting.md](mr-pr-formatting.md). Forge: `glab` / `gh`; `git-pr` / `glab` skills as needed. Report every thread URL (including the summary's). |

**Completion**: user answered. If yes: one thread URL per ledger plus one for the summary; thread count equals ledger count + 1.

## Done

Steps 0–4 complete (including ledger gate + full ledger & summary path list in chat); Step 5 answered; ask-gate respected.
