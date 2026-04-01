# 平台使用说明

本文档面向两类人：

- 平台维护者：维护 shell、contracts、文档和质量门禁
- 外部接入团队：维护自己的业务系统，并按 contract 接入 shell

## 1. 先说结论

外部 Vue 团队不需要理解 shell 内部的 React 实现，也不需要维护平台仓的大部分代码。

外部团队只需要关心 5 件事：

1. 让自己的应用能独立运行
2. 导出标准的 `bootstrap / mount / unmount`
3. 把自己的路由 base 改成平台分配的前缀
4. 正确消费 shell 传进来的 `props`
5. 通过接入验收清单

也就是说：

- 平台团队维护“容器”
- 业务团队维护“业务应用”
- 双方通过稳定 contract 协作

## 2. 角色边界

### 平台团队负责什么

- shell 主应用
- 应用注册中心
- 导航与布局框架
- 登录态门面
- 主题与设计令牌
- 日志、监控、错误兜底
- 文档、接入模板、质量门禁

### 业务团队负责什么

- 自己的业务页面
- 自己的业务路由
- 自己的业务 API 封装
- 生命周期导出
- 自己应用的独立运行与回归测试

### 业务团队不需要负责什么

- shell 布局
- 全局导航
- 主应用的 React 代码
- 跨应用登录实现

## 3. 平台运行方式

```text
Browser
   |
   v
Shell (React + qiankun)
   |
   +--> 加载应用清单
   +--> 判断当前路由该激活哪个微应用
   +--> 向微应用注入 props
   +--> 提供导航/鉴权/主题/日志能力
   |
   v
Micro App (Vue / React / 其他)
   |
   +--> 使用 routeBase 作为路由前缀
   +--> 消费 props 中的能力
   +--> 只渲染自己的内容区域
```

## 4. 平台对外暴露的最小能力

### 当前仓库的接入现状

截至 2026-03-30，当前仓库采用混合接入：

- `AI 勘察报告智能生成系统` 作为首个真实业务 qiankun 微应用
- `样板间` 继续作为 qiankun 生命周期样板应用
- `勘察博士问答系统`
- `跨文档关联标注工具`
- `PDF解析工具`
- `知识图谱`

其中：

- `AI 勘察报告智能生成系统` 和 `样板间` 走标准 qiankun 路由型接入
- 其余 4 个现有系统目前都还是独立 SPA，还没有补齐 qiankun 生命周期、`public-path` 和跨域治理，因此 shell 侧先通过兼容代理方式接入
- 如果是 GitHub Pages 这类静态预览环境，shell 会把这 4 个系统自动降级为“外部直达”，不再尝试在壳内 iframe 加载本地兼容代理

工程含义：

- shell 中它们已经有统一入口和统一导航
- 只有前两者完成了标准 qiankun 生命周期接入
- 后续如果要切换到标准 `registerMicroApps`，仍需要业务系统自己补齐生命周期和资源路径治理

## 5. 平台对外暴露的最小能力

当前 contract 定义见 [micro-app-contract.md](../standards/micro-app-contract.md)。

外部团队重点只看这几个字段：

### `routeBase`

作用：

- 告诉微应用自己的路由根路径是什么

例如：

- 订单系统拿到 `/orders`
- 财务系统拿到 `/finance`

### `currentUser`

作用：

- 读取当前登录用户基础信息

外部团队只把它当“当前用户快照”使用，不要把它当用户状态中心。

### `auth`

作用：

- 统一获取当前会话能力
- 统一刷新会话
- 统一退出

外部团队不要自己再造一套登录体系。

### `navigation`

作用：

- 跳回 shell 页面
- 跳去其他微应用路由

外部团队不要直接依赖其他应用的 router 实例。

### `telemetry`

作用：

- 统一日志与埋点
- 统一 traceId

### `sharedState`

作用：

- 轻量共享主题、租户、语言等平台级状态

当前仓库默认不是 qiankun `initGlobalState`，而是 shell 自己维护的 bridge。

这对外部团队是透明的，外部团队只要按 contract 使用即可。

## 6. 外部团队的最小心智模型

把 shell 当成“浏览器里的平台容器”。

你的 Vue 应用需要做到：

- 平时单独跑，像正常系统一样开发
- 被 shell 加载时，改为挂到 shell 指定容器里

你不需要思考：

- shell 用 React 还是 Vue
- qiankun 内部如何注册应用
- shell 的布局是怎么渲染的

你只需要思考：

- 我如何 mount 到传入容器
- 我如何在独立运行和被托管之间切换

## 7. 平台推荐的接入顺序

建议所有外部团队按这个顺序推进：

1. 先保证原有 Vue 应用独立运行正常
2. 再补 `public-path`
3. 再补生命周期导出
4. 再处理路由 base
5. 再接入 `props`
6. 最后跑接入验收清单

不要一开始就改样式、改鉴权、改构建、改路由，一次做太多事情很容易失控。

## 8. 为什么 shell 用 React 不会增加 Vue 团队维护成本

因为外部团队日常只维护自己的仓库，不维护 shell。

真正的接入接口只有：

- 生命周期函数
- 路由前缀
- props contract
- 部署 entry 地址

这些都与 React 无关。

所以管理上的正确分工是：

- 平台团队维护 `ts + react`
- 外部团队继续维护自己的 `vue + js/ts`

## 9. 推荐的协作模式

### 模式 A：平台仓 + 业务独立仓

最推荐。

原因：

- 各业务团队可以独立发布
- 不强迫所有团队学习平台仓结构
- 平台团队只维护统一标准和 shell

### 模式 B：平台仓内提供接入模板

也推荐。

原因：

- 外部团队可以复制模板，最快接入

## 10. 日常维护建议

### 平台团队

- 不频繁变更 contract
- contract 一旦变更必须同步文档
- 为外部团队提供 copy-and-paste 级别的示例

### 外部团队

- 不依赖 shell 内部实现细节
- 只依赖对外 contract
- 每次升级平台前先跑接入验收清单

## 11. 下一步阅读顺序

如果你是外部 Vue 团队，按下面顺序阅读：

1. [Vue 微应用接入手册](./vue-micro-app-onboarding.md)
2. [接入验收清单](./integration-checklist.md)
3. [常见问题与排障](./troubleshooting.md)
4. [Vue 3 模板目录](/Users/Zhuanz/work-space/qiankun-demo/templates/vue3-webpack-micro-app)

如果你是平台维护者，继续阅读：

1. [生产级架构蓝图](../architecture/production-blueprint.md)
2. [微应用接入契约](../standards/micro-app-contract.md)
3. [质量门禁](../operations/quality-gates.md)
