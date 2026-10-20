---
name: ledger-rebase
description: Ledger-first rebase — conflict ledgers on disk, verify, fallout commit; ask-gate before any MR comment; ledger-thread only (one folded ledger per discussion) plus one summary thread mirroring the ⚠️ conflicts.
disable-model-invocation: true
---

# ledger-rebase

Overlay on [`git-rebase`](https://github.com/pedronauck/skills/blob/main/skills/mine/git-rebase/SKILL.md) (pedronauck/skills). Activate `git-rebase` when available (Step 0).

## Invoke

`ledger-rebase`, `ledger rebase`, `rebase-with-ledger`, `rebase with ledger`.

## Non-negotiables

- **Ledger-first** — for each conflicted path: complete ledger on disk **before** `git add` on that path; ledger gate **stop pass** (below, items 1–3) **before** every `git rebase --continue`; **whole-run pass** (items 1–4) after the summary exists (Step 2).
- **Ledgers stay untracked** — `N.CONFLICT-*.md` at repo root; hand off to human for review; stage and commit only resolved source paths.
- **Ledger naming** — `N.CONFLICT-<slug>.md`; `N` = encounter ordinal across the whole run (including post-rebase ledgers). Summary is assembled last and is **not** numbered: `LEDGER-REBASE-SUMMARY.md` — not a conflicted path; excluded from per-path counts.
- **One ledger per conflicted path** (content or modify/delete), not per hunk.
- **Full paths** in every ledger — complete repo-relative paths; a rename carries both filenames, old and new, in the Code block headers.
- **Code in every ledger** — block 3 in [ledger-template.md](ledger-template.md): **HEAD** and **Incoming**, each with a fenced decisive snippet.
- **Landed in every ledger** — block 4 in [ledger-template.md](ledger-template.md) (verbatim / union / authored branches).
- **Union bias** — keep both sides' independent additions; ours/theirs only when the resolution's **Rationale** line says union failed.
- **Serial resolve** — finish editing a path, then `git add` it.
- **Flag in the title** — block 1 in [ledger-template.md](ledger-template.md): exactly one emoji (☑️ verbatim vs ⚠️ authored), set when **Landed** is filled; **Landed** names the outcome, the emoji classifies it for the summary index.
- **Onto once** — the rebase target is written once as **Onto:** in the summary, never per ledger.
- **Push** only when the user explicitly asks — the Step 5 **yes** is that ask; push **before** any thread.
- **ask-gate** — zero MR/PR comments until Step 5 user says yes. `git push --force-with-lease` is not a comment — it refreshes the diff.
- **ledger-thread** — when Step 5 is yes, **after** the push: one discussion thread per `N.CONFLICT-*.md`; body = that ledger folded whole, title into the `<summary>`, per [mr-pr-formatting.md](mr-pr-formatting.md). One thread, one ledger — plus the **summary thread** posted last (index only; ledger references become links to their threads).

## Ledger gate

Run **before** every `git rebase --continue`. Two passes — do not mix them:

- **Stop pass** (Step 1, each conflict stop): items **1–3** only. Item 4 does not apply yet.
- **Whole-run pass** (after Step 2 assembles the summary): items **1–4**. Item 4 is the summary check and exists only once `LEDGER-REBASE-SUMMARY.md` is written (the summary must be the *last* ledger artifact, so it always covers post-rebase ledgers).

Also run the whole-run pass before declaring Steps 2–4 or **Done** complete.

**Items 1–3** — for every conflicted path in scope (this stop, or the full run when checking item 4):

1. Untracked `N.CONFLICT-<slug>.md` exists at the **repository root** (match path to ledger via its `**file:**` line).
2. Ledger has all four required blocks in [ledger-template.md](ledger-template.md) **Required blocks** filled (blocks 1–4).
3. Ledger paths are **not** staged (`git diff --cached --name-only` contains zero `CONFLICT-*.md`).

**Item 4** — whole-run pass only (after `LEDGER-REBASE-SUMMARY.md` exists):

4. Untracked `LEDGER-REBASE-SUMMARY.md` exists at repo root, is **not** staged, and covers every `N.CONFLICT-*.md` — its header, then **Onto:**, then one entry per ledger, each linking its ledger file; flags read from the ledger titles, not re-judged.

Check unmerged paths:

```bash
git diff --name-only --diff-filter=U
```

List ledgers at repo root:

```bash
ls -1 | grep -E '^[0-9]+\.CONFLICT-.*\.md$' || true
```

**Stop pass** when the unmerged list is empty for this stop, ledger count matches handled paths (one ledger per conflicted path), and every ledger satisfies items **1–3**.

**Whole-run pass** when every ledger satisfies items **1–3** and item **4** is satisfied.

A green rebase with zero ledgers after conflicts = **Step 1 incomplete** — go back and write ledgers.

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

1. **Capture** — next `N` → write `N.CONFLICT-<slug>.md` at repo root from [ledger-template.md](ledger-template.md), with blocks 1–3 filled from the conflict region as it stands. **Stop until block 3 exists** — the edit in step 2 destroys the markers that carry both sides.
2. **Resolve** — edit the source path (union bias; `git-rebase` patterns when loaded).
3. **Fill** — complete block 4 (**Landed**) in [ledger-template.md](ledger-template.md), then set the title emoji from block 1. **Stop until blocks 1–4 are filled** for this ledger (gate item 2).
4. **Stage** — `git add` only that resolved source path(s).
5. Repeat for every path in this stop.

Then run the ledger gate **stop pass** (items 1–3). Only if it passes:

6. **Continue** — `git rebase --continue` (or equivalent from `git-rebase`).

Repeat the whole stop cycle until rebase finishes.

**Completion**: rebase finished; **stop pass** satisfied for every conflict stop; every conflicted path has exactly one complete untracked ledger; zero ledger files staged; you can list every `N.CONFLICT-*.md` path. (No summary yet — item 4 waits for Step 2.)

### Step 2 — Verify

Read project markdown (`AGENTS.md`, `CONTRIBUTING.md`, `README.md`, `docs/`, other workflow `*.md`) for verify commands; cross-check format, lint, typecheck, build, unit tests, integration tests, e2e tests, other. Run every command collected (default order when docs silent: format → lint → typecheck → build → unit → integration → e2e → other). Fix before Step 3; conflict-adjacent fixes ledger-first (`N.CONFLICT-post-rebase-<slug>.md`).

**Assemble the summary only after every command is green** — the last ledger artifact, so no post-rebase ledger can appear after it: `LEDGER-REBASE-SUMMARY.md` at repo root, written per [summary-template.md](summary-template.md).

Then run the ledger gate **whole-run pass** (items 1–4).

**Completion**: all collected commands green; summary assembled at repo root and covers every `N.CONFLICT-*.md` (conflicted + post-rebase); summary untracked; whole-run pass satisfied.

### Step 3 — Commit fallout

Commit all remaining tracked changes from resolution/verify. Use `git-commit` skill or project commit docs. Unstage any ledger paths before commit (Non-negotiables).

**Completion**: clean tracked tree; only untracked `N.CONFLICT-*.md` and `LEDGER-REBASE-SUMMARY.md` (plus unrelated pre-existing untracked).

### Step 4 — Hand off ledgers

Report rebase + verify green **in chat only**. List every untracked `N.CONFLICT-*.md` path (full repo-relative paths from ledgers) **and** the `LEDGER-REBASE-SUMMARY.md` path. If conflicts occurred and the ledger list is empty, Step 1 is incomplete — write ledgers first.

**Completion**: user has the full ledger + summary path list in chat; no MR/PR comments posted.

### Step 5 — ask-gate → push + ledger-thread?

**Stop. Ask the user** (exact intent, one question — the yes covers **both** push and post):

> Push the rebased commits and post conflict ledgers to the MR/PR as separate discussion threads (one folded ledger per thread, ⚠️ in the title where the resolution was authored) plus a summary thread flagging the ⚠️ ones?

Wait for yes or no. **ask-gate**: until they answer, run no `glab mr note`, `gh pr comment`, or other MR/PR discussion API.

| Answer | Action |
|--------|--------|
| **No** | Skill done — no push, no comments. Push only on a separate explicit request. |
| **Yes** | **Push first** — `git push --force-with-lease` the rebased branch, so the MR diff matches the ledgers. **Then post** the **ledger-thread** for each `N.CONFLICT-*.md` in order, and the **summary thread** last — read [mr-pr-formatting.md](mr-pr-formatting.md). Forge: `glab` / `gh`; `git-pr` / `glab` skills as needed. Report the push and every thread URL (including the summary's). |

**Completion**: user answered. If yes: push succeeded; one thread URL per ledger plus one for the summary; thread count equals ledger count + 1.

## Done

Steps 0–4 complete (including ledger gate whole-run pass + full ledger & summary path list in chat); Step 5 answered; ask-gate respected; if yes: pushed, then posted.
