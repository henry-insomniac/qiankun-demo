# qiankun-demo

Production-oriented `qiankun` workspace with a runnable shell, sample micro app,
and detailed onboarding docs for external teams.

## Packages

- `apps/shell`: host app
- `apps/orders-app`: sample micro app
- `packages/contracts`: shell <-> micro app contracts
- `packages/auth-sdk`: auth facade
- `packages/design-tokens`: shared design tokens
- `packages/shared-utils`: logging and trace helpers

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Ports

- shell: `http://localhost:7100`
- orders micro app: `http://localhost:7101`

## External Onboarding Assets

- Vue 3 template: [templates/vue3-webpack-micro-app](./templates/vue3-webpack-micro-app)
- Bootstrap script: [scripts/create-vue3-micro-app.sh](./scripts/create-vue3-micro-app.sh)

## Read First

- [AGENTS.md](./AGENTS.md)
- [docs/reference/qiankun-official-notes.md](./docs/reference/qiankun-official-notes.md)
- [docs/architecture/production-blueprint.md](./docs/architecture/production-blueprint.md)
- [docs/guides/platform-usage.md](./docs/guides/platform-usage.md)
- [docs/guides/vue-micro-app-onboarding.md](./docs/guides/vue-micro-app-onboarding.md)
- [docs/guides/integration-checklist.md](./docs/guides/integration-checklist.md)
- [docs/guides/troubleshooting.md](./docs/guides/troubleshooting.md)
