# Handoff: fix-review-threads skill

**Date:** 2026-09-03  
**Skills repo:** `~/projects/skills`  
**Skill path:** `skills/fix-review-threads/SKILL.md`  
**Supersedes:** `gitlab-mr-review-replies` (renamed + forge-agnostic)

## Summary

Skill for **thread-by-thread** MR/PR review handling: unresolved only; Fix (commit→push→reply), Easy question (reply), Hard parked and reported at end with codebase context. Leave threads unresolved unless user/project requires resolve. Forge via `glab` / `gh`. Reply order: **citation first**, then human answer.

## Canonical reply format

**One commit:**

```markdown
a1b2c3d — `fix(auth): trim session cookie path (TICKET-42)`

Agreed — path now matches the API base URL.
```

**Several commits** — bullet list, then human answer:

```markdown
- a1b2c3d — `refactor(ui-button): rename label prop to caption (TICKET-42)`
- e4f5a67 — `fix(ui-form): pass caption into Button (TICKET-42)`

Renamed the prop and updated the form consumer.
```

Rules:

1. SHA **bare** (no backticks) → forge auto-links
2. Full commit **subject** in backticks
3. Separator ` — `
4. **2+ commits → bullets**
5. Citation **before** human prose

## Workflow

**1 unresolved Fix/Easy thread → handle → reply → next.** Hard threads parked → Step 3 report.

Already **resolved** threads: out of scope (no fix / commit / reply).

Leave threads **unresolved** unless user/project requires resolve.

## Forge notes

| Forge | Thread reply |
|-------|----------------|
| GitLab | `glab mr note create <iid> --reply <discussion-id>` |
| GitHub | `gh pr comment` is top-level only; use REST `…/pulls/comments/{id}/replies` or GraphQL `addPullRequestReviewThreadReply` |

## Skill state

| Field | Value |
|-------|-------|
| Name | `fix-review-threads` |
| Path | `skills/fix-review-threads/SKILL.md` |
| Invocation | User-invoked (`disable-model-invocation: true`) |
| Old name | `gitlab-mr-review-replies` (removed) |
| README | Updated |

## Next actions

1. Commit/push skills repo when ready.
2. `npx skills add impankratov/skills -g -s fix-review-threads`
3. Drop any leftover `gitlab-mr-review-replies` install under `~/.agents/skills/` if present.
