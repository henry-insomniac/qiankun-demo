# qiankun-demo

Production-oriented `qiankun` workspace with a runnable shell, one retained
qiankun sample micro app, and detailed onboarding docs for external teams.

## Packages

- `apps/shell`: host app
- `apps/rooms-app`: retained qiankun sample micro app
- `packages/contracts`: shell <-> micro app contracts
- `packages/auth-sdk`: auth facade
- `packages/design-tokens`: shared design tokens
- `packages/shared-utils`: logging and trace helpers

## Current Integrations

- `勘察博士问答系统`: `/survey-doctor-qa`
- `跨文档关联标注工具`: `/cross-document-annotation`
- `PDF解析工具`: `/pdf-parser`
- `知识图谱`: `/knowledge-graph`
- `样板间`: `/rooms`

其中：

- `rooms` 继续使用 qiankun 生命周期接入
- 4 个现有系统当前通过兼容代理接入 shell，还没有改造成 qiankun 生命周期应用

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
- rooms micro app: `http://localhost:7102`
- survey doctor qa proxy: `http://localhost:7203`
- pdf parser proxy: `http://localhost:7204`
- cross-document annotation proxy: `http://localhost:7205`
- knowledge graph proxy: `http://localhost:7206`

## GitHub Pages

- Workflow: `.github/workflows/pages.yml`
- Trigger: push to `develop` or manual `workflow_dispatch`
- Build output: `dist-pages/`
- Default public URL pattern: `https://<user>.github.io/qiankun-demo/`

本仓库的 Pages 部署保留 pathname 路由，并通过 `404.html + sessionStorage` 做单页应用回跳。
Shell 发布在仓库根路径下，保留的 qiankun 样板微应用 entry 发布在：

- `/qiankun-demo/apps/rooms/`

注意：

- GitHub Pages 仅适合静态发布 shell 和样板微应用
- 4 个现有系统依赖反向代理剥离 `X-Frame-Options/CSP` 后再嵌入，不适合直接走 Pages 静态托管

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
