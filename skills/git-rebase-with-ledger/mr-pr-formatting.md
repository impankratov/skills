# MR/PR Note Formatting Rules (HARD)

The note body is **rendered Markdown**, not a dump of files. Follow all of these:

1. **Inline as real Markdown** — paste each ledger's body into the note as Markdown. Language fences stay **only** inside **Key code** snippets, as in the ledger template. Do not wrap the whole note or any ledger section in an outer ` ```markdown ` / ` ```md ` fence.

2. **Enumerate body sections by encounter order** — one numbered section per ledger file, same `N` as the filename. Section title is **plain text** (no backticks): strip `.md` from the filename, and **omit** the conflicted path (path lives under **Paths**):

    ```markdown
    ## 1. CONFLICT-<slug>
    ## 2. CONFLICT-<other>
    ```

    Drop the ledger's own `# Conflict: …` H1 when inlining so this heading owns the section (keep **Paths** / rest unchanged). On-disk file is `N. CONFLICT-<slug>.md`; note title is that name without `.md`.

3. **Separate conflicts** — put a horizontal rule `---` between the intro/summary and the first ledger, and between every pair of ledger sections.

4. **Hardest-conflicts summary is an unnumbered list** — use `-` bullets (not a second `1.`/`2.` list counter), hardest → lowest. Each bullet **starts with the same label** as the body section (`N.` + bold `CONFLICT-<slug>`, no backticks, no `.md`), then path/prose. Numbers must match body sections / filenames (never invent a second numbering). Related ledgers may share one bullet:

    ```markdown
    - 1. **CONFLICT-a** — **`<path>` (<type>)** — … **Resolution:** …
    - 2. **CONFLICT-b** / 3. **CONFLICT-c** — **`<path>`** — … **Resolution:** …
    ```

    Body section titles stay plain (`## 1. CONFLICT-a`); only the hardest list bolds the slug.

5. **No attachment / local-file disclaimers** — do not write lines like "ledger files below are local-only", "never committed", or "attached". Nothing is attached; content is already inlined.

6. **Format fixes** — if the user corrects note formatting, **edit the same note/thread** (forge update API) when possible; do not spam a second thread unless they ask.

Minimal skeleton:

```markdown
## Rebase conflict ledger (`<onto-ref>`)

<one short paragraph: onto what, verify status, rewrite/push caveat if any>

### Hardest conflicts (please re-check)

- 1. **CONFLICT-a** — **`<path>` (<type>)** — … **Resolution:** …
- 2. **CONFLICT-b** / 3. **CONFLICT-c** — **`<path>`** — … **Resolution:** …

---

## 1. CONFLICT-a

## Paths

- **Path:** `<full/repo-relative/path>`
…

---

## 2. CONFLICT-b

## Paths
…

---

## 3. CONFLICT-c

## Paths
…
```
