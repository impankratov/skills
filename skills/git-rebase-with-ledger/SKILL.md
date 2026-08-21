---
name: git-rebase-with-ledger
description: "TRIGGER: user says git-rebase-with-ledger / rebase with ledger. User-invoked overlay on git-rebase: conflict ledger + project verify + commit fallout + optional MR review thread."
disable-model-invocation: true
---

# git-rebase-with-ledger

Rebase with a **ledger**: one untracked numbered `N. CONFLICT-*.md` per conflicted file, then project-doc verify, then commit all fallout. Rebase mechanics live in `git-rebase` — this skill is the overlay.

## Trigger

**HARD RULE.** User names this skill (or “rebase with ledger”) → load it FIRST. Before resolving any conflict under this skill, activate **`git-rebase`** (read its `SKILL.md` and follow it for backup / strategy / resolve / continue). Violation = protocol failure.

## Non-negotiables

- **HARD RULE — never commit ledger files.** `N. CONFLICT-*.md` (and any ledger path) stay **untracked forever** for this workflow. Never `git add`, never `git commit`, never include them in a force-push or MR branch. Staging/committing a ledger = protocol failure. Hand off as local files for human review only.
- **Enumerated local filenames** — on-disk name is `N. CONFLICT-<slug>.md` where `N` is the encounter ordinal (1, 2, 3, …) across the whole rebase (and any post-rebase ledgers continue the sequence). Not bare `CONFLICT-<slug>.md`.
- **One ledger file per conflicted path** (content or modify/delete), not per hunk.
- **Full paths only** — every conflicted path in the ledger is the complete repo-relative path. No `...` / abbreviated / truncated path segments. If the conflict is a rename (or content conflict with different old vs new paths), list **both** the old path and the new path so a reviewer can open either file.
- **Code evidence required** — word-only descriptions are insufficient. Each ledger must include short fenced code snippets of the **key** differences (HEAD vs Incoming and/or what landed). Not the full diff — only the decisive hunks a reviewer needs.
- **Union bias** — when both sides add independent capabilities, keep both; `--ours` / `--theirs` only when ledger explains why union is impossible.
- **No race** — finish writing a resolved file, then `git add` that path (never parallelize edit + stage).
- **Do not force-push** unless the user explicitly asks.

## Execution

### Step 0 — Activate `git-rebase`

Read and follow `git-rebase` for the rebase itself (backup, fetch, strategy, conflict pauses, continue/abort).

**Completion**: `git-rebase` loaded; backup exists; rebase onto the agreed target started or ready to start.

### Step 1 — On each conflict stop: write the ledger entry

For **every** path in `git diff --name-only --diff-filter=U` (and modify/delete unmerged paths):

1. Allocate the next encounter number `N` (start at 1; increment for each new ledger in this rebase run). Create repo-root `N. CONFLICT-<slug>.md` using the required sections in [ledger-template.md](ledger-template.md). Paths and code snippets must satisfy Non-negotiables above before you consider the ledger done.
2. Resolve the file (prefer union; use `git-rebase` resolution patterns).
3. Stage **only** the resolved source path(s). **Never** stage `N. CONFLICT-*.md`.
4. Continue the rebase when the stop is clear.

**Completion**: No unmerged paths; every conflicted path has a matching untracked `N. CONFLICT-*.md` with all required sections filled (full paths + key code); rebase finished (`git status` not “rebase in progress”); `git status` / staged set contains **zero** ledger files.

### Step 2 — Verify (project docs)

Read project docs that define lint / test / e2e / build (e.g. `AGENTS.md`, `CONTRIBUTING.md`, `docs/`). Run **everything those docs specify** for post-change verification (not a subset you invent).

Fix failures caused by the rebase. Each fix gets a ledger note if it was conflict-adjacent (`N. CONFLICT-…` or `N. CONFLICT-post-rebase-<slug>.md`, continuing the same `N` sequence). Same path/code/untracked rules apply.

**Completion**: All doc-mandated verify commands exit 0 (flaky e2e retries that end green count as pass).

### Step 3 — Commit fallout

Any remaining tracked changes from resolution/verify must be committed.

- Activate **`git-commit`** if available; else follow project commit docs.
- **HARD RULE:** leave every `N. CONFLICT-*.md` untracked. If a commit command would include them, abort that commit and unstage them first.

**Completion**: `git status` shows clean tracked tree except untracked `N. CONFLICT-*.md` (and other pre-existing untracked noise unrelated to this run).

### Step 4 — Hand off ledger to user

Tell the user rebase + verify are green and list the `N. CONFLICT-*.md` paths for review. **Do not commit them** (HARD RULE).

**Completion**: User has the path list and knows files are untracked for review only.

### Step 5 — Ask: MR/PR review thread?

Ask whether to open a **new discussion thread** on the existing MR/PR that:

1. Inlines **all** ledger `N. CONFLICT-*.md` contents (never attach/upload the files; never commit them).
2. Leads with a **short summary of the hardest conflicts** (ones a human reviewer should re-check).

If **no** → stop. If **yes**:

- Detect forge from remote (`glab` for GitLab, `gh` for GitHub).
- Activate **`git-pr`** / **`glab`** skill if the forge workflow requires it.
- Post one thread/comment using the **MR/PR note formatting** rules below.
- **Do not** put ledger files into the branch or commit them.

**Completion**: User answered; if yes, thread URL reported; ledger still untracked locally.

#### MR/PR note formatting (HARD)

The note body is **rendered Markdown**, not a dump of files. Follow all of these:

1. **Inline as real Markdown** — paste each ledger’s body into the note as Markdown. **Never** wrap a whole ledger (or the whole note) in an outer ` ```markdown ` / ` ```md ` fence. Outer fences + inner ` ```ts ` / ` ```json ` Key-code fences break render (outer fence closes early; orphan fence at end). Language fences stay **only** inside **Key code** snippets, as in the ledger template.
2. **Enumerate body sections by encounter order** — one numbered section per ledger file, same `N` as the filename. Section title is **plain text** (no backticks): strip `.md` from the filename, and **omit** the conflicted path (path lives under **Paths**):

   ```markdown
   ## 1. CONFLICT-<slug>
   ## 2. CONFLICT-<other>
   ```

   Drop the ledger’s own `# Conflict: …` H1 when inlining so this heading owns the section (keep **Paths** / rest unchanged). On-disk file is `N. CONFLICT-<slug>.md`; note title is that name without `.md`.
3. **Separate conflicts** — put a horizontal rule `---` between the intro/summary and the first ledger, and between every pair of ledger sections.
4. **Hardest-conflicts summary is an unnumbered list** — use `-` bullets (not a second `1.`/`2.` list counter), hardest → lowest. Each bullet **starts with the same label** as the body section (`N.` + bold `CONFLICT-<slug>`, no backticks, no `.md`), then path/prose. Numbers must match body sections / filenames (never invent a second numbering). Related ledgers may share one bullet:

   ```markdown
   - 1. **CONFLICT-a** — **`<path>` (<type>)** — … **Resolution:** …
   - 2. **CONFLICT-b** / 3. **CONFLICT-c** — **`<path>`** — … **Resolution:** …
   ```

   Do **not** prefix with “Ledger:” / “Local ledger:”. Body section titles stay plain (`## 1. CONFLICT-a`); only the hardest list bolds the slug.
5. **No attachment / local-file disclaimers** — do **not** write lines like “ledger files below are local-only”, “never committed”, or “attached”. Nothing is attached; content is already inlined.
6. **Format fixes** — if the user corrects note formatting, **edit the same note/thread** (forge update API) when possible; do not spam a second thread unless they ask.

Minimal skeleton:

```markdown
## Rebase conflict ledger (`<onto-ref>`)

<one short paragraph: onto what, verify status, rewrite/push caveat if any>

### Hardest conflicts (please re-check)

- 1. **CONFLICT-a** — **`<path>` (<type>)** — … **Resolution:** …
- 2. **CONFLICT-b** / 3. **CONFLICT-c** — **`<path>`** — … **Resolution:** …

---

## 1. CONFLICT-a

## Paths

- **Path:** `<full/repo-relative/path>`
…

---

## 2. CONFLICT-b

## Paths
…

---

## 3. CONFLICT-c

## Paths
…
```

## Done

Skill is done when Steps 0–4 are complete and Step 5 has an answer (thread created or explicitly declined).
