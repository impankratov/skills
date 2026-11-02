---
name: extract-issue
description: Dump an issue-tracker ticket to a local markdown report with attachments and linked reference documents; when the issue has a parent, dump the parent too.
disable-model-invocation: true
---

# extract-issue

Produce a complete **dump** of an issue into a markdown report with local attachment files and linked reference documents.

## Invoke

`extract issue <id|url>`, `dump this issue`, `dump <id>`.

## Execution

### Step 1 — Fetch issue data

Use the configured **issue tracker MCP** to fetch the issue with all comments.

If the issue has a parent, fetch the parent with all of its comments too.

A child issue often repeats little of the requirement; the parent carries scope and acceptance context. When the target issue's description is thin, extracting only the child loses what you need to work — treat the parent as part of the dump, not background metadata.

**Completion**: Issue and its comments retrieved; when a parent exists, the parent and its comments retrieved as well.

### Step 2 — Fetch attachments

For **each issue you are dumping** (the target and, when present, its parent), download attachments to `<ISSUE_ID>-<N>.<ext>` (relative to CWD), where `<ISSUE_ID>` is that issue's id, `<N>` is the 1-based index, and `<ext>` is the original file's extension:

```bash
curl -s -o "<ISSUE_ID>-<N>.<ext>" "<url>"
```

Use the download URL from the tracker MCP attachment payload.

**Completion**: All attachment files for every dumped issue written to CWD.

### Step 3 — Gather linked issues

For **each issue you are dumping**, compile linked issues the same way.

The tracker may expose link roles directly, or only link counts. When roles are not exposed, retrieve the linked issues and infer each role from its summary and state, then mark it in the report as inferred.

Follow these roles:

- blocked by — always relevant
- duplicates — always relevant
- relates to — fetch the linked issue summary; include only if its ID appears in the current issue's description
- subtask of / parent — on the **target** report, point at the parent's dump file; do not substitute a one-line summary for the full parent extract
- blocks — include (it depends on this issue)

Map tracker-specific link type names onto these roles.

**Completion**: Linked issues list compiled for every dumped issue; every role either read from the tracker or explicitly marked inferred.

### Step 4 — Dump linked reference documents

For **each issue you are dumping**, collect every reference URL in that issue's description, comments, and linked-issue summaries. When a linked document is accessible, save it alongside that issue's report; this includes wiki pages, ADRs, specs, and any other external document.

For each unique URL (per issue being dumped):

1. Fetch the document with an available tool for its source; prefer markdown when supported.
2. Save to `<ISSUE_ID>-<kind>-<slug>.md` (relative to CWD), where `<ISSUE_ID>` is that issue's id and `<kind>` is the document type, such as `wiki`, `adr`, or `spec`.
3. Add a report link: `[<kind>: <title>](<ISSUE_ID>-<kind>-<slug>.md)`.

**Fallback**: If a document cannot be read (auth error, truncation, unavailable), retry with the raw/source format. If it still fails, list the URL under Reference Documents with a warning.

**Completion**: Every collected reference URL for every dumped issue is either saved as a local file or listed in that issue's report as skipped with its URL and reason.

### Step 5 — Generate markdown

Write **one report file per dumped issue**: `<ISSUE_ID>.md` for the target and, when a parent exists, `<PARENT_ID>.md` for the parent. When a parent exists, complete the parent's report before the target's.

Populate each section from the corresponding issue using [`template.md`](template.md); omit template fields the tracker does not provide. Replace attachment links with relative paths like `[<ISSUE_ID>-1.jpeg](<ISSUE_ID>-1.jpeg)`. Extract workaround mentions from the description if present. Preserve comment author, timestamp, and text verbatim. Include a "Reference Documents" section listing every dumped document and every skipped reference URL with its reason.

In the target report, link the parent's report file instead of inlining the parent as the only source of requirement text.

**Completion**: Every required report file exists in CWD with all sections populated for its issue.

### Step 6 — Verify files exist

After writing the files, run:

```bash
test -f "<ISSUE_ID>.md" && echo "OK: report exists ($(wc -l < <ISSUE_ID>.md) lines)" || echo "FAIL: report missing"
test -z "<PARENT_ID>" || test -f "<PARENT_ID>.md" && echo "OK: parent report exists" || echo "FAIL: parent report missing"
shopt -s nullglob
for f in <ISSUE_ID>-*.md; do test -f "$f" && echo "OK: reference $f exists" || echo "WARN: reference $f missing"; done
```

If any required report is missing, re-write it immediately. Proceed to Step 7 only after every report this issue requires exists.

**Completion**: File existence confirmed for the target report and for the parent report when the issue has a parent.

### Step 7 — Report

Print every report path you wrote (target and parent when applicable), plus attachment and reference naming patterns the user should expect.

Then list every reference document that could not be fetched, with its URL and reason, so the user sees what is missing and can paste it manually. When nothing was skipped, say so.

**Completion**: Paths reported, and every skipped reference URL is surfaced in the chat or explicitly reported as none.
