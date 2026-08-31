# Ledger template

Create **one file per conflicted path** at the **repository root**:

```text
N. CONFLICT-<slug>.md
```

- `N` = encounter ordinal for this rebase run (`1`, `2`, `3`, …). Increment for every new ledger, including post-rebase ones.
- `<slug>` = short kebab path hint (e.g. `auth`, `api-client`, `user-settings`).

Example: `1. CONFLICT-auth.md`, `2. CONFLICT-api-client.md`.

Non-negotiables (untracked ledgers, naming, full paths, key code, union): **SKILL.md**.

## Required sections

Every ledger file MUST include these headings, filled in (no empty stubs):

````markdown
# Conflict: `<full/repo-relative/path>`

<!-- If renamed: title may list both, e.g. old → new, but **Paths** bullets must still spell out each full path with no `...`. -->

## Paths

- **Path:** `src/features/widgets/widget-list.ts`
  <!-- replace with the real full repo-relative path; NEVER abbreviate with `...` -->
- **Old path:** `src/legacy/settings/widget-list.ts`
  <!-- required when renamed / content conflict spans two paths; else omit this bullet -->
- **New path:** `src/features/widgets/widget-list.ts`
  <!-- required when renamed; else omit this bullet -->

Reviewer must be able to open every listed path as written (copy-paste into the editor).

## Rebase context

- **Onto:** `<target ref, e.g. origin/main>`
- **Commit being applied:** `<sha>` — `<subject>`
- **Conflict type:** content | modify/delete | add/add | rename+content | …

## Both sides

| Side | What it wanted |
|------|----------------|
| **HEAD** (`<target during rebase>`) | … |
| **Incoming** (`<commit being applied>`) | … |

## Key code

Show the decisive differences as fenced snippets (not the whole file / not the whole diff). Prefer before/after or HEAD vs Incoming for the same region.

### HEAD

```ts
// decisive snippet from HEAD side
```

### Incoming

```ts
// decisive snippet from Incoming side
```

### Landed (if different from a pure pick)

```ts
// what is in the tree after resolution
```

Incomplete without **Key code** snippets — finish the ledger before continuing the rebase.

## Resolution

What landed in the tree (be concrete: kept both X and Y; took HEAD module shape; deleted path because …). Reference the snippets above.

## Rationale

Why that resolution preserves both features / matches architecture / is safe.

## Verification notes

Conflict markers gone; path staged or deleted as intended; any follow-up risk for reviewers.
````

## Template notes

- **Modify/delete** — document which side won; **Paths** lists surviving and deleted full paths.
- **Post-rebase latent fixes** — `N. CONFLICT-post-rebase-<slug>.md`, same sections; Incoming = `N/A — latent after merge`; continue the `N` sequence.
