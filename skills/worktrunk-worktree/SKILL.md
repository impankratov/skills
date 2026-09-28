---
name: worktrunk-worktree
description: >
  `wt` owns every branch switch, branch creation, and worktree creation in a
  Worktrunk-managed repo. Triggers on "create a worktree" or "create wt",
  "switch to branch X", "create branch X", and before any git checkout /
  git switch / git worktree add.
---

# worktrunk-worktree

Every branch switch, branch creation, and worktree creation goes through `wt` when the repo is **managed**; plain `git` otherwise. Commit, rebase, log, status, diff, and the rest stay plain `git` either way.

## Step 1 — Detect

Run in the repo you are about to act on:

```bash
git_common=$(git rev-parse --git-common-dir 2>/dev/null) || true
[ -n "$git_common" ] && [ -d "$git_common/wt" ]
```

Exit 0 → managed. Anything else → plain. The `wt/` directory under the git common dir is the only signal; a `project.feature-x` folder name proves nothing.

**Completion**: exit status read, tool for Step 2 picked.

## Step 2 — Switch or create the branch

Managed. `wt switch <branch>` to switch, `wt switch --create <branch>` to create and switch:

```bash
wt switch <branch>
wt switch --create <branch>
```

Worktrees are addressed by branch name, so `wt switch` lands on `<project>.<branch>` from any worktree in the repo.

Plain. `git switch <branch>` / `git switch --create <branch>`:

```bash
git switch <branch>
git switch --create <branch>
```

**Completion**: the shell sits on the target branch.

## Step 3 — Init a worktree you just created

Applies when *you* ran `--create` above. You own the lifecycle hooks: `wt switch`'s own hooks run in the background, so the next command in the new worktree races them.

```bash
wt switch --create <branch> --no-hooks
wt hook pre-start --foreground --yes
wt hook post-start --foreground --yes
```

`--no-hooks` detaches the spawn; the two `wt hook` calls are what run them, in the foreground, before the worktree is used. Post-start copies dependencies — on a repo with a few GiB of `node_modules` expect minutes, and treat a `✓ Copied N files` line as the done signal, not the spawn.

A blocked approval means the user has to decide it: stop and point them at `wt config approvals add` (policy in the `worktrunk` skill).

**Completion**: pre-start and post-start both exited, worktree usable.
