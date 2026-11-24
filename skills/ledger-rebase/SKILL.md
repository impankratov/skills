---
name: ledger-rebase
description: Ledger-first rebase — conflict ledgers on disk, parity-gap ⚠️ (not ☑️) when a side-pick drops main behavior, verify, fallout commit; ask-gate before MR comments; ledger-thread plus summary thread (follow-up commits cited in summary).
disable-model-invocation: true
---

# ledger-rebase

Overlay on [`git-rebase`](https://github.com/pedronauck/skills/blob/main/skills/mine/git-rebase/SKILL.md) (pedronauck/skills). Activate `git-rebase` when available (Step 0).

## Invoke

`ledger-rebase`, `ledger rebase`, `rebase-with-ledger`, `rebase with ledger`.

## On invoke

**Run** — activate `git-rebase` when available, then **Step 0 in the same turn**: shell (`git status`, parent ref, fetch, backup, rebase). Chat before the first git command is one short line only (onto ref chosen or rebase-in-progress step label).

**Progress (Steps 0–3)** — terse facts only (`Step 1: src/foo.ts`, gate pass/fail). Ledger path list waits for Step 4.

**Reference on demand** — [Non-negotiables](#non-negotiables); [ledger gate](ledger-gate.md) at each `git rebase --continue` and at whole-run checkpoints in Execution.

## Execution

### Step 0 — `git-rebase` (start immediately)

Read and follow `git-rebase` for backup, fetch, strategy, conflict pauses, continue/abort.

**Parent ref** — branch this work rebases onto. Plain skill invoke (no onto ref in the message): **infer the parent and start Step 0** — fetch, backup, rebase. Do not stop to confirm the parent or to offer other bases when upstream or the open MR/PR already names one.

Resolve in order; stop at the first single ref:

1. Onto ref in the invoke message or an earlier handoff in the thread
2. Merge target of the open MR/PR for the current branch (`glab` / `gh` when needed)
3. Upstream on the current branch from `git branch -vv` (prefer `origin/<branch>` when tracking is set)
4. Rebase already in progress — reuse the onto ref from rebase metadata / `git status`

When one ref resolves: fetch it, rebase onto that ref (remote-tracking form when appropriate), and use the same ref for verify `--base` flags and summary **Onto:**.

When zero refs resolve, or two or more parents tie with no precedence above: ask **one** question naming what is missing — the onto ref only. No shortlist of alternate workflow bases.

**Start Step 0 in this turn** — no confirmation to begin the rebase.

**Completion**: backup branch exists; parent ref fixed for the run; rebase started (`git status` shows rebase in progress) or user explicitly skipped `git-rebase` and rebase already running.

### Step 1 — Ledger-first resolve (each stop)

At each conflict pause, list unmerged paths:

```bash
git diff --name-only --diff-filter=U
# plus modify/delete unmerged paths from git status if needed
```

For **each** path in that list, in order:

1. **Capture** — next `N` → write `N.CONFLICT-<slug>.md` at repo root from [ledger-template.md](ledger-template.md), with blocks 1–3 filled from the conflict region as it stands. **Stop until block 3 exists** — the edit in step 2 destroys the markers that carry both sides.
2. **Resolve** — edit the source path (union bias; `git-rebase` patterns when loaded).
3. **Parity check** — before the title emoji is final: compare **HEAD** and **Incoming** in the ledger **Code** block. If you kept one side verbatim in the hunk, list **independent behavior** on the losing side that the resolution does **not** preserve (same file or call sites in sibling paths). Any item → ⚠️ side-pick + parity gap: record under **Dropped:** and **Parity:** when you fill **Landed**; plan `N.CONFLICT-post-rebase-<slug>.md` or fix in the same stop if trivial. Only ☑️ when parity is complete for this path at `git add` time.
4. **Fill** — complete block 4 (**Landed**) and set the title emoji. **Stop until blocks 1–4 are filled** for this ledger ([ledger gate](ledger-gate.md) item 2).
5. **Stage** — `git add` only that resolved source path(s).
6. Repeat for every path in this stop.

Then run the ledger gate **stop pass** (items 1–3) per [ledger-gate.md](ledger-gate.md). Only if it passes:

7. **Continue** — `git rebase --continue` (or equivalent from `git-rebase`).

Repeat the whole stop cycle until rebase finishes.

**Completion**: rebase finished; **stop pass** satisfied for every conflict stop; every conflicted path has exactly one complete untracked ledger; zero ledger files staged; you can list every `N.CONFLICT-*.md` path. (No summary yet — item 4 waits for Step 2.)

### Step 2 — Verify

Read project markdown (`AGENTS.md`, `CONTRIBUTING.md`, `README.md`, `docs/`, other workflow `*.md`) for verify commands; cross-check format, lint, typecheck, build, unit tests, integration tests, e2e tests, other. Run every command collected (default order when docs silent: format → lint → typecheck → build → unit → integration → e2e → other). Fix before Step 3; conflict-adjacent fixes ledger-first (`N.CONFLICT-post-rebase-<slug>.md`) — each must trace to **Dropped:** on a ⚠️ parity-gap ledger, not silent porting.

**Assemble the summary only after every command is green** — the last ledger artifact, so no post-rebase ledger can appear after it: `LEDGER-REBASE-SUMMARY.md` at repo root, written per [summary-template.md](summary-template.md).

Then run the ledger gate **whole-run pass** (items **1–4**) per [ledger-gate.md](ledger-gate.md).

**Completion**: all collected commands green; summary assembled at repo root and covers every `N.CONFLICT-*.md` (conflicted + post-rebase); summary untracked; whole-run pass items **1–4** satisfied (item 5 waits for Step 3).

### Step 3 — Commit fallout

Commit all remaining tracked changes from resolution/verify. Use `git-commit` skill or project commit docs. Unstage any ledger paths before commit (Non-negotiables).

When any new commit traces to conflict resolution fallout, update `LEDGER-REBASE-SUMMARY.md` **Follow-up commits** per [commit-citations.md](commit-citations.md) — then run the ledger gate **whole-run pass** (items **1–5**) per [ledger-gate.md](ledger-gate.md).

**Completion**: clean tracked tree; only untracked `N.CONFLICT-*.md` and `LEDGER-REBASE-SUMMARY.md` (plus unrelated pre-existing untracked); whole-run pass **1–5** satisfied.

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
| **Yes** | **Push first** — `git push --force-with-lease` the rebased branch, so the MR diff matches the ledgers and **Follow-up commits** SHAs link on the forge. **Then post** ledger threads for **this run's** `N.CONFLICT-*.md` only (not stale threads from an older rebase on the same MR). **Summary thread last** — on-disk summary including **Follow-up commits** when present ([mr-pr-formatting.md](mr-pr-formatting.md)). Forge: `glab` / `gh`. Chat: summary thread URL. |

**Completion**: user answered. If yes: push succeeded; every ledger posted then the summary; chat contains the summary thread URL.

## Done

Steps 0–4 complete (including ledger gate whole-run pass + full ledger & summary path list in chat); Step 5 answered; ask-gate respected; if yes: pushed, then posted, chat has the summary thread URL.

## Non-negotiables

- **Ledger-first** — for each conflicted path: complete ledger on disk **before** `git add` on that path; ledger gate **stop pass** per [ledger-gate.md](ledger-gate.md) **before** every `git rebase --continue`; **whole-run pass** (items 1–5) after the summary exists (Step 2 items 1–4, Step 3 refreshes item 5 when needed).
- **Ledgers stay untracked** — `N.CONFLICT-*.md` at repo root; hand off to human for review; stage and commit only resolved source paths.
- **Ledger naming** — `N.CONFLICT-<slug>.md`; `N` = encounter ordinal across the whole run (including post-rebase ledgers). Summary is assembled last and is **not** numbered: `LEDGER-REBASE-SUMMARY.md` — not a conflicted path; excluded from per-path counts.
- **One ledger per conflicted path** (content or modify/delete), not per hunk.
- **Full paths** in every ledger — complete repo-relative paths; a rename carries both filenames, old and new, in the Code block headers.
- **Code in every ledger** — block 3 in [ledger-template.md](ledger-template.md): **HEAD** and **Incoming**, each with a fenced decisive snippet.
- **Landed in every ledger** — block 4 in [ledger-template.md](ledger-template.md) (verbatim / union / authored branches).
- **Union bias** — keep both sides' independent additions; ours/theirs only when the resolution's **Rationale** line says union failed.
- **Serial resolve** — finish editing a path, then `git add` it.
- **Flag in the title** — block 1 in [ledger-template.md](ledger-template.md): exactly one emoji (☑️ parity-complete vs ⚠️ authored or side-pick + **parity gap**), set when **Landed** is filled. A one-sided `git checkout` that drops `main`/HEAD behavior is **⚠️**, not ☑️ — see **Parity check** in Step 1.
- **Onto once** — the rebase target is written once as **Onto:** in the summary, never per ledger.
- **Push** only when the user explicitly asks — the Step 5 **yes** is that ask; push **before** any thread.
- **ask-gate** — zero MR/PR comments until Step 5 user says yes. `git push --force-with-lease` is not a comment — it refreshes the diff.
- **ledger-thread** — when Step 5 is yes, **after** the push: one discussion thread per `N.CONFLICT-*.md`; body = that ledger folded whole, title into the `<summary>`, per [mr-pr-formatting.md](mr-pr-formatting.md). One thread, one ledger — plus the **summary thread** posted last (index only; ledger references become links to their threads).