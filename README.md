# skills

[![skills.sh](https://skills.sh/b/impankratov/skills)](https://skills.sh/impankratov/skills)

Personal agent skills for web and general development tasks.

## Skills

### ledger-rebase

Rebases die on conflicts: files half-merged, decisions lost, comments posted too early. A conflict ledger records every resolution, verifies the result, keeps fallout in a separate commit, makes you ask before commenting on an MR, and posts a summary thread flagging which conflicts are worth verifying.

Install: `npx skills add impankratov/skills -g -s ledger-rebase`

### extract-issue

A Jira or YouTrack ticket is useless in an agent session until it's pulled into a local markdown report with its attachments and linked wiki pages. This does exactly that.

Install: `npx skills add impankratov/skills -g -s extract-issue`

### fix-review-threads

Twenty comments on an MR bury the open questions. Go one thread at a time: fix what you can with a commit, reply to the easy ones, park the rest for a human.

Install: `npx skills add impankratov/skills -g -s fix-review-threads`

### git-commit

Your commit history is your changelog. This writes it the way the project expects: changes analyzed, split into logical commits, messages following the project's conventions.

Install: `npx skills add impankratov/skills -g -s git-commit`

### git-pr

Every project wants its MRs a certain way. This reads the project's rules, pushes the branch, and creates the MR on the right target with the right fields.

Install: `npx skills add impankratov/skills -g -s git-pr`

### simplify-component-inputs

A component that accepts a whole object is coupled to its caller. This finds those call sites, traces which properties the component really uses, and shows you the minimum input surface it needs.

Install: `npx skills add impankratov/skills -g -s simplify-component-inputs`