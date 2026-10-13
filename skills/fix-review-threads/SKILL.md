---
name: fix-review-threads
description: Thread-by-thread MR/PR review helper — groups unresolved threads into Q/A and fix-needed, presents each thread and holds its draft fix/reply for confirmation; skips resolved.
disable-model-invocation: true
---

# Fix review threads

## Invoke

`fix-review-threads`, `fix review threads`, `MR/PR review reply`, `reply with commit`.

Helper for working review threads **one at a time**: present each thread,
propose a fix or reply, and **hold** it for confirmation before sending.
Leave threads unresolved unless the user or project rules require resolve.

## Steps

### 1 — List and group unresolved threads

Use the forge CLI (`glab` / `gh`; load those skills if present). Build the
work list from **unresolved** review discussions only — resolved threads
are out of scope.

Group each unresolved thread:

- **Q/A** — answerable from the thread + a quick codebase look; no code
  change.
- **Fix** — needs (or probably needs) a code change.
- **Hard / unrelated** — park it; do not block the loop.

**Completion**: every unresolved thread is assigned to Q/A, Fix, or Hard.

### 2 — Work each Q/A and Fix thread, one at a time (repeat)

Repeat for **every** Q/A and Fix thread from Step 1, **Q/A group first**.

1. Read that thread only, plus the minimal files/lines it cites.
2. Present the thread, in this exact order:
   1. **Direct markdown link** — `[<thread-id>](<thread-url>)`, so the
      user can open the thread in the browser.
   2. **File with line** — the `path:line` (or range) the thread cites.
   3. **Code block** — the relevant code around that location, with
      enough surrounding lines for context.
   4. **Reviewer comment** — the thread's comment **verbatim** (as-is),
      so it is clear what is being handled.
   5. **Proposed fix** — if applicable (Fix threads): the minimal change,
      as before/after code.
   6. **Draft reply** — if applicable: the reply text following
      [Reply format](#reply-format).
3. **Hold for confirmation.** Show the draft and wait; post the reply,
   commit, or push only after the user approves, then move to the next
   thread.

**Completion**: every Q/A and Fix thread from Step 1 is presented with all
required fields, with its draft held for approval.

### 3 — Report parked threads

At end of run, report every Hard / unrelated thread from Step 1 (and any
reclassified mid-run): discussion id/link, reviewer ask (short quote), and
codebase context (paths, symbols, current behaviour) so the user can
answer themselves or tell you what to reply.

**Completion**: parked list empty, or each parked item has ask + context;
user has the report.

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

## Forge — post the reply

Detect forge from remote / context. Prefer CLI; load `glab` / `gh` skills
when present.

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

List review threads via GraphQL (`reviewThreads` on the PR); keep only
threads with `isResolved: false` for Step 1.
