# MR/PR ledger-thread formatting

**ledger-thread** — one new discussion per `N. CONFLICT-*.md`, encounter order (`N`). One thread carries one ledger's full body. After every ledger thread: one **summary thread** — the rebase index, its ledger references turned into links.

## Scope (what belongs in an MR comment)

| In scope | Out of scope |
|----------|--------------|
| Full body of one `N. CONFLICT-*.md` (formatted below) | Rebase changelog, verify results, commit SHAs |
| **Summary thread** — `N. LEDGER-REBASE-SUMMARY.md`: a numbered list — one item per ledger, the ledger's `N` as the list marker (`N. CONFLICT-<slug>` + `⚠️` when that ledger's **Worth verifying** flags `⚠️ yes`), each slug a link to that conflict's thread | "Work done" or agent status notes |
| | Combined dump of multiple ledgers |
| | A conflict thread linking its own ledger without inlining the body |

Step 5 **yes** means ledger threads + summary thread only — not a substitute for Step 4 chat handoff.

## Format each thread

The note body is **rendered Markdown**, not a dump of files.

1. **Inline as Markdown** — paste that ledger's body into **its** note. Language fences live **only** inside ledger code snippets (HEAD / Incoming / Landed), as in the template. The note is plain Markdown — no outer ` ```markdown ` / ` ```md ` wrapper.

2. **Section title** — plain text (no backticks): strip `.md` from the filename, and **omit** the conflicted path (path is the bold path line):

    ```markdown
    ## 1. CONFLICT-<slug>
    ```

    On-disk file is `N. CONFLICT-<slug>.md`; note title is that name without `.md`. The ledger has no H1 (filename is the title) — keep the bold path line and all blocks unchanged.

3. **Inline only** — paste the ledger body; skip attachment lines and local-file meta.

4. **Format fixes** — if the user corrects a conflict's note, **edit that same thread** (forge update API). Do not fold it back into a combined dump.

Minimal skeleton (**one note = one ledger**):

```markdown
## 1. CONFLICT-a

**`<full/repo-relative/path>`**

### Context

- **Onto:** `<target>`
- **Applying:** `<sha>` — `<subject>` (`<type>`)
…
```

## Summary thread

Posted **last**, after every ledger thread — its links need the ledger thread URLs to exist first.

Body = the on-disk `N. LEDGER-REBASE-SUMMARY.md` with the **single change**: each item's slug becomes a link — `N. [CONFLICT-<slug>](<that conflict's thread url>)`. List markers and `⚠️` marks stay verbatim. No paths, no why-lines, no ledger bodies — the linked thread already carries all of it.

Minimal skeleton:

```markdown
1. [CONFLICT-auth](https://…/discussions/…)
2. [CONFLICT-api-client](https://…/discussions/…) ⚠️
3. [CONFLICT-widgets](https://…/discussions/…)
```

## Post order

Post ledger threads in encounter order (`1`, then `2`, …), then the **summary thread last**. Separate API call per thread — never batch ledgers into one note. The summary thread is the only note spanning multiple ledgers, and it carries links and flags, never bodies.
