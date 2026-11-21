# Follow-up commit citations

Use in `LEDGER-REBASE-SUMMARY.md` **Follow-up commits** and in the posted **summary thread** (same text — the thread inlines the on-disk summary).

List every Step 3 commit that traces to conflict resolution fallout (verify fixes, post-rebase ledgers, **Dropped:** restorations). Order: oldest first unless one commit clearly depends on another — then dependency order.

## One commit

```markdown
### Follow-up commits

a1b2c3d — `fix(auth): trim session cookie path (TICKET-42)`

Restores **Dropped:** from ledger 1.
```

## Several commits

```markdown
### Follow-up commits

- a1b2c3d — `refactor(ui-button): rename label prop to caption (TICKET-42)`
- e4f5a67 — `fix(ui-form): pass caption into Button (TICKET-42)`

Ledger 2 **Dropped:** — caption wiring; ledger 4 post-rebase.
```

## Rules

1. **SHA bare** — no backticks around the short SHA (forge auto-links it).
2. **Title in backticks** — full commit subject, not only the scope / package name.
3. **Em dash** — ` — ` (space, em dash `—`, space) between SHA and title.
4. **Bullets for 2+** — never stack bare SHA lines without list markers; some forge UIs wrap them into one line.
5. **Push before post** — cited SHAs must be on the MR remote before Step 5 posts the summary thread (forge won't link local-only commits). Order: Step 3 commit → Step 5 push → post threads.

After the citation block, one short prose block (or one line per commit when several) ties each SHA to the ledger(s) it satisfies — **Dropped:**, post-rebase ledger `N`, or verify fallout called out in Step 2.

When Step 3 produced **no** conflict-related commits, omit **Follow-up commits** entirely — no empty heading.