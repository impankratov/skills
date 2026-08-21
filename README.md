# skills

Collection of personal agent skills for web and general development tasks.

```text
skills/
  <skill-name>/
    SKILL.md
```

## Skills

### git-rebase-with-ledger

Automates git rebase conflict resolution with ledger files for every conflicted path. Each ledger documents the conflict with full paths, code snippets, and a summary — so you (or a reviewer) can understand what changed on each side without digging through diffs. After resolving, it verifies the result against project docs, commits any fallout, and hands the ledgers to you for review (never committed to the branch).

> This skill wraps the external [`git-rebase` skill](https://github.com/pedronauck/skills/blob/main/skills/mine/git-rebase/SKILL.md) from [pedronauck/skills](https://github.com/pedronauck/skills).

## Install

```bash
npx skills add impankratov/skills -g -s git-rebase-with-ledger
```

