---
name: simplify-component-inputs
description: Check a component's inputs where a whole object is passed and propose the minimum surface — only the props the component consumes.
disable-model-invocation: true
---

# simplify-component-inputs

Find component call sites where a whole object is passed as an input, trace which properties the component actually consumes, and propose changes that pass only the required **surface**.

## Invoke

`simplify component inputs`, `simplify inputs`, `input slimming`, `pass only required props`.

## Execution

### Step 1 — Scope the component

Identify the component from the user's request and its implementation files: source module (`.ts`, `.tsx`, `.js`), template (`.vue`, `.svelte`, `.angular.html`, `.html`), and any local wrapper around it.

**Completion**: a list of the component's files and its declared input/props.

### Step 2 — Find call sites

Search the project for every instantiation of the component. For each call site, record `file:line` and the exact object expression passed to each input.

**Completion**: every instantiation accounted for, with the passed object expression quoted per call site.

### Step 3 — Trace consumed properties

Walk the component's source and template and record every property the component actually reads: bindings, method arguments, and any property forwarded through text interpolation.

**Completion**: every passed property tagged **consumed** or **unconsumed**, each with the `file:line` that proves it.

### Step 4 — Classify the surface

Apply this order per passed property:

1. **unconsumed** — dropped from the proposal.
2. **security-sensitive** — a token, secret, credential, session, user, or PII container — never passed as a whole object; reduce to the consumed scalars only.
3. **consumed** — kept as-is.

A property is security-sensitive by kind, not by a name list — judge it against the codebase's real security vocabulary (auth, licenses, keys, personal data).

**Completion**: properties classified exhaustively with no overlaps or gaps.

### Step 5 — Propose changes

For every finding, produce the concrete edit: the narrowed prop list at the call site, and — where a single input was the whole object — the component-side change (an object input reduced to a scalar or an optional prop pair). Proposed edits keep current behavior identical: same rendered output and same event flow before and after.

**Completion**: each finding carries a copyable diff-ready edit; ambiguous cases (rest-spread, optional chaining) are called out.

### Step 6 — Report

Output the findings grouped by component file: property → class → recommendation. Order sections by value: security-sensitive first, then unconsumed, then the rest.

**Completion**: every property from Step 3 appears exactly once in the report.