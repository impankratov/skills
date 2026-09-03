---
name: extract-issue
description: Dump an issue-tracker ticket to a local markdown report with attachments and linked wiki pages.
disable-model-invocation: true
---

# extract-issue

Produce a complete **dump** of an issue into a markdown report with local attachment files and linked wiki pages.

## Invoke

`extract issue <id|url>`, `dump this issue`, `dump <id>`.

## Execution

### Step 1 — Fetch issue data

Use the configured **issue tracker MCP** to fetch the issue with all comments.

If the issue has a parent, fetch the parent too.

**Completion**: All issue and parent data retrieved and stored.

### Step 2 — Fetch attachments

For each attachment on the issue, download to `<ISSUE_ID>-<N>.<ext>` (relative to CWD), where `<N>` is the 1-based index and `<ext>` is the original file's extension:

```bash
curl -s -o "<ISSUE_ID>-<N>.<ext>" "<url>"
```

Use the download URL from the tracker MCP attachment payload.

**Completion**: All attachment files written to CWD as `<ISSUE_ID>-<N>.<ext>`.

### Step 3 — Gather linked issues

From the tracker's link/relation data, follow these roles when present:

- blocked by — always relevant
- duplicates — always relevant
- relates to — fetch the linked issue summary; include only if its ID appears in the current issue's description
- subtask of / parent — fetch parent summary, include always

Map tracker-specific link type names onto these roles.

**Completion**: Linked issues list compiled.

### Step 4 — Dump wiki pages

Scan the issue description, comments, and linked issues for wiki URLs. For each unique page:

1. Extract a stable page id from the URL (path segment or query param the wiki uses).
2. Use the configured **wiki MCP** get-page tool; prefer markdown conversion when the tool supports it.
3. Save to `<ISSUE_ID>-wiki-<PAGE_ID>.md` (relative to CWD).
4. Add a report link: `[wiki: <title>](<ISSUE_ID>-wiki-<PAGE_ID>.md)`.

**Fallback for large pages**: If get-page fails or returns truncated content, retry without markdown conversion (raw HTML/storage format). If that also fails, warn and skip — tell the user to paste the page manually.

**Completion**: All reachable wiki pages dumped to `<ISSUE_ID>-wiki-<PAGE_ID>.md`.

### Step 5 — Generate markdown

Save the report to `<ISSUE_ID>.md` (relative to CWD). Populate each section from the issue using [`template.md`](template.md); omit template fields the tracker does not provide. Replace attachment links with relative paths like `[<ISSUE_ID>-1.jpeg](<ISSUE_ID>-1.jpeg)`. Extract workaround mentions from the description if present. Preserve comment author, timestamp, and text verbatim. Include a "Wiki References" section listing dumped wiki files.

**Completion**: Report saved to `<ISSUE_ID>.md` with all sections populated.

### Step 6 — Verify files exist

After writing the files, run:

```bash
test -f "<ISSUE_ID>.md" && echo "OK: report exists ($(wc -l < <ISSUE_ID>.md) lines)" || echo "FAIL: report missing"
for f in <ISSUE_ID>-wiki-*.md; do test -f "$f" && echo "OK: wiki $f exists" || echo "WARN: wiki $f missing"; done
```

If the report is missing, re-write it immediately. Proceed to Step 7 only after the report file exists.

**Completion**: File existence confirmed.

### Step 7 — Report

Print the file paths:

```
Extracted to <ISSUE_ID>.md (images as <ISSUE_ID>-<N>.<ext>, wiki pages as <ISSUE_ID>-wiki-<PAGE_ID>.md)
```

**Completion**: Paths reported.
