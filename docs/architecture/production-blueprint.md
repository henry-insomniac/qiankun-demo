# 生产级 qiankun 微前端蓝图

## 1. 问题定义

你的目标不是“把多个前端页面拼到一起”，而是建立一个真正可运维、可演进、可扩展的平台层。

目标拆解如下：

- 访问一致性：统一入口、统一导航、统一路由规则、统一错误页
- 设计一致性：统一布局框架、设计令牌、组件约束、主题能力
- 账号一致性：统一身份认证、统一 session/token 生命周期、统一退出
- 发布一致性：独立部署、可观测、可灰度、可回滚

## 2. 先挑战一个前提

“账号一致性只有微前端能解决” 这个前提不成立。

更准确的说法是：

- 微前端解决的是页面整合和前端编排
- 账号一致性必须由身份系统解决

因此生产方案必须同时包含：

- qiankun
- SSO / OIDC / CAS 之类的身份体系
- API gateway / BFF
- 统一会话续期和退出机制

如果只做 qiankun，不做身份层治理，最终效果只会是“入口统一了，登录仍然割裂”。

## 3. What Already Exists

当前仓库现状：

- 只有 `.git`
- 没有业务代码
- 没有历史包袱

这意味着当前最小可行路径不是立刻造很多脚手架，而是先定义平台边界，再落第一条可运行链路。

## 4. Scope Reduction

最小可行闭环应是：

1. 一个 shell 主应用
2. 一个真实微应用
3. 一条统一登录链路
4. 一套基础设计令牌
5. 一套日志和错误上报链路

不建议第一期就做：

- 所有系统同时迁移
- 复杂低代码编排平台
- 跨应用运行时依赖共享
- 多主题白标系统

## 5. 总体架构建议

### 5.1 运行时架构

```text
                       +----------------------+
                       | Identity Provider    |
                       | OIDC / CAS / SAML    |
                       +----------+-----------+
                                  |
                                  v
+-------------+         +---------+----------+         +------------------+
| Browser     +-------->+ Shell / Host App   +-------->+ API Gateway / BFF|
| / User      | route   | qiankun runtime    | token   | auth facade      |
+------+------+         | nav/layout/guard   | trace   +---------+--------+
       |                +----+---------+-----+                   |
       |                     |         |                         |
       |                     |         |                         |
       v                     v         v                         v
+------+--------+   +--------+--+ +---+---------+     +--------+---------+
| Micro App A   |   | Micro App B| | Micro App C |     | Shared Platform |
| orders        |   | finance    | | admin       |     | tokens/sdk/log  |
+---------------+   +-----------+ +-------------+     +------------------+
```

### 5.2 代码仓库架构

推荐采用“治理仓 + 业务独立仓”的混合模式。

```text
qiankun-demo/                # 当前仓库，建议演进为平台治理仓
  apps/shell                 # 主应用
  apps/playground            # 本地集成环境
  packages/contracts         # 类型契约与 manifest
  packages/auth-sdk          # 登录态门面
  packages/design-tokens     # 设计令牌
  packages/shared-utils      # 导航/日志/埋点/trace

orders-web/                  # 独立业务仓
finance-web/                 # 独立业务仓
admin-web/                   # 独立业务仓
```

原因：

- 平台资产需要集中治理
- 业务系统需要保留独立发布节奏
- 不强迫所有历史系统迁到一个 monorepo

## 6. 关键设计决策

### 6.1 主应用职责

主应用必须拥有：

- 顶部导航、侧边导航、面包屑
- 路由守卫和 404 兜底
- 鉴权门面
- 全局错误边界
- 全局埋点、日志、性能打点
- 微应用注册中心
- 灰度与版本清单读取

主应用不应拥有：

- 具体业务页面逻辑
- 微应用内部状态
- 微应用私有组件树

### 6.2 微应用职责

每个微应用负责：

- 本业务域内部路由
- 业务页面、业务状态、业务接口封装
- 生命周期导出
- 独立运行能力
- 业务级日志与错误上报

每个微应用不应负责：

- 全局导航
- 全局登录页策略
- 跨应用耦合调用

### 6.3 路由策略

建议的路由分层：

- 主应用：`/login`、`/403`、`/404`、`/workspace`、`/profile`
- 微应用：`/orders/**`、`/finance/**`、`/admin/**`

约束：

- 一个业务域一个路由前缀
- 微应用只能拥有自己的 base route
- 跨应用跳转必须调用 shell 导航门面

### 6.4 账号一致性策略

推荐方案顺序：

#### 首选：同主域 + BFF + Session Cookie

适用场景：

- 能控制域名规划
- 系统最终能归并到同一主域下

优点：

- 浏览器自动携带 cookie
- 前端更少接触敏感 token
- 子应用接入简单

#### 次选：OIDC Authorization Code + PKCE

适用场景：

- 子应用与 API 服务分散在不同域名
- 需要更标准化的身份接入

关键要求：

- 统一 refresh 策略
- shell 感知会话失效
- 全局退出联动所有应用

无论哪种方案，都不要把登录态只存进 qiankun 全局状态。

### 6.5 设计一致性策略

正确方案是“统一设计系统”，不是“强依赖共享组件包”。

建议分层：

- Level 1: design tokens
  - color
  - spacing
  - radius
  - font
  - shadow
  - z-index
- Level 2: shell layout primitives
  - page container
  - section title
  - empty state shell
  - loading shell
- Level 3: 共享组件
  - 仅沉淀高复用、跨团队稳定的组件

注意：

- 组件共享不是越多越好
- tokens 一定要先于组件共享

### 6.6 应用间通信策略

分三层：

#### 层 1：路由跳转

最推荐，耦合最低。

#### 层 2：主应用 props / contract

适合注入：

- 当前用户基础信息
- 租户信息
- 权限快照
- 语言和主题
- shell 导航函数
- 日志/埋点门面

#### 层 3：`initGlobalState`

只用于轻量跨应用状态广播，例如：

- 当前租户切换
- 主题切换
- 全局语言切换

不适合承载：

- 大对象
- 高频业务数据
- 登录 token

### 6.7 构建与部署策略

每个微应用独立构建、独立部署、独立版本化。

Shell 维护一份应用清单：

```text
app-name -> entry url -> version -> environment -> flags
```

建议清单由配置中心或静态 manifest 驱动，而不是硬编码在业务代码里。

### 6.8 缓存与回滚策略

必须满足：

- `index.html` 不缓存
- 静态资源 hash 命名后强缓存
- Shell 能回退到上一版应用清单
- 单个微应用故障不拖垮整个入口

## 7. 推荐的第一版目标结构

```text
apps/
  shell/
  playground/
packages/
  contracts/
  auth-sdk/
  design-tokens/
  shared-utils/
```

### `apps/shell`

负责：

- 注册微应用
- 路由守卫
- 布局骨架
- 错误边界
- 监控初始化

### `apps/playground`

负责：

- 本地联调所有微应用
- 模拟生产配置
- 验证回退与降级逻辑

### `packages/contracts`

负责：

- 微应用 manifest 类型
- props 类型
- event 名称枚举
- 路由前缀声明

### `packages/auth-sdk`

负责：

- 获取当前用户
- 会话校验
- token/session 续期
- 全局退出

### `packages/design-tokens`

负责：

- CSS variables
- token JSON
- 主题切换基础能力

## 8. 风险与控制

### 风险 1：接入历史系统时 publicPath 混乱

控制：

- 统一脚手架模板
- CI 检查入口文件是否注入运行时 publicPath

### 风险 2：主应用和子应用样式冲突

控制：

- shell 样式前缀
- token 化
- 微应用局部样式规范

### 风险 3：登录态在跨域下失效

控制：

- 优先统一主域
- 必要时自定义 fetch + credentials
- 身份方案单独验收

### 风险 4：多个团队在“共享组件”上形成发布耦合

控制：

- 共享 tokens 多于共享组件
- 组件库只沉淀稳定公共件

### 风险 5：一个子应用崩溃拖累主应用

控制：

- 每个微应用注册独立错误边界
- shell 提供降级占位页和重试按钮

## 9. NOT in Scope

以下工作刻意不放进第一阶段：

- 同时迁移全部系统
- 多个完整路由应用同屏渲染
- 运行时依赖共享优化
- 复杂的可视化编排后台
- 白标/多品牌主题体系
- 低代码平台

## 10. 结论

这套方案的核心不是“引入 qiankun”，而是围绕 qiankun 建立一层生产平台：

- shell 统一入口
- auth 统一身份
- tokens 统一设计
- contracts 统一边界
- ops 统一质量门禁

只有这五层一起存在，项目才配得上“生产环境可用”。
