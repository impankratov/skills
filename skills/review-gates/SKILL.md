---
name: review-gates
description: Mine the next batch of human MR/PR review threads into hard (linters, formatters, type checkers) or soft (docs) rule proposals. A cursor continues the next run.
disable-model-invocation: true
---

# review-gates

Turn recurring human review feedback into reusable gates.

## Invoke

`review-gates`, `review-gates 20`.

Stay in chat through collect → filter → classify → numbered list → working. Edit checkers or docs only in step 6, after the user says `implement` / `go` / `do that`.

## Inputs

- **N** — merged MRs/PRs this run. Take it from the prompt; default **20**.
- **Project** — `git remote get-url origin`. CWD is the git repo root.
- **Catalog** — `<CWD>/.review-gates/` (untracked): `threads/` (one file per human thread kept), `handled.txt` (mined MR/PR URLs; high-water = max iid/number), `last-run.txt` (`cursor` = next collect takes items newer than that id).

## Steps

### 1. Collect

`glab` or `gh` already authenticated. `node` the matching script next to this `SKILL.md` (the folder you loaded it from):

```sh
node <skill-dir>/collect-gitlab.js <N>
node <skill-dir>/collect-github.js <N>
```

GitHub origin → `collect-github.js`. Otherwise `collect-gitlab.js`.

The script writes human-authored threads, updates the catalog, and prints paths plus the cursor. Report that cursor.

If stdout says nothing newer (or no merged items), tell the user and stop.

**Completion**: you reported the script's stdout; every printed thread path exists, or the run was empty and you stopped.

### 2. Filter

Read each file printed in step 1. Delete files with no reusable lesson — praise, `@mention`-only notes, process/tooling talk, task-scope nits, questions answered with no rule. The MR/PR stays in `handled.txt`.

**Completion**: only lesson-bearing thread files remain this run, and you have said which files you deleted and why.

### 3. Classify

Group remaining threads by **lesson** (same review point, even across files or MRs/PRs). Each lesson is one proposal. Several thread files can share it. Drop a lesson as **no rule** when it is too implicit or would false-positive; say so.

For each remaining lesson, pick one:

- **Hard rule** — a machine can decide. Name the repo's existing check (linter, formatter, type checker, or similar), the rule, and a rough config. Prefer that existing chain over adding a new tool.
- **Soft rule** — judgement. Name the doc section and the bad/good shape (e.g. comments explain _why_, not _what_). Use this when a hard rule would false-positive.

**Completion**: every remaining thread is attached to one lesson or dropped as no rule, and each lesson is hard or soft.

### 4. Print proposals

Print a numbered list in chat. Two sections: **Hard rules** then **Soft rules**. Number **1, 2, 3…** across both so the user can reply `keep 1,3`, `skip 2`, `rewrite 4: …`.

Each numbered item:

- the proposed rule (check + rule + config, or doc section + shape),
- a one-line rationale,
- links to the thread file(s) and the note URL.

**Completion**: the numbered list is in chat and the user can cite every item by number.

### 5. Working

Apply keep / skip / rewrite, answer questions, tighten wording. After each change, reprint the live numbered list (same numbers for items that remain; drop skipped numbers or say which ids are gone).

**Completion**: the user said `implement`, `go`, or `do that`. Keep/skip/rewrite alone is not that signal.

### 6. Implement

Encode only the lessons still on the list, in the repo's existing checkers or docs.

**Completion**: every kept lesson is in a checker or a doc; no other files changed. Stop unless the user asks to commit or open an MR/PR.
