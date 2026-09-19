## Summary template

One untracked **summary** per rebase at the **repository root**: `LEDGER-REBASE-SUMMARY.md`. Assemble at the end of `SKILL.md` Step 2, only after every verify command is green — the summary is the *last* ledger artifact, so no post-rebase ledger can appear after it. Naming and untracked rules: **Non-negotiables** in `SKILL.md`.

### Required blocks

One line per ledger, encounter order, using that ledger's `N` as the list marker. The slug *is* the filename — no paths, no why-lines:

```markdown
1. CONFLICT-<slug>
2. CONFLICT-<slug> ⚠️
3. CONFLICT-<slug>
```

`⚠️` mirrors a ledger's **Worth verifying** `⚠️ yes` — appended verbatim; nothing on `✅ no`. Mirror the flags, don't re-judge them.

Posting: [mr-pr-formatting.md](mr-pr-formatting.md) turns the list into the summary thread (title + slug links).