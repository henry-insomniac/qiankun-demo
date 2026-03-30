# Vue 3 + Vite 微应用接入例外说明

本文档定义当前仓库在 `Vue 3 + Vite` 技术栈下接入 qiankun 的约束。

结论先行：

- `Vue 3 + Vite` 在当前平台中属于可支持的例外方案
- 只有在业务团队明确要求使用 Vite，或已有稳定 Vite 工程时才采用
- 接入后仍必须满足标准微应用 contract，不因为构建工具不同而放宽边界

## 1. 为什么这是例外方案

当前平台默认推荐：

- `Vue 3 + Vue Router 4 + webpack`

原因：

- 与现有 shell 的 webpack 体系配合最稳
- `publicPath`、生命周期和资源加载行为更直观
- qiankun 官方 FAQ 对 webpack 场景的资料更完整

本次之所以接受 Vite，是因为目标业务微应用明确要求：

- 使用 `Vue 3`
- 使用 `Vite`
- 保持独立运行体验

## 2. 例外方案的工程约束

### 2.1 双运行模式仍然是硬要求

每个 Vite 微应用必须同时支持：

- 独立运行
- 被 shell 挂载运行

### 2.2 路由 base 必须来自 shell

微应用内部 router 不能写死完整业务前缀。

正确做法：

- shell 分配 `routeBase`
- 微应用使用 `createWebHistory(routeBase)`

### 2.3 挂载容器必须显式使用 `container`

挂载逻辑必须优先使用 shell 注入的 `container`：

```ts
const root =
  props?.container?.querySelector("#app") ?? document.querySelector("#app");
```

### 2.4 不把 Vite 当成“天然等价于 webpack”

Vite 输出的是 ESM 运行模型。

在 qiankun 场景下，这意味着：

- 不能照搬 webpack 的 `__webpack_public_path__` 方案
- 需要额外适配生命周期导出
- 开发态联调要单独验证

## 3. 当前仓库采用的 Vite 适配策略

当前仓库为 Vite 微应用采用专门的 qiankun 适配入口，而不是复用 webpack 模板。

实现原则：

- 使用 `vite-plugin-qiankun`
- 在入口文件中显式导出 `bootstrap / mount / unmount`
- 独立运行时直接 `render()`
- 被 shell 挂载时由 qiankun 生命周期驱动

## 4. 风险与限制

### 4.1 沙箱语义弱于默认 webpack 方案

由于 ESM 加载方式与 qiankun 默认沙箱模型存在差异，Vite 方案必须尽量避免向 `window` 散落状态。

要求：

- 优先使用局部模块状态
- 如需访问运行态 window，统一走 qiankun 提供的 helper
- 严禁在微应用里注册不受控的全局单例

### 4.2 开发态联调必须单独验收

至少验证：

- 独立运行
- 被 shell 挂载
- 深链刷新
- 再次 mount / unmount
- 主题切换
- 退出登录

### 4.3 资源路径必须以构建产物为准

Vite 下图片、字体和其他静态资源必须在：

- 独立运行
- 被 qiankun 加载

两个场景都分别验证。

## 5. 适用范围

当前例外方案只为以下业务应用开放：

- `survey-reporting-app`

如果后续其他业务团队也要采用 `Vue 3 + Vite`，必须先复用这套方案完成一次接入评估，不允许各自发散实现。
