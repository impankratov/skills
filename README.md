# skills

Collection of personal agent skills for web and general development tasks.

```text
skills/
  <skill-name>/
    SKILL.md
```

## Skills

### ledger-rebase

Rebase overlay: **ledger-first** — one untracked ledger per conflicted path (gate before continue), project-doc verify, fallout commit, optional MR thread.

Invoke: **`ledger-rebase`**, **`ledger rebase`**, **`rebase-with-ledger`**, **`rebase with ledger`**.

### rebase-with-ledger

Alias for `ledger-rebase` (same workflow; keeps the old hyphenated name installable).

## Install

```bash
npx skills add impankratov/skills -g -s ledger-rebase -s rebase-with-ledger
```

