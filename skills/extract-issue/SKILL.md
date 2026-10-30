---
name: extract-issue
description: Dump an issue-tracker ticket to a local markdown report with attachments and linked reference documents.
disable-model-invocation: true
---

# extract-issue

Produce a complete **dump** of an issue into a markdown report with local attachment files and linked reference documents.

## Invoke

`extract issue <id|url>`, `dump this issue`, `dump <id>`.

## Execution

### Step 1 — Fetch issue data

Use the configured **issue tracker MCP** to fetch the issue with all comments.

If the issue has a parent, fetch the parent too. Keep the parent's description, summary, Acceptance Criteria, and Definition of Ready/Done (DOR/DOD) criteria. Drop empty templates and news.

**Completion**: Issue, comments, and parent summary/AC/DOR/DOD retrieved.

### Step 2 — Fetch attachments

For each attachment on the issue, download to `<ISSUE_ID>-<N>.<ext>` (relative to CWD), where `<N>` is the 1-based index and `<ext>` is the original file's extension:

```bash
curl -s -o "<ISSUE_ID>-<N>.<ext>" "<url>"
```

Use the download URL from the tracker MCP attachment payload.

**Completion**: All attachment files written to CWD as `<ISSUE_ID>-<N>.<ext>`.

### Step 3 — Gather linked issues

The tracker may expose link roles directly, or only link counts. When roles are not exposed, retrieve the linked issues and infer each role from its summary and state, then mark it in the report as inferred.

Follow these roles:

- blocked by — always relevant
- duplicates — always relevant
- relates to — fetch the linked issue summary; include only if its ID appears in the current issue's description
- subtask of / parent — fetch parent summary, include always
- blocks — include (it depends on this issue)

Map tracker-specific link type names onto these roles.

**Completion**: Linked issues list compiled; every role either read from the tracker or explicitly marked inferred.

### Step 4 — Dump linked reference documents

Collect every reference URL in the issue description, comments, linked-issue summaries, and the parent description/AC. When a linked document is accessible, save it alongside the issue report; this includes wiki pages, ADRs, specs, and any other external document.

For each unique URL:

1. Fetch the document with an available tool for its source; prefer markdown when supported.
2. Save to `<ISSUE_ID>-<kind>-<slug>.md` (relative to CWD), where `<kind>` is the document type, such as `wiki`, `adr`, or `spec`.
3. Add a report link: `[<kind>: <title>](<ISSUE_ID>-<kind>-<slug>.md)`.

**Fallback**: If a document cannot be read (auth error, truncation, unavailable), retry with the raw/source format. If it still fails, list the URL under Reference Documents with a warning.

**Completion**: Every collected reference URL is either saved as a local file or listed in the report as skipped with its URL and reason.

### Step 5 — Generate markdown

Save the report to `<ISSUE_ID>.md` (relative to CWD). Populate each section from the issue using [`template.md`](template.md); omit template fields the tracker does not provide. Replace attachment links with relative paths like `[<ISSUE_ID>-1.jpeg](<ISSUE_ID>-1.jpeg)`. Extract workaround mentions from the description if present. Preserve comment author, timestamp, and text verbatim. Include a "Reference Documents" section listing every dumped document and every skipped reference URL with its reason.

**Completion**: Report saved to `<ISSUE_ID>.md` with all sections populated.

### Step 6 — Verify files exist

After writing the files, run:

```bash
test -f "<ISSUE_ID>.md" && echo "OK: report exists ($(wc -l < <ISSUE_ID>.md) lines)" || echo "FAIL: report missing"
shopt -s nullglob
for f in <ISSUE_ID>-*.md; do test -f "$f" && echo "OK: reference $f exists" || echo "WARN: reference $f missing"; done
```

If the report is missing, re-write it immediately. Proceed to Step 7 only after the report file exists.

**Completion**: File existence confirmed.

### Step 7 — Report

Print the file paths:

```
Extracted to <ISSUE_ID>.md (attachments as <ISSUE_ID>-<N>.<ext>, reference documents as <ISSUE_ID>-<kind>-<slug>.md)
```

Then list every reference document that could not be fetched, with its URL and reason, so the user sees what is missing and can paste it manually. When nothing was skipped, say so.

**Completion**: Paths reported, and every skipped reference URL is surfaced in the chat or explicitly reported as none.
