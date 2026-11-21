---
name: fix-review-threads
description: MR/PR review threads one-by-one — dry-run in chat; Fix threads need two confirms (implement, then post reply after you review code); Q/A posts on one confirm. Auto-advance after send or skip. No URL → current branch MR.
disable-model-invocation: true
---

# Fix review threads

## Invoke

`fix-review-threads`, `fix review threads`, `MR/PR review reply`,
`reply with …`, `next`, `skip`.

## Dry-run vs send

Leading words: **dry-run**, **confirm**, **revise**, **send**, **skip**,
**advance** ([Advance](#advance)).

- **Dry-run** (default): read the thread and cited code; present
  [Step 2](#2--work-each-qa-and-fix-thread-repeat) fields. Fix threads: before/after
  stays **chat-only** (no working-tree edits). No `git`, no forge post.
- **Confirm** → **send**: short assent — `yes`, `ok`, `lgtm`, `go ahead`, or
  **reply with** (last draft / thread id).
  - **Q/A**: post the waiting draft.
  - **Fix** (dry-run waiting): **implement** only — edit working tree,
    **commit**, **push**, verify SHAs on remote ([Citation rules](#citation-rules)
    rule 5). Present the final [Reply format](#reply-format) draft (citations
    filled in). **Wait** for a second **confirm** before any forge post.
  - **Fix** (post-implement waiting): post the reply draft; **advance**.
- **Revise**: new reply text, a question, or a change to the proposal. After
  dry-run, stay **dry-run** (no git). After implement, revise reply text or ask
  for code tweaks — re-implement before the second **confirm** if the code must
  change.
- **Send — Q/A**: post draft only (single **confirm**).
- **Skip**: **next** / **skip** / similar — no send; **advance**.

## Advance

After the current Q/A or Fix thread:

1. **Advance** to the next thread in Step 1 order (Q/A group, then Fix) when
   **send** finished or the user **skip**ped.
2. After dry-run presentation: **wait** for **confirm**, **skip**, or
   **revise**. Close with: Fix — `yes` to implement (not post yet); Q/A — `yes`
   to post; either — `skip`, or paste a revision.
3. After **Fix** implement (commit pushed, SHAs verified): **wait** again for
   **confirm**, **skip**, or **revise** on the reply draft. Close with: `yes` to
   post the reply, `skip`, or paste a revision.

## Steps

### 0 — Target MR/PR (start immediately)

If the user gave an MR/PR URL or number, use it. **Otherwise**, resolve the
**open** MR/PR for the **current branch** in the repo at CWD — e.g.
`glab mr list --source-branch="$(git branch --show-current)"` or
`gh pr view --json number,url` for the checked-out head branch (load `glab` /
`gh` skills when present). Pick the single open item; if several match, list
them briefly and ask which one — not a generic “start?” prompt.

**Start Step 1 at once** — no confirmation to begin the thread loop.

**Completion**: target MR/PR identified; Step 1 underway.

### 1 — List and group unresolved threads

Use the forge CLI. Build the work list from **unresolved** review discussions
only — on GitHub, GraphQL `reviewThreads` with `isResolved: false`; resolved
threads are out of scope.

Group each unresolved thread:

- **Q/A** — answerable from the thread + a quick codebase look; no code
  change.
- **Fix** — needs (or probably needs) a code change.
- **Hard / unrelated** — park it; do not block the loop.

**Completion**: every unresolved thread is assigned to Q/A, Fix, or Hard.

### 2 — Work each Q/A and Fix thread (repeat)

Repeat for **every** Q/A and Fix thread from Step 1, **Q/A group first**.
Follow [Advance](#advance) and [Dry-run vs send](#dry-run-vs-send).

1. Read that thread only, plus the minimal files/lines it cites.
2. Present the thread, in this exact order:
   1. **Direct markdown link** — `[<thread-id>](<thread-url>)`.
   2. **File with line** — `path:line` for a single-line thread, or
      `path:start-end` when the forge reports a range (see [Anchor](#anchor)).
   3. **Code block** — cited lines plus minimal surrounding context; mark
      every pinned line per [Anchor](#anchor) (chat-only markers, not commits).
   4. **Reviewer comment** — verbatim.
   5. **Proposed fix (chat-only)** — Fix threads: minimal before/after text.
   6. **Draft reply** — [Reply format](#reply-format).
3. Apply [Advance](#advance).

**Completion**: each Q/A thread is **sent**, **skipped**, or waiting after its
dry-run. Each Fix thread is **sent**, **skipped**, waiting after dry-run, or
waiting after implement for post **confirm**.

### 3 — Report parked threads

When the Q/A and Fix list is exhausted, report every Hard / unrelated thread
from Step 1 (and any reclassified mid-run): discussion id/link, reviewer ask
(short quote), and codebase context (paths, symbols, current behaviour).

**Completion**: parked list empty, or each parked item has ask + context;
user has the report.

## Anchor

Dry-run **code blocks** only — marker comments stay in chat, not the
working tree.

On each pinned line, append an **end-of-line** comment in that file’s syntax:
`← reviewer's point (L<n>)`, where `<n>` is that line’s number in the
**current** file (same numbering as field 2). When **two or more** pinned lines
appear in one snippet, **pad with spaces** after the code so every marker
starts in the **same column**.

Single-line thread (`src/auth/session.ts:42`):

```typescript
export function parseSessionCookie(raw: string) {
  const pair = raw.split(";")[0].trim(); // ← reviewer's point (L42)
  return pair;
}
```

Multi-line thread (`src/auth/session.ts:40-43`): mark **each** line in the
forge range with its own `(L<n>)`:

```typescript
  const pair = raw.split(";")[0].trim();        // ← reviewer's point (L40)
  const [name, value] = pair.split("=", 2);     // ← reviewer's point (L41)
  if (!name) throw new Error("bad cookie");     // ← reviewer's point (L42)
  return { name, value };                       // ← reviewer's point (L43)
```

**Resolve the range from thread metadata**, not from whichever lone integer
the API returns:

- **GitHub** — multi-line: `start_line` (first) and `line` (last) in the
  review-comment payload; UI shows “Comment on lines +X to +Y”. Single-line:
  `line` only, `start_line` null.
- **GitLab** — multi-line: `position.line_range` (`start` / `end` `new_line`
  or `old_line` as appropriate); UI shows “Comment on lines +X to +Y”.
  Single-line: one of `position.new_line` / `position.old_line`, no
  `line_range`.

If a dump exposes only `line` / `new_line` and `start_line` / `line_range` are
absent, treat it as **single-line** for field 2 and one marker.

## Reply format

Order is fixed:

1. **Citation first** when this reply includes fix commits (one line, or
   bullet list if several). Omit the citation block for question-only
   replies.
2. Blank line (only if a citation block is present).
3. Short human answer (what changed / why, or the answer to the
   question). Match the reviewer’s language when the thread is already
   in that language.

### One commit

```markdown
a1b2c3d — `fix(auth): trim session cookie path (TICKET-42)`

Agreed — path now matches the API base URL.
```

### Several commits (same thread)

```markdown
- a1b2c3d — `refactor(ui-button): rename label prop to caption (TICKET-42)`
- e4f5a67 — `fix(ui-form): pass caption into Button (TICKET-42)`

Renamed the prop and updated the form consumer.
```

One Fix thread may need several commits (e.g. separate packages per repo
atomic-commit rules); cite all of them on that thread with this form.

### Citation rules

1. **SHA bare** — no backticks around the short SHA (forge auto-links it).
2. **Title in backticks** — full commit subject, not only the scope /
   package name.
3. **Em dash** — ` — ` (space, em dash `—`, space) between SHA and title.
4. **Bullets for 2+** — never stack bare SHA lines without list markers;
   some forge UIs wrap them into one line.
5. **GitLab — push before reply** — cited SHAs must be on the MR remote before
   post (GitLab won't link local-only commits). **Fix** order: commit → push →
   verify SHA on remote → user **confirm** → post.

## Forge — post the reply (send only)

Under **send** only. Load `glab` / `gh` when present.

### GitLab (`glab`)

List / ids: `glab mr note list` (or `-F json`). Reply:

```bash
glab mr note create <iid> --reply <discussion-id-prefix> << 'EOF'
a1b2c3d — `fix(auth): trim session cookie path (TICKET-42)`

Agreed — path now matches the API base URL.
EOF
```

### GitHub (`gh`)

`gh pr comment` is top-level only — no thread `--reply`. Reply with the
REST replies endpoint (parent = review comment id) or GraphQL
`addPullRequestReviewThreadReply`:

```bash
gh api -X POST repos/{owner}/{repo}/pulls/comments/{comment_id}/replies \
  -f body="$(cat <<'EOF'
a1b2c3d — `fix(auth): trim session cookie path (TICKET-42)`

Agreed — path now matches the API base URL.
EOF
)"
```
