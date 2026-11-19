## Ledger template

One untracked **ledger** per conflicted path at the **repository root**. Write the ledger **before** staging the resolved file; run the ledger gate **stop pass** (items 1–3) in `SKILL.md` before `git rebase --continue`. Naming and untracked rules: **Non-negotiables** in `SKILL.md`.

Example filenames: `1.CONFLICT-auth.md`, `2.CONFLICT-api-client.md`.

### Required blocks

Every ledger is **what you got, then what you did**. Four blocks, always in this order:

1. **Title** — `## N.CONFLICT-<slug>` plus **exactly one** emoji, picked by the test:

   | Emoji | Kind | The test |
   |-------|------|----------|
   | ⚠️ | **Authored** | **Neither side could have produced this** in the conflict hunk — hand-blended, interfaces reconciled, callsites cleaned. |
   | ⚠️ | **Side-pick + parity gap** | **One side's text unchanged in the hunk**, but the **other side had independent behavior** (user-visible or contractual) that **Landed does not contain** and must be restored later (post-rebase ledger / follow-up commits). **Not** ☑️. |
   | ☑️ | **Verbatim + parity complete** | One side — or git's union — produced **Landed**, and the losing side had **no** independent behavior to preserve in this path, or union kept both. Zero hand edits in the hunk. |

   **Parity gap** is the common miss: `git checkout --theirs` looks "verbatim" but **drops `main` behavior** (SARIF disablement, new required inputs, etc.) until you port it. That is ⚠️, not ☑️.

   The emoji classifies the resolution for the summary index — **Landed** states the outcome. ☑️ = clear conflict resolve for this path at `git add` time. ⚠️ = read **Landed**, **Rationale:**, and when applicable **Dropped:** / **Parity:**. A union git already made is ☑️ only if parity is complete.

   Set the emoji when **Landed** is filled, not when the file is created: before the blend is done the test cannot be applied, and the title stays correctable until the path is staged.

2. **Header list** — `- **file:**` with the full repo-relative path, no abbreviated segments, one line per path the conflict involved (modify/delete: the surviving and the deleted path). When the path moved — any rename — `- **file:**` is the **resulting** filename, one line, and the old name is on the **Code** block headers. Then `- **applying:**` with the sha as **bare text** (GitLab links a bare sha, not a code span), the subject, and the conflict type in parentheses.

3. **Code** — captured from the conflict region **before** editing the file, because editing destroys the markers that carry both sides. **HEAD** then **Incoming**, each with a one-line description and the decisive snippet (verbatim and authored alike when both sides exist).

   Block headers take a ` — <path>` suffix **only on a rename** — HEAD = old path, Incoming = new — so the pair shows the move and each side's content stays bound to its own filename. Every other header is the bare side name.

4. **Landed** — always required; a ledger that ends at **Code** reads unfinished. Names the outcome in prose so the reader does not infer from **Incoming** (last contrast) or from ☑️ alone.

   **Verbatim + parity complete (☑️):** one sentence — took HEAD or Incoming verbatim, or named git union; prose only (winning snippet stays in **Code**).

   **Side-pick + parity gap (⚠️):** one sentence naming the winning side in the hunk; then mandatory lines (not headings):

   - **Dropped:** bullets — behavior that lived on the losing side (from **HEAD** when you took Incoming, and vice versa), concrete enough to verify after porting.
   - **Parity:** where it will be restored — `N.CONFLICT-post-rebase-<slug>.md` planned, or same-stop inline fix before continue.
   - **Rationale:** why the side-pick was acceptable before parity (e.g. branch architecture); one short line.

   **Authored blend (⚠️):** what you blended; **Rationale:**; fenced snippet when Landed is not identical to either **Code** block.

### Example (side-pick + parity gap ⚠️)

````markdown
## 1.CONFLICT-manual-ai-triage-button ⚠️

- **file:** `libs/.../manual-ai-triage-button.component.ts`
- **applying:** e1167c10a — feat(projects): AI triage feedback (AS-8260) (content)

### Code

**HEAD**

`main`: inputs/outputs + SARIF via parent template (`disabled`, `disabledI18nTooltip`).

**Incoming**

Branch: `IssueAiTriageUiStore`, no SARIF in this file.

### Landed

Took Incoming verbatim in the conflict hunk (store-backed button).

**Dropped:**

- SARIF scan disables manual triage + `SCAN-RESULT_DETAILS_SARIF-UNAVAILABLE-TOOLTIP` (was on `vuln-details` → button inputs).
- Approval toggle disabled while manual triage InProgress (was on `vuln-details` template).

**Parity:** `4.CONFLICT-post-rebase-sarif-manual-triage.md` after rebase verify; approval toggle restore only if product still wants it on `main`.

**Rationale:** replay commits use the store seam; `main` wiring is incompatible without porting into context/store, not into the old inputs.
````

### Example (verbatim + parity complete ☑️)

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

- **Rationale** — required on every ⚠️ ledger (never a `###` heading).
- **Dropped / Parity** — required on every ⚠️ **side-pick + parity gap** ledger before `git rebase --continue` on that stop. Empty **Dropped:** means you re-checked and the emoji must be ☑️ instead.
- **Post-rebase latent fixes** — `N.CONFLICT-post-rebase-<slug>.md`, same blocks, ⚠️ by the test (a latent fix is code neither side had); its `- **applying:**` carries the failing verify command in place of a sha.
- **The summary carries the flags** — `LEDGER-REBASE-SUMMARY.md` (assembled at the end of `SKILL.md` Step 2, after verify is green) mirrors the titles per [summary-template.md](summary-template.md); posting format: [mr-pr-formatting.md](mr-pr-formatting.md).
