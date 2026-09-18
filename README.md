# skills

[![skills.sh](https://skills.sh/b/impankratov/skills)](https://skills.sh/impankratov/skills)

Personal collection of agent skills for web and general development tasks.

## Skills

### ledger-rebase

Rebase with a conflict ledger — record each conflict's resolution, verify the result, commit fallout separately, and ask before commenting on the MR.

Invoke: **`ledger-rebase`**, **`ledger rebase`**, **`rebase-with-ledger`**, **`rebase with ledger`**.

Install: `npx skills add impankratov/skills -g -s ledger-rebase`

### extract-issue

Pull an issue out of the tracker into a local markdown report, complete with its attachments and linked wiki pages.

Invoke: **`extract-issue`**, **`extract issue`**, **`dump this issue`**, **`dump <id>`**.

Install: `npx skills add impankratov/skills -g -s extract-issue`

### fix-review-threads

Work an MR/PR review one thread at a time — skip resolved threads, fix the rest by committing and pushing, and park the ones that need a human.

Invoke: **`fix-review-threads`**, **`fix review threads`**, **`MR/PR review reply`**, **`reply with commit`**.

Install: `npx skills add impankratov/skills -g -s fix-review-threads`

### git-commit

Create git commits the way the project expects: analyze the changes, split them into logical commits, and follow the project's commit conventions.

Invoke: **`commit`**, **`commit changes`**, **`commit and MR`**.

Install: `npx skills add impankratov/skills -g -s git-commit`

### git-pr

Create a merge request or pull request the way the project expects: read its MR/PR docs, push the branch, and create it with the project's tooling.

Invoke: **`create MR`**, **`create PR`**, **`commit and MR`**.

Install: `npx skills add impankratov/skills -g -s git-pr`

### simplify-component-inputs

Find places that hand a whole object to a component input, trace which properties the component really uses, and propose passing only those.

Invoke: **`simplify component inputs`**, **`simplify inputs`**, **`input slimming`**, **`pass only required props`**.

Install: `npx skills add impankratov/skills -g -s simplify-component-inputs`