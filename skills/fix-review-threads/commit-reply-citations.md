# MR/PR thread commit citations

Use in **Fix** thread replies (and anywhere `fix-review-threads` cites SHAs). Same rules as `ledger-rebase/commit-citations.md` — duplicated here so MR replies do not depend on loading ledger-rebase.

**Incident (2026-11-24):** two-commit MR reply posted without list bullets; body corrected via forge API. Re-run this lint if formatting regresses.

## One commit

```markdown
a1b2c3d — `fix(auth): trim session cookie path (TICKET-42)`

Agreed — path now matches the API base URL.
```

## Two or more commits (same thread)

```markdown
- a1b2c3d — `refactor(ui-button): rename label prop to caption (TICKET-42)`
- e4f5a67 — `fix(ui-form): pass caption into Button (TICKET-42)`

Renamed the prop and updated the form consumer.
```

## Rules

1. **SHA bare** — no backticks around the short SHA (forge auto-links it).
2. **Title in backticks** — full commit subject, not only the scope / package name.
3. **Em dash** — ` — ` (space, em dash `—`, space) between SHA and title.
4. **Bullets for 2+** — never stack bare SHA lines without list markers; some forge UIs wrap them into one line.
5. **Push before post** — cited SHAs must be on the MR remote before the reply (GitLab will not link local-only commits).

After the citation block, blank line, then short human prose (match reviewer language when the thread is already in that language).

## Citation lint (mandatory before post)

Run immediately before `glab mr note create` / `gh api` reply. **Done when** every check passes or the draft is revised.

1. Count distinct citation lines at the top of the draft (lines matching `^[0-9a-f]{7,40} — `).
2. If count **is 1**: lines must **not** start with `-` (unless the whole reply is bullets for another reason).
3. If count **is 2+**: **every** citation line must start with `- ` (space after hyphen).
4. One blank line between citation block and prose when citations are present.
5. SHAs exist on the remote branch (`git fetch` + `git branch -r --contains <sha>` or equivalent).

If any check fails, fix the draft — do not post.