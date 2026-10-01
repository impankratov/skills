# MR/PR ledger-thread formatting

**ledger-thread** — one new discussion per `N.CONFLICT-*.md`, encounter order (`N`). One thread carries one ledger. After every ledger thread: one **summary thread** — the rebase index, its ledger references turned into links.

## Scope (what belongs in an MR comment)

| In scope | Out of scope |
|----------|--------------|
| One `N.CONFLICT-*.md` as a folded thread (formatted below) | Rebase changelog, verify results, commit SHAs |
| **Summary thread** — `LEDGER-REBASE-SUMMARY.md`: a numbered list — one item per ledger, the ledger's `N` as the list marker (`N. CONFLICT-<slug>` + `⚠️` when that ledger's title carries ⚠️), each slug a link to that conflict's thread | "Work done" or agent status notes |
| | Combined dump of multiple ledgers |
| | A conflict thread linking its own ledger without inlining the body |

Step 5 **yes** means push, then ledger threads + summary thread — and it is not a substitute for the Step 4 chat handoff.

## Format each thread

The note body is **rendered Markdown**, not a dump of files.

1. **Fold the whole ledger** — the title line goes into the `<summary>` as plain text (drop the `## `) and the body follows inside the same `<details>`, so a collapsed thread is one line and the page never shows a wall of code:

    ```markdown
    <details>
    <summary>2.CONFLICT-widget-list ⚠️</summary>

    - **file:** `src/features/widgets/widget-list.ts`
    …

    </details>
    ```

    Four constraints on that markup:

    - **Accessible name** — `<summary>` is the disclosure's only accessible name, so it carries the full title verbatim: slug and emoji, no `## `, no path (the path is the `- **file:**` line inside).
    - **Blank lines** — mandatory around the body; without them the forge renders the Markdown as literal text.
    - **Raw HTML** — the fold is never a fenced block; language fences stay **only** inside the ledger's own snippets (HEAD / Incoming / Landed), as in [ledger-template.md](ledger-template.md).
    - **Collapsed** — never `<details open>`.

2. **Inline only** — the folded body is the ledger's content unchanged; skip attachment lines and local-file meta.

3. **Format fixes** — if the user corrects a conflict's note, **edit that same thread** (forge update API). Do not merge it back into a combined dump.

Minimal skeleton (**one note = one ledger**):

```markdown
<details>
<summary>1.CONFLICT-a ☑️</summary>

- **file:** `<full/repo-relative/path>`
- **applying:** `<sha>` — `<subject>` (`<type>`)
…

</details>
```

## Summary thread

Posted **last**, after every ledger thread — its links need the ledger thread URLs to exist first.

The thread carries the on-disk `LEDGER-REBASE-SUMMARY.md` as-is, with one change: repoint each item's file link from the ledger file to that conflict's thread URL — `N. [CONFLICT-<slug>](<that conflict's thread url>)`. The `## Ledger-rebase summary` header and the **Onto:** line stay; list markers and `⚠️` marks stay verbatim. No paths, no ledger bodies — the linked thread already carries all of it.

Minimal skeleton:

```markdown
## Ledger-rebase summary

**Onto:** `origin/main`

1. [CONFLICT-auth](https://…/discussions/…)
2. [CONFLICT-api-client](https://…/discussions/…) ⚠️
3. [CONFLICT-widgets](https://…/discussions/…)
```

## Post order

**Push the rebased commits before the first thread** — the MR diff must match the ledgers; never post threads against a stale diff. Post ledger threads in encounter order (`1`, then `2`, …), then the **summary thread last**. Separate API call per thread — never batch ledgers into one note. The summary thread is the only note spanning multiple ledgers, and it carries links and flags, never bodies.
