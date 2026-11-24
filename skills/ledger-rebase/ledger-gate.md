# Ledger gate

Run **before** every `git rebase --continue`. Two passes — do not mix them:

- **Stop pass** (Step 1, each conflict stop): items **1–3** only. Item 4 does not apply yet.
- **Whole-run pass** — after Step 2 assembles the summary (items **1–4**); again after Step 3 when **Follow-up commits** may apply (items **1–5**). The summary is the *last* ledger artifact: post-rebase ledgers at Step 2, commit citations at Step 3.

Also run the whole-run pass before declaring Step 2 (items 1–4), Step 3 / Steps 4–**Done** (items 1–5) complete.

**Items 1–3** — for every conflicted path in scope (this stop, or the full run when checking item 4):

1. Untracked `N.CONFLICT-<slug>.md` exists at the **repository root** (match path to ledger via its `**file:**` line).
2. Ledger has all required blocks in [ledger-template.md](ledger-template.md) filled (blocks 1–4). Every ⚠️ ledger has **Rationale:**. Every ⚠️ **side-pick + parity gap** ledger has **Dropped:** and **Parity:** in **Landed** before continue.
3. Ledger paths are **not** staged (`git diff --cached --name-only` contains zero `CONFLICT-*.md`).

**Item 4** — whole-run pass only (after `LEDGER-REBASE-SUMMARY.md` exists):

4. Untracked `LEDGER-REBASE-SUMMARY.md` exists at repo root, is **not** staged, and covers every `N.CONFLICT-*.md` — its header, then **Onto:**, then one entry per ledger, each linking its ledger file; flags read from the ledger titles, not re-judged. Optional **Post-rebase ledgers** when post-rebase ledgers exist ([summary-template.md](summary-template.md)).

**Item 5** — whole-run pass only (after Step 3 when any fallout commit traces to conflict resolution):

5. When Step 3 created commits for conflict fallout, **Follow-up commits** is present and cites every such commit per [commit-citations.md](commit-citations.md). When zero such commits, item 5 is N/A (pass).

Check unmerged paths:

```bash
git diff --name-only --diff-filter=U
```

List ledgers at repo root:

```bash
ls -1 | grep -E '^[0-9]+\.CONFLICT-.*\.md$' || true
```

**Stop pass** when the unmerged list is empty for this stop, ledger count matches handled paths (one ledger per conflicted path), and every ledger satisfies items **1–3**.

**Whole-run pass** when every ledger satisfies items **1–3**, item **4** is satisfied, and item **5** is satisfied or N/A.

A green rebase with zero ledgers after conflicts = **Step 1 incomplete** — go back and write ledgers.