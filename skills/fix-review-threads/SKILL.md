---
name: fix-review-threads
description: Thread-by-thread MR/PR review — skip resolved; fix/push/reply or answer; park hard threads.
disable-model-invocation: true
---

# Fix review threads

## Invoke

`fix-review-threads`, `fix review threads`, `MR/PR review reply`, `reply with commit`.

**Thread-by-thread**: one unresolved thread at a time — **Fix**
(commit→push→reply), **Easy question** (reply), or park **Hard** for
Step 3. Leave threads unresolved unless the user or project rules
require resolve.

## Steps

### 1 — List unresolved threads

Use the forge CLI (`glab` / `gh`; load those skills if present). Build the
work list from **unresolved** review discussions only — resolved threads
are out of scope for the whole run.

Classify each unresolved thread:

- **Fix** — needs a code change.
- **Easy question** — answerable from thread + quick codebase look; reply
  in-thread (no cite unless you also committed).
- **Hard / unrelated** — park it; do not block the loop. Collect for
  Step 3 with enough codebase context for the user to answer or instruct
  a reply.

**Completion**: ordered Fix + Easy-question list (id + ask); Hard list
started (may grow); resolved excluded.

### 2 — Each Fix / Easy-question thread (repeat)

Repeat this step for **every** Fix and Easy-question thread from Step 1,
one at a time — finish reply on the current thread before starting the
next.

1. Read that thread only.
2. **Branch:**
   - **Fix:** implement → commit (atomic, conventional; repo rules /
     `git-commit` skill if present) → ensure commits are on the remote
     the MR/PR tracks (push when user/repo rules allow; cite only SHAs
     the forge can resolve) → capture cite line(s) with
     `git log -1 --format='%h %s'` (repeat if several commits for this
     thread).
   - **Easy question:** answer in-thread; skip commit/cite unless a fix
     commit is also part of the answer.
3. Reply **in that same discussion** using [Reply format](#reply-format).

Exception: one Fix thread that needs several commits (e.g. separate
packages per repo atomic-commit rules). Cite all of those on **that**
thread with the multi-commit form.

**Completion**: every Fix / Easy-question thread from Step 1 has an
in-thread reply; Fix replies cite remote-reachable SHAs when commits
were made; no resolve unless user/project required it.

### 3 — Report parked threads

At end of run, report every Hard / unrelated thread from Step 1 (and any
reclassified mid-run): discussion id/link, reviewer ask (short quote),
and codebase context (paths, symbols, current behaviour) so the user can
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

### Citation rules

1. **SHA bare** — no backticks around the short SHA (forge auto-links it).
2. **Title in backticks** — full commit subject, not only the scope /
   package name.
3. **Em dash** — ` — ` (space, em dash `—`, space) between SHA and title.
4. **Bullets for 2+** — never stack bare SHA lines without list markers;
   some forge UIs wrap them into one line.

### Bad

```markdown
Agreed, fixed.

`a1b2c3d` — ui-button
`e4f5a67` — ui-form
```

Why bad: human text before cite; backticked SHA kills the link; title is
not the commit subject; stacked lines without bullets.

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
