## Summary template

One untracked **summary** per rebase at the **repository root**: `LEDGER-REBASE-SUMMARY.md`. Assemble at the end of `SKILL.md` Step 2, only after every verify command is green — the summary is the *last* ledger artifact, so no post-rebase ledger can appear after it. Naming and untracked rules: **Non-negotiables** in `SKILL.md`.

### Required blocks

The summary opens with its `## Ledger-rebase summary` header, then the rebase target once — the same for every ledger in the run, so it lives here, not per ledger — then one line per ledger in encounter order using that ledger's `N` as the list marker. Each item links to its on-disk ledger file (same directory), so an IDE opens it on click:

```markdown
## Ledger-rebase summary

**Onto:** `origin/main`
<!-- the actual rebase target for this run (e.g. origin/main, origin/release-2.1) — same for every ledger; replace the placeholder -->

1. [CONFLICT-<slug>](1.CONFLICT-<slug>.md)
2. [CONFLICT-<slug>](2.CONFLICT-<slug>.md) ⚠️
3. [CONFLICT-<slug>](3.CONFLICT-<slug>.md)
```

The destination is the ledger filename — no spaces — so a plain relative link resolves on click in the IDE. The list marker (`1.`) is Markdown's ordered-list marker, separate from the filename's `N.`.

`⚠️` mirrors the ledger's title emoji — appended to that ledger's item (authored blend **and** side-pick + parity gap); nothing on `☑️`. Mirror the titles, don't re-judge them.

Optional block **after** the numbered list when any post-rebase ledger exists (written at Step 2 assembly):

```markdown
### Post-rebase ledgers

- [4.CONFLICT-post-rebase-sarif-manual-triage.md](4.CONFLICT-post-rebase-sarif-manual-triage.md) — restores items from ledger 1 **Dropped:**
```

**Follow-up commits** — add or refresh **after Step 3** when fallout commits exist; format per [commit-citations.md](commit-citations.md). The summary thread carries this section unchanged (inline with the index — no separate SHA reply).

Posting: [mr-pr-formatting.md](mr-pr-formatting.md) turns the summary into the summary thread — each file link repointed to that conflict's thread; the header, **Onto:**, **Post-rebase ledgers**, and **Follow-up commits** stay.