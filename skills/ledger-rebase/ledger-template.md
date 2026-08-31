# Ledger template

One untracked **ledger** per conflicted path at the **repository root**. Naming and untracked rules: **Non-negotiables** in `SKILL.md`.

Example filenames: `1. CONFLICT-auth.md`, `2. CONFLICT-api-client.md`.

## Required sections

Every ledger file MUST include these headings, filled in (no empty stubs):

````markdown
# Conflict: `<full/repo-relative/path>`

<!-- If renamed: title may list both, e.g. old → new, but **Paths** bullets must spell out each full path. -->

## Paths

- **Path:** `src/features/widgets/widget-list.ts`
  <!-- full repo-relative path; no abbreviated segments -->
- **Old path:** `src/legacy/settings/widget-list.ts`
  <!-- when renamed / content conflict spans two paths; else omit -->
- **New path:** `src/features/widgets/widget-list.ts`
  <!-- when renamed; else omit -->

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

Decisive differences as fenced snippets (not the whole file / not the whole diff). Prefer HEAD vs Incoming for the same region.

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
