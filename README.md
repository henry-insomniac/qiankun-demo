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
pnpm build:pages
```

## Ports

- shell: `http://localhost:7100`
- orders micro app: `http://localhost:7101`
- rooms micro app: `http://localhost:7102`

## GitHub Pages

- Workflow: `.github/workflows/pages.yml`
- Trigger: push to `main` or manual `workflow_dispatch`
- Build output: `dist-pages/`
- Default public URL pattern: `https://<user>.github.io/qiankun-demo/`

本仓库的 Pages 部署使用 hash 路由，shell 页面推荐通过 `#/rooms`、`#/orders` 这类地址访问。
如果用户直接访问 `/qiankun-demo/rooms` 这类 pathname 深链，`404.html` 会把它回跳到对应的 hash 路由。
Shell 发布在仓库根路径下，微应用 entry 发布在：

- `/qiankun-demo/apps/orders/`
- `/qiankun-demo/apps/rooms/`

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
