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
2. Author under `skills/<name>/SKILL.md`.
3. Update [README.md](README.md) (blurb + install line) when adding a skill.
4. Verify with `writing-for-agents` → then commit.

### README blurbs (humans)

[README.md](README.md) sells each skill to **people** choosing what to
install: the pain, the outcome, when it earns a slot in the workflow. Keep
blurbs short and human-readable. Do **not** mirror `SKILL.md` — no agent
steps, lint gates, leading words, or branch-by-branch mechanics. That
material stays in the skill (single source for the agent).

Touch README on **create** (blurb + install line). On **edit**, touch it
only when the human-facing promise changes — rename, install path, or the
core idea a reader should remember — not when you add internal agent gates
or disclosed reference.

### Edit

1. Activate `writing-for-agents`.
2. Edit the skill; update README only per [README blurbs](#readme-blurbs-humans).
3. Verify with `writing-for-agents` → then commit.

## Conventions

- Decide the invocation model (user-invoked / model-invoked) per new skill.
- No private / customer data in examples (fake SHAs, scopes, tickets).
- Keep `SKILL.md` lean; disclose long reference into sibling `.md` files
  with clear context pointers.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/)
(`feat` / `fix` / `docs` / `refactor` / `chore`, optional scope).
