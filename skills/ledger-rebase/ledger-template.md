## Ledger template

One untracked **ledger** per conflicted path at the **repository root**. Write the ledger **before** staging the resolved file; run the ledger gate **stop pass** (items 1–3) in `SKILL.md` before `git rebase --continue`. Naming and untracked rules: **Non-negotiables** in `SKILL.md`.

Example filenames: `1.CONFLICT-auth.md`, `2.CONFLICT-api-client.md`.

### Required blocks

Every ledger is **what you got, then what you did**. Four blocks, always in this order:

1. **Title** — `## N.CONFLICT-<slug>` plus **exactly one** emoji, picked by the test:

   | Emoji | Kind | The test |
   |-------|------|----------|
   | ⚠️ | **Authored** | **Neither side could have produced this.** The landed region is code HEAD and Incoming did not contain — hand-blended, interfaces reconciled, callsites cleaned, a deletion with follow-up edits, a post-rebase latent fix. |
   | ☑️ | **Verbatim** | **One side — or git's own union — produced this.** The landed region is a side's region intact, or the automatic union of both sides' independent additions. Zero edits. |

   The emoji classifies the resolution for the summary index — **Landed** states the outcome. ☑️ marks a verbatim pick (which side is named in **Landed**); ⚠️ marks an authored blend (read **Landed** and **Rationale:**). A union git already made is ☑️ however many lines moved.

   Set the emoji when **Landed** is filled, not when the file is created: before the blend is done the test cannot be applied, and the title stays correctable until the path is staged.

2. **Header list** — `- **file:**` with the full repo-relative path, no abbreviated segments, one line per path the conflict involved (modify/delete: the surviving and the deleted path). When the path moved — any rename — `- **file:**` is the **resulting** filename, one line, and the old name is on the **Code** block headers. Then `- **applying:**` with the sha as **bare text** (GitLab links a bare sha, not a code span), the subject, and the conflict type in parentheses.

3. **Code** — captured from the conflict region **before** editing the file, because editing destroys the markers that carry both sides. **HEAD** then **Incoming**, each with a one-line description and the decisive snippet (verbatim and authored alike when both sides exist).

   Block headers take a ` — <path>` suffix **only on a rename** — HEAD = old path, Incoming = new — so the pair shows the move and each side's content stays bound to its own filename. Every other header is the bare side name.

4. **Landed** — always required; a ledger that ends at **Code** reads unfinished. Names the outcome in prose so the reader does not infer from **Incoming** (last contrast) or from ☑️ alone.

   **Verbatim (picked one side):** one sentence — e.g. took HEAD verbatim, took Incoming verbatim — optional parenthetical context; prose only (winning snippet stays in **Code**).

   **Verbatim (git union):** one sentence naming the union; add a fenced snippet only when the merged region is not identical to either side's **Code** block.

   **Authored:** what you blended (concrete, one or two lines); mandatory **Rationale:** line (why that blend — the idea behind the resulting code); fenced snippet. ⚠️ in the title marks this case for the summary.

### Example (verbatim ☑️)

````markdown
## 1.CONFLICT-dev-warn-guard ☑️

- **file:** `src/lib/notify.service.ts`
- **applying:** a1b2c3d4 — guard dev-only console warn (content)

### Code

**HEAD**

Main added dev-only guard around parallel-subscription `console.warn`.

```ts
if (isDevMode()) {
    console.warn(/* … */);
}
```

**Incoming**

Replayed branch kept unconditional warn (pre-main guard).

```ts
console.warn(/* … */);
```

### Landed

Took HEAD verbatim (`isDevMode()` guard around the warn).
````

### Example (authored ⚠️)

````markdown
## 2.CONFLICT-widget-list ⚠️

<!-- full repo-relative path — a reviewer must be able to open it as written -->
- **file:** `src/features/widgets/widget-list.ts`
- **applying:** 3f2c9a1 — "add widget export" (content)
  <!-- conflict type: content | modify/delete | add/add | rename+content | … -->

### Code

**HEAD** — `src/legacy/settings/widget-list.ts`

Legacy path; exported `exportWidget` from a static array.

```ts
export function exportWidget() { /* … */ }
export const widgets = [/* static */];
```

**Incoming** — `src/features/widgets/widget-list.ts`

New path; list reads from the shared widget store.

```ts
export const widgetList = inject(WidgetStore).items;
```

### Landed

Kept the rename; kept HEAD's exportWidget; took Incoming's store-bound list.

**Rationale:** the store is the target direction (other widgets use it); the export API stays compatible.

```ts
export function exportWidget() { /* … */ }
export const widgetList = inject(WidgetStore).items;
```
````

### Template notes

- **Rationale** — required on every ⚠️ ledger: inline `**Rationale:**` line (never a `###` heading), after the blend lines and before the **Landed** fence.
- **Post-rebase latent fixes** — `N.CONFLICT-post-rebase-<slug>.md`, same blocks, ⚠️ by the test (a latent fix is code neither side had); its `- **applying:**` carries the failing verify command in place of a sha.
- **The summary carries the flags** — `LEDGER-REBASE-SUMMARY.md` (assembled at the end of `SKILL.md` Step 2, after verify is green) mirrors the titles per [summary-template.md](summary-template.md); posting format: [mr-pr-formatting.md](mr-pr-formatting.md).
