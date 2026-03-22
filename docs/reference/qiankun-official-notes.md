# qiankun 官方文档阅读笔记

更新时间：2026-03-22

本文档只记录与“生产可用微前端平台”直接相关的官方结论，并给出工程化解释。

## 已阅读资料

- 官方快速开始：<https://qiankun.umijs.org/zh/guide/getting-started>
- 官方 API：<https://qiankun.umijs.org/zh/api>
- 官方 FAQ：<https://qiankun.umijs.org/zh/faq>
- 官方 Releases：<https://github.com/umijs/qiankun/releases>

## 官方事实摘录与工程含义

### 1. 主应用通过 `registerMicroApps` + `start()` 启动路由型微应用

官方快速开始给出的主流程很明确：

- 主应用注册微应用
- 为每个微应用配置 `name`、`entry`、`container`、`activeRule`
- 调用 `start()` 启动 qiankun

工程含义：

- 我们应优先采用“路由驱动”模式来承接多个完整业务系统。
- 主应用必须成为唯一入口，统一导航、鉴权门面、布局骨架与监控初始化。

### 2. `start()` 默认支持预加载，且可自定义首屏/次屏策略

官方 API 明确说明：

- `prefetch` 默认值为 `true`
- 可配置为 `all`
- 可配置为指定应用列表
- 可配置为函数，以区分关键应用和次要应用

工程含义：

- 生产环境不能简单粗暴地“全部预加载”。
- 推荐按业务优先级做分层预加载：
  - 首屏关键微应用：首屏后立即预取
  - 低频微应用：用户空闲时再预取
  - 超大型微应用：仅在命中路由或显式 hover/nav 预热时加载

### 3. 沙箱默认开启，但样式隔离不是银弹

官方 API 明确说明：

- `sandbox` 默认开启
- 默认沙箱能保证“单实例场景下子应用之间”的样式隔离
- 不能天然保证“主应用与子应用之间”或“多实例场景下”的样式隔离
- `strictStyleIsolation: true` 基于 Shadow DOM，但官方明确提醒这不是无脑可用方案
- `experimentalStyleIsolation: true` 仍是实验特性
- `@keyframes`、`@font-face`、`@import`、`@page` 等规则不会被改写

工程含义：

- 设计一致性不能靠 qiankun 自动兜底，必须靠设计令牌、样式前缀和约束治理。
- 不推荐把 Shadow DOM 作为默认方案，否则 React、弹层、主题、三方组件会出现大量适配成本。
- 我们的默认策略应是：
  - 主应用全局样式加前缀
  - 微应用使用 CSS Modules / BEM / 局部样式方案
  - 共享主题通过 design tokens 实现
  - 仅对隔离问题严重的个别应用评估 Shadow DOM

### 4. `singular` 在不同场景下默认值不同

官方 API 显示：

- `start()` 的路由型微应用场景中，`singular` 默认是 `true`
- `loadMicroApp()` 的手动挂载场景中，`singular` 默认是 `false`

工程含义：

- 路由型完整业务系统默认应保持单实例加载。
- 同屏挂多个“依赖路由”的完整微应用并不安全，也不推荐。
- 嵌入式组件场景才考虑 `loadMicroApp()` 与多实例。

### 5. 官方 FAQ 明确提示：多个依赖路由的微应用不应同时展示

FAQ 说明：

- 可以通过相同的 `activeRule` 和 `singular: false` 同时激活多个微应用
- 但如果多个微应用都依赖浏览器路由，浏览器只有一个 URL，必然导致其中一个 404

工程含义：

- 我们不应把完整系统拆成多个同屏路由应用后并列渲染。
- 同屏组合时应优先选择：
  - 主应用布局 + 单个路由型微应用
  - 或主应用 + 若干“无独立路由依赖”的 widget 型子应用

### 6. 官方 FAQ 明确不建议共享运行时依赖

FAQ 引用微前端原则时明确写到：

- 不要共享运行时，即便所有团队都用同一个框架

工程含义：

- 不要把“统一 React/ Vue 运行时”作为第一目标。
- 微前端的首要目标是独立部署、独立演进、边界清晰，而不是极限去重。
- 共享应该聚焦在契约和规范层：
  - 类型契约
  - 设计令牌
  - 日志与埋点规范
  - 鉴权 SDK

### 7. 资源 404 是生产部署中的高频问题，`publicPath` 必须治理

官方 FAQ 说明：

- 微应用资源 404 常见原因是 `publicPath` 不正确
- qiankun 会在微应用启动前注入运行时 publicPath
- 图片、字体等静态资源还需要 CDN、base64 或显式完整路径方案兜底

工程含义：

- 微应用必须在入口顶部设置运行时 publicPath
- 所有静态资源要么上 CDN，要么确保构建期写入绝对路径
- 这是生产可用的硬门槛，不是后期优化项

### 8. 刷新 404 不是 qiankun 问题，本质是服务端 History 回退问题

官方 FAQ 说明：

- 微应用路径刷新后 404，通常是 browser history 模式缺少服务端配合

工程含义：

- 每个环境必须配置 route fallback 规则
- Shell 和所有子应用都要定义各自的 rewrite / fallback 策略
- 如果某个存量系统做不到，先降级为 hash 模式，不要在生产强行 browser history

### 9. 微应用之间跳转不能依赖各自内部路由组件

官方 FAQ 说明：

- 微应用跳主应用或跳其他微应用，不能直接依赖各自 router 的 `Link` / `router-link`
- 推荐使用 `history.pushState()`、原生 `a` 标签或修改 `location.href`

工程含义：

- 需要提供统一的导航门面，例如 `shellNavigate('/orders/list')`
- 子应用不应直接感知其他子应用的内部路由实例

### 10. Cookie/登录态跨域加载必须显式处理 `fetch`

官方 FAQ 说明：

- 拉取微应用 entry 时，如果依赖 cookie 登录态，跨域请求默认不会自动带上 cookie
- 需要通过自定义 `fetch` 配置 `mode: 'cors'` 与 `credentials: 'include'`

工程含义：

- “账号一致性”不是只上 qiankun 就完成了
- 真正的关键是：
  - 域名策略
  - SSO / OIDC
  - session/cookie 策略
  - API gateway / BFF
- qiankun 只解决页面组合，不解决身份系统本身

### 11. 微应用应支持独立运行

官方 FAQ 提供了 `window.__POWERED_BY_QIANKUN__` 的判断方式，用于区分当前是否运行在主应用上下文。

工程含义：

- 每个微应用都必须支持：
  - 独立本地开发
  - 独立预发验证
  - 被主应用挂载
- 这直接影响调试效率、回归速度与故障隔离

### 12. 监控适合放在 `runAfterFirstMounted` 之后启动

官方 API 提供了 `runAfterFirstMounted()`，示例里直接用于“第一个微应用 mount 后开启监控”。

工程含义：

- Shell 可以在首个业务应用完成渲染后，再初始化较重的监控脚本
- 这样能减少首屏竞争

### 13. `initGlobalState` 文档仍可用，但当前仓库实现不把它作为默认方案

官方 API 仍提供 `initGlobalState`，适合轻量跨应用状态广播。

工程判断：

- 当前仓库骨架没有把它作为默认实现
- 原因不是它在 v2 不可用，而是当前运行时已对后续版本移除给出警告
- 因此我们在代码里选择了“shell props + custom shared state bridge”的更稳妥路径
- 如果未来接入历史系统需要兼容现有 qiankun global state，也应限制在轻量场景，不要承载登录态和高频业务状态

## 版本判断

基于官方 Releases 页面在 2026-03-22 可见的信息：

- `v2.10.16` 被标记为 `Latest`，页面显示发布日期为 `11 月 15 日`
- `v3.0.0-rc.0` 被标记为 `Pre-release`，页面显示发布日期为 `9 月 18 日`

工程判断：

- 当前生产方案优先选 `qiankun v2` 稳定线
- `v3` 仍处于预发布状态，不作为当前仓库基线

## 结论

qiankun 适合作为“统一入口 + 独立部署 + 多技术栈兼容”的微前端底座，但要把它做成生产级平台，必须补齐这些非功能能力：

- 统一身份认证
- 设计系统与样式治理
- 路由与导航契约
- 构建与发布规范
- 缓存与回滚策略
- 可观测性
- 测试与质量门禁

因此，本仓库后续设计不应停留在“能跑 demo”，而要把 qiankun 放进一套完整的平台工程里。
