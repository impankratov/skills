## Ledger template

One untracked **ledger** per conflicted path at the **repository root**. Write the ledger **before** staging the resolved file; run the **Ledger gate** in `SKILL.md` before `git rebase --continue`. Naming and untracked rules: **Non-negotiables** in `SKILL.md`.

Example filenames: `1.CONFLICT-auth.md`, `2.CONFLICT-api-client.md`.

### Required blocks

Every ledger is **what you got, then what you did**. Four blocks, always in this order:

1. **Title** — `## N.CONFLICT-<slug>` plus **exactly one** emoji, picked by the test:

   | Emoji | Kind | The test |
   |-------|------|----------|
   | ⚠️ | **Authored** | **Neither side could have produced this.** The landed region is code HEAD and Incoming did not contain — hand-blended, interfaces reconciled, callsites cleaned, a deletion with follow-up edits, a post-rebase latent fix. |
   | ☑️ | **Verbatim** | **One side — or git's own union — produced this.** The landed region is a side's region intact, or the automatic union of both sides' independent additions. Zero edits. |

   A ☑️ title states the check happened and found nothing — the summary thread repeats it so the reviewer sees that. A union git already made is ☑️ however many lines moved.

   Set the emoji when **Landed** is filled, not when the file is created: before the blend is done the test cannot be applied, and the title stays correctable until the path is staged.

2. **Header list** — `- **file:**` with the full repo-relative path, no abbreviated segments (modify/delete: one line each for the surviving and the deleted path); then `- **applying:**` with the sha as **bare text** (GitLab links a bare sha, not a code span), the subject, and the conflict type in parentheses.

3. **Code** — captured from the conflict region **before** editing the file, because editing destroys the markers that carry both sides. Verbatim: one block, the winning side as landed, its description stating the resolution. Authored: **HEAD** then **Incoming**, each stating what it wanted.

4. **Landed** — authored only: what landed, an optional **Rationale:** paragraph, then the snippet as it stands in the tree.

### Example

````markdown
## 2.CONFLICT-widget-list ⚠️

<!-- full repo-relative path — a reviewer must be able to open it as written -->
- **file:** `src/features/widgets/widget-list.ts`
- **applying:** 3f2c9a1 — "add widget export" (content)
  <!-- conflict type: content | modify/delete | add/add | rename+content | … -->

### Code

<!-- One block per side: optional path in the header (rename only — then BOTH sides list their
     filenames: HEAD = old path, Incoming = new path), a one-line description, then the snippet.
     verbatim: ONE block — the winning side's region as landed, its description = the resolution. -->

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

### Landed

The resolution — concrete, one or two lines; then the snippet.

Kept the rename; kept HEAD's exportWidget; took Incoming's store-bound list.

**Rationale:** the store is the target direction (other widgets use it); the export API stays compatible.

```ts
// what is in the tree after resolution
```
````

### Template notes

- **Rationale is an inline bold line**, never a `###` heading.
- **Verbatim** — no **Landed**; the resolution reads as the winning block's description.
- **Rename** — block headers carry the path on **both** sides (HEAD = old, Incoming = new) so the file's history survives; no rename → omit the ` — path` suffix.
- **Post-rebase latent fixes** — `N.CONFLICT-post-rebase-<slug>.md`, same blocks, ⚠️ by the test (a latent fix is code neither side had); its `- **applying:**` carries the failing verify command in place of a sha.
- **The summary carries the flags** — `LEDGER-REBASE-SUMMARY.md` (assembled at the end of `SKILL.md` Step 2, after verify is green) mirrors the titles per [summary-template.md](summary-template.md); posting format: [mr-pr-formatting.md](mr-pr-formatting.md).
