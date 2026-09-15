# AGENTS.md

Personal collection of agent skills (`skills/<name>/SKILL.md`). Install via
`npx skills` — see [README.md](README.md).

## First command — `npx skills experimental_install`

This repo manages project skills with `npx skills`: `skills-lock.json`
(tracked) is the source of truth for what is installed; installed skills land
in `.agents/` (gitignored). Run the command above before any work so skills
are present.

Add a skill: `npx skills add <owner>/<repo> -s <name>` (updates the lock
file). Update all: `npx skills update`.

## HARD RULE — `writing-for-agents` on every skill change

Before creating or editing any skill under `skills/`, **read and follow**
the `writing-for-agents` skill (load / activate it first). Do not draft
or rewrite a `SKILL.md` from memory of that guidance.

When skill edits are **done and ready to commit** (or the user asks to
commit), run a **verify pass** with `writing-for-agents` again against
the final `SKILL.md` (and any disclosed sibling files it links). Fix
findings before committing. Skipping the verify pass is a protocol
failure.

### Create

1. Activate `writing-for-agents`.
2. Activate `create-skill` when structuring a new skill folder / frontmatter.
3. Author under `skills/<name>/SKILL.md`.
4. Update [README.md](README.md) (blurb + install line) when adding a skill.
5. Verify with `writing-for-agents` → then commit.

### Edit

1. Activate `writing-for-agents`.
2. Edit the skill (keep README in sync if name, invoke phrases, or
   behaviour summary change).
3. Verify with `writing-for-agents` → then commit.

## Conventions

- Prefer **user-invoked** (`disable-model-invocation: true`) unless the
  skill must auto-fire from ambient context; match sibling skills in
  this repo.
- User-invoked `description`: short human one-liner. Put invoke aliases
  in the body under `## Invoke`.
- No private / customer data in examples (fake SHAs, scopes, tickets).
- Keep `SKILL.md` lean; disclose long reference into sibling `.md` files
  with clear context pointers.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/)
(`feat` / `fix` / `docs` / `refactor` / `chore`, optional scope).
