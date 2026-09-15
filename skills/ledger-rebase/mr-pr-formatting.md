# MR/PR ledger-thread formatting

**ledger-thread** — one new discussion per `N. CONFLICT-*.md`, encounter order (`N`). One thread carries one ledger's full body.

## Scope (what belongs in an MR comment)

| In scope | Out of scope |
|----------|--------------|
| Full body of one `N. CONFLICT-*.md` (formatted below) | Rebase summary, changelog, verify results, commit SHAs |
| | "Work done" or agent status notes |
| | Combined dump of multiple ledgers |
| | Links to ledgers without inlining the body |

Step 5 **yes** means ledger-threads only — not a substitute for Step 4 chat handoff.

## Format each thread

The note body is **rendered Markdown**, not a dump of files.

1. **Inline as Markdown** — paste that ledger's body into **its** note. Language fences live **only** inside **Key code** snippets (as in the ledger template). The note is plain Markdown — no outer ` ```markdown ` / ` ```md ` wrapper.

2. **Section title** — plain text (no backticks): strip `.md` from the filename, and **omit** the conflicted path (path lives under **Paths**):

    ```markdown
    ## 1. CONFLICT-<slug>
    ```

    Drop the ledger's own `# Conflict: …` H1 when inlining so this heading owns the section (keep **Paths** / rest unchanged). On-disk file is `N. CONFLICT-<slug>.md`; note title is that name without `.md`.

3. **Inline only** — paste the ledger body; skip attachment lines and local-file meta.

4. **Format fixes** — if the user corrects a conflict's note, **edit that same thread** (forge update API). Do not fold it back into a combined dump.

Minimal skeleton (**one note = one ledger**):

```markdown
## 1. CONFLICT-a

## Paths

- **Path:** `<full/repo-relative/path>`
…
```

## Post order

Post threads in ledger order (`1`, then `2`, …). Separate API call per thread — never batch ledgers into one note.
