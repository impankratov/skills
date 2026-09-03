# skills

Collection of personal agent skills for web and general development tasks.

```text
skills/
  <skill-name>/
    SKILL.md
```

## Skills

### extract-issue

**Dump** an issue-tracker ticket to a local markdown report with attachments and linked wiki pages (via configured issue tracker + wiki MCPs).

Invoke: **`extract-issue`**, **`extract issue`**, **`dump this issue`**, **`dump <id>`**.

### ledger-rebase

Rebase overlay: **ledger-first** — one untracked ledger per conflicted path (gate before continue), project-doc verify, fallout commit, optional MR thread.

Invoke: **`ledger-rebase`**, **`ledger rebase`**, **`rebase-with-ledger`**, **`rebase with ledger`**.

## Install

```bash
npx skills add impankratov/skills -g -s extract-issue
npx skills add impankratov/skills -g -s ledger-rebase
```
