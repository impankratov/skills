## Ledger template

One untracked **ledger** per conflicted path at the **repository root**. Write the ledger **before** staging the resolved file; run the **Ledger gate** in `SKILL.md` before `git rebase --continue`. Naming and untracked rules: **Non-negotiables** in `SKILL.md`.

Example filenames: `1. CONFLICT-auth.md`, `2. CONFLICT-api-client.md`.

### Required blocks

Ledger title = filename (`N. CONFLICT-<slug>.md`) — **no `# Conflict:` heading**. Same blocks in every ledger; density follows the resolution kind:

| Kind | What it is | Worth verifying |
|------|------------|-----------------|
| **Verbatim** | pure pick of one side, or clean union of both sides' independent additions, zero edits | `✅ no` |
| **Authored** | hand-blended regions, reconciled interfaces, callsites cleaned, deletion with follow-up edits, post-rebase latent fix | `⚠️ yes — <why-line>` |

Every ledger opens with a bold path line (no heading) and MUST include these blocks, filled (no empty stubs):

````markdown
**`src/features/widgets/widget-list.ts`**

<!-- bold full repo-relative path; no abbreviated segments. Modify/delete: list surviving and deleted paths, one bold line each. -->

Reviewer must be able to open the path as written (copy-paste into the editor).

### Context

- **Onto:** origin/main
  <!-- the rebase target — same for every ledger in a run; stated once per ledger here -->
- **Applying:** 3f2c9a1 — "add widget export" (content)
  <!-- sha as BARE text, no backticks — GitLab links a bare sha, not a code span. Conflict type: content | modify/delete | add/add | rename+content | … -->

### Code

<!-- One block per side: optional path in the header (rename only — then BOTH sides list their
     filenames: HEAD = old path, Incoming = new path), a one-line description, then the snippet.
     verbatim: ONE block — the winning side's region as landed, its description = the resolution.
     authored: HEAD then Incoming (description = what it wanted), then Landed below. -->

**HEAD** — `src/legacy/settings/widget-list.ts`

What it wanted — one line.

```ts
// decisive snippet from HEAD side
```

**Incoming** — `src/features/widgets/widget-list.ts`

What it wanted — one line.

```ts
// decisive snippet from Incoming side
```

<!-- Block-header filenames are OPTIONAL — shown only on a rename, where BOTH sides list them
     (HEAD = old path, Incoming = new path) so the file's history survives next to the bold
     path line. No rename → omit the ` — path` suffix entirely. -->

### Landed (authored, when the tree differs from a pure pick)

The resolution — concrete, one or two lines; then the snippet. Optional **Rationale:** line as its own paragraph:

Kept the rename; kept HEAD's exportWidget; took Incoming's store-bound list.

**Rationale:** the store is the target direction (other widgets use it); the export API stays compatible.

```ts
// what is in the tree after resolution
```

**Worth verifying:** ⚠️ yes — <why-line>
````

### Template notes

- **Rationale / Worth verifying are inline bold lines, never `###` headings.**
- **Worth verifying** closes every ledger, always present: `⚠️ yes — <why-line>` or `✅ no`.
- **Verbatim** — no `### Landed`; the resolution text (and any rationale) folds into the winning block's description, then closes with **Worth verifying:** `✅ no`.
- **Modify/delete** — document which side won; the opening path line lists surviving and deleted full paths, one bold line each.
- **Post-rebase latent fixes** — `N. CONFLICT-post-rebase-<slug>.md`, same blocks; authored → full form; continue the `N` sequence.
- **Rebase summary drives the thread** — `LEDGER-REBASE-SUMMARY.md` (assembled at the end of `SKILL.md` Step 2, after verify is green) mirrors each ledger's **Worth verifying**: `⚠️ yes` ledgers carry a `⚠️` in the summary thread per [summary-template.md](summary-template.md). Posting format: [mr-pr-formatting.md](mr-pr-formatting.md).
