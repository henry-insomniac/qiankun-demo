# AGENTS.md

## Purpose
This repository is the control plane and reference implementation for a production-grade `qiankun` micro frontend platform.

Current state on 2026-03-22:
- Runnable shell + sample micro app exist, and `AGENTS.md` remains index-only.

## Read First
Read these files in order before writing code:
1. [`docs/reference/qiankun-official-notes.md`](docs/reference/qiankun-official-notes.md)
2. [`docs/adr/0001-adopt-qiankun-v2.md`](docs/adr/0001-adopt-qiankun-v2.md)
3. [`docs/architecture/production-blueprint.md`](docs/architecture/production-blueprint.md)
4. [`docs/standards/micro-app-contract.md`](docs/standards/micro-app-contract.md)
5. [`docs/guides/platform-usage.md`](docs/guides/platform-usage.md)
6. [`docs/guides/vue-micro-app-onboarding.md`](docs/guides/vue-micro-app-onboarding.md)
7. [`docs/guides/integration-checklist.md`](docs/guides/integration-checklist.md)
8. [`docs/guides/troubleshooting.md`](docs/guides/troubleshooting.md)
9. [`docs/operations/quality-gates.md`](docs/operations/quality-gates.md)
10. [`docs/plan/roadmap.md`](docs/plan/roadmap.md)

## Non-Negotiable Decisions
- Use `qiankun` stable v2 line first, not the `v3.0.0-rc.0` prerelease.
- This repository should host the shell, shared contracts, tooling, and docs.
- Business systems may remain in independent repos and be onboarded gradually.
- Micro frontend solves integration and composition; it does not solve SSO alone.
- Account consistency must come from centralized identity, session, and gateway design.
- Design consistency must come from shared tokens and layout rules, not from ad hoc CSS reuse.
- Route ownership must be explicit: shell owns global routes, micro apps own base routes.
- Default to independent deployment for each micro app.
- Do not share runtime libraries by default across micro apps.
- Prefer shell props + custom shared state bridge over qiankun `initGlobalState`.

## What This Repo Should Eventually Contain
Target layout:

```text
apps/
  shell/                 # main app / host app
  playground/            # local integration playground
packages/
  contracts/             # shared types, app manifest, lifecycle contracts
  auth-sdk/              # auth facade, session helpers, token refresh helpers
  design-tokens/         # tokens, themes, css variables
  shared-utils/          # logging, tracing, navigation helpers
docs/
  reference/
  adr/
  architecture/
  guides/
  standards/
  operations/
  plan/
templates/
  vue3-webpack-micro-app # copyable onboarding template for external teams
scripts/
  create-vue3-micro-app.sh
```

## Delivery Boundary
Optimize for clear architecture, migration safety, explicit contracts, production operations, and open-source readability.
Do not overbuild abstractions before the first real micro app is integrated.

## Implementation Rules
- One micro app maps to one business domain or bounded context.
- Prefer `registerMicroApps` for route-driven apps.
- Use `loadMicroApp` only for embedded widget-like or manual mount scenarios.
- Keep `activeRule` deterministic and human-readable.
- Avoid mounting multiple route-driven apps at the same time.
- Assume each app can run standalone outside qiankun.
- Each app must export standard lifecycle methods.
- Each app must tolerate mount/unmount repeatedly.
- Each app must have a unique name, route base, and deployment entry.

## Auth Rules
- Never treat qiankun global state as the source of truth for auth.
- Never pass long-lived secrets through `props`.
- Prefer same-site session cookies plus BFF; if cross-domain is required, use OIDC Authorization Code + PKCE.
- If entry fetch depends on cookies, configure `fetch(..., { credentials: 'include' })`.

## UI Rules
- Shell owns top nav, side nav, breadcrumbs, layout chrome, and global notices.
- Micro apps own only the content region inside their mount container.
- Shared design comes from tokens, spacing, typography, and component policy, not default Shadow DOM isolation.
- Prefix shell global styles and control z-index allocation centrally.

## Ops Rules
- `index.html` of every micro app must be `Cache-Control: no-cache`.
- Static assets must be content-hashed and CDN-friendly.
- Public path must be correct in dev and prod.
- Every app must emit logs, metrics, and error events with app name and version.
- Shell must support rollback by manifest/config without forcing all apps to redeploy.

## Testing Rules
- Unit tests for lifecycle adapters, route guards, auth facade, and manifest parsing.
- Contract tests for shell-to-app props and event interfaces.
- E2E smoke tests for mount, unmount, navigation, login continuity, and error fallback.
- Performance budgets for first mount, route switch, and prefetch.

## Definition of Done
Changes are not done until:
- docs are updated if architecture or contracts changed
- diagrams still reflect reality
- new behavior has automated coverage
- rollout and rollback are documented
- security and cache implications are explicitly considered

## Change Protocol
Before adding runtime code:
1. Check whether an ADR or contract doc already covers the topic.
2. If not, add or update docs first.
3. Keep the first executable slice small and keep Vue onboarding docs copy-and-paste friendly.

## When In Doubt
- Choose explicit over clever.
- Choose stable over novel.
- Choose fewer moving parts over speculative abstractions.
- Choose contracts and observability over undocumented convenience.
