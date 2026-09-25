# streetmix/streetmix context

> refreshed 2026-09-25 | upstream default: main @ f17578eec (fork synced)

## Identity & policies

- upstream: streetmix/streetmix; default branch `main`; primary lang JavaScript/TypeScript (npm workspaces: client/server/i18n, Vitest 5, Parcel); English-first (UI + issues in English)
- CLA/DCO: none observed (CONTRIBUTING only links docs; no CLA bot on merged PRs)
- AI-assisted PR policy: unstated (no AI policy file found; org `streetmix/.github` contains only a profile README)
- signed commits required: no (branch protection does not require signatures)
- PR template: `.github/PULL_REQUEST_TEMPLATE/pull_request_template.md` (fetch + fill verbatim; has a "# Test process" checklist + "# Requirements to merge" checklist)
- external tracker: GitHub
- maintainer: `louh` (Bad Idea Factory); also org-owned with several outside contributors merging

## Conventions

- branch naming: merged external PRs use `<owner>/<desc>` or `fix/<desc>`; maintainer uses `louh/<desc>`; our existing fork PRs used `fix/<desc>` (kept here)
- commit style: Conventional Commits (`fix:`, `chore:`, `a11y:`, `feat:`) enforced by `.github/workflows/commitlint.yml`
- test: `npm run vitest` (client + server projects); lint: `npm run lint` (`stylelint "./client/**/*.css"` + `eslint`); build via tsc/parcel
- CI: `ci.yml` runs lint + unit/integration matrix (Node 22/24/26) + E2E; `docs-argos.yml` (visual, needs upstream ARGOS token on forks)

## Maintainer picture

- `louh` is primary; active, responsive; gave a substantive review to outside a11y contributor PR #3629 (closed-unmerged)
- in-flight maintainer areas to avoid: louh/* branches (coastmix, flood-check, rain-gardens, updates, ts-update) and easherma/backend auth work

## Issue-area health

- 200 open issues; the majority are stale "segment ideas" from 2019-2021 (no maintainer response) — not viable picks
- `#3771` Hardcoded Cookie-Session Secret fallback (`seger handrail`) when `COOKIE_SESSION_SECRET` unset (2026-09-12, open, author 28Hus, no maintainer comment) — verifiable security hardening; fix fails closed when secret missing in production — status: pr-opened — fork PR `https://github.com/olitreadwell/streetmix/pull/26` head `fix/require-cookie-session-secret`
- `#2227` re-roll of scattered items (`good first contribution`) — deferred feature, too big
- closed-unmerged `#3629` (bmortimer focus-trap/aria-modal): louh liked the trap but flagged focus-restore + h1-focus concerns; steered toward native `<dialog>` / Radix-UI (Radix is already a client dependency); outcome = hand-rolled focus-trap approach REJECTED

## Gap ledger (dedupe — READ FIRST, never re-pick)

- `2026-08-26` fork PR `#10` `fix/add-missing-img-alt-attributes` (a11y) — pr-opened on fork, awaiting Oli
- `2026-08-26` `fix/remove-sensitive-token-logging` (security) — fork PR `#1`, closed on the fork
- `2026-09-09` `#3751` dialog a11y (aria-modal + accessible name) — fork PR `#17` pr-opened; SCOPED to avoid the rejected focus-trap approach (see Mined gaps)
- `2026-09-09` duplicate guard: a later streetmix cycle opened `fix/dialog-aria-modal` (aria-modal only) as fork PR `#18`, verified + CI green, then closed as superseded by `#17` — PR `#17` already covers the same issue plus the accessible name. Rule: issue `#3751` is covered by fork PR `#17`; do not re-pick it.

- `2026-09-24` `#3771` hardcoded cookie-session secret fallback (security) — fork PR `#26` `fix/require-cookie-session-secret` pr-opened; fail-closed in production, dev-only fallback otherwise, doc updated; CI: pull_request-event run fully green (Lint + Unit/integration Node 22/24/26 + E2E) + Conventional commits pass; only fork-secret env-artifact reds (Argos ARGOS_TOKEN, duplicate push-event `cypress --record` without CYPRESS_RECORD_KEY)
- `2026-09-25 a11y` street-name rename is mouse-only (`StreetName` div/span has `onClick` but no `role`/`tabindex`/keyboard handler) — fork PR `#27` `fix/street-name-keyboard-rename` pr-opened, base fork `main`, single commit; local vitest 11-pass + full client suite 554 pass, eslint + tsc clean; fork CI substantive gates green (Lint, Conventional commits, Unit+integration Node 22/24/26); Argos take-screenshots + Cypress E2E red = fork-secret env artifacts (ARGOS_TOKEN / CYPRESS_RECORD_KEY)

## Mined gaps

- `2026-09-25 a11y` Editable `client/src/streets/StreetName.tsx` renders the rename target as `role`-less `<div>`/`<span>` with `onClick` but no `tabindex` or keyboard activation, so keyboard-only users cannot rename a street (WCAG 2.1.1 / 4.1.2). Repro: focus moves over the street-nameplate; Enter/Space does nothing. Expected: when `editable`, present as `role="button"`, `tabIndex={0}`, and activate the existing `onClick` on Enter/Space; keep the read-only rendering (gallery, welcome panel) unchanged; add regression tests asserting role/focusability and Enter/Space activation. Dedupe: no upstream issue/PR for street-name keyboard/focusable/rename; distinct from prior fork PRs `#10` (img alt), `#17` (dialog), `#26` (cookie secret). — status: pr-opened — fork PR `https://github.com/olitreadwell/streetmix/pull/27` head `fix/street-name-keyboard-rename` @ `a40caa47b` (base fork `main`)

- `2026-09-09 a11y` Shared `client/src/dialogs/Dialog.tsx` renders `role="dialog"` with no `aria-modal` and no accessible name (WCAG 4.1.2; `#3751`). Repro: `<div className="dialog-box" role="dialog">` lacks `aria-modal` and `aria-labelledby`; assistive tech does not announce the dialog as modal nor identify it. Expected: `aria-modal="true"`; dialog named by its first heading via `aria-labelledby` (useId), generic so no consumer edits needed; regression test asserting both. Dedupe: `#3751` open; PR `#3629` (focus-trap/aria-modal) closed-unmerged — approach rejected, so this pick adds only aria-modal + accessible name and DEFERS focus management to the maintainer's preferred native `<dialog>`/Radix path (documented in the PR body). — status: pr-opened — fork PR `https://github.com/olitreadwell/streetmix/pull/17` head `fix/dialog-aria-attributes-and-name` @ `06727d3c` (base fork `main`); local 556 vitest tests pass, scoped eslint + tsc clean; fork CI lint + full CI matrix (incl. E2E) green on 2nd run (first run E2E was a transient flake), Argos red = fork lacks ARGOS_TOKEN (env artifact, documented in PR body)
