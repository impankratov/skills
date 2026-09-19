# AGENTS.md

Personal collection of agent skills (`skills/<name>/SKILL.md`). Install via
`npx skills` — see [README.md](README.md).

## First command — install skills if missing

Before any work: read `skills-lock.json`; if any skill listed there lacks
`.agents/skills/<name>/SKILL.md`, run `npx skills experimental_install`.

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

- Decide the invocation model (user-invoked / model-invoked) per new skill.
- No private / customer data in examples (fake SHAs, scopes, tickets).
- Keep `SKILL.md` lean; disclose long reference into sibling `.md` files
  with clear context pointers.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/)
(`feat` / `fix` / `docs` / `refactor` / `chore`, optional scope).
