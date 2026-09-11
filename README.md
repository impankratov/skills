# skills

[![skills.sh](https://skills.sh/b/impankratov/skills)](https://skills.sh/impankratov/skills)

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

### fix-review-threads

MR/PR review loop: **thread-by-thread** — unresolved only; Fix (commit→push→reply), Easy question (reply), Hard parked at end; forge via `glab` / `gh`.

Invoke: **`fix-review-threads`**, **`fix review threads`**, **`MR/PR review reply`**, **`reply with commit`**.

### git-commit

**Create** clean conventional commits — analyze, split, stage, message — following the project's commit guidelines (fallback: conventional commits with scope).

Invoke: **`commit`**, **`commit changes`**, **`commit and MR`**.

### git-pr

**Create** merge requests / pull requests per project conventions — read the project's MR docs in full, push the branch, create via the project's tooling (`glab` / `gh`).

Invoke: **`create MR`**, **`create PR`**, **`commit and MR`**.

## Install

```bash
npx skills add impankratov/skills -g -s extract-issue
npx skills add impankratov/skills -g -s ledger-rebase
npx skills add impankratov/skills -g -s fix-review-threads
npx skills add impankratov/skills -g -s git-commit
npx skills add impankratov/skills -g -s git-pr
```
