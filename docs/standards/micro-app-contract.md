# 微应用接入契约

本文档定义 shell 与微应用之间的稳定边界。没有契约，就只有“能跑起来”的集成，没有可持续维护的平台。

## 1. 应用注册契约

每个微应用都必须在接入清单中声明以下元数据：

```ts
export interface MicroAppManifest {
  name: string;
  domain: 'orders' | 'finance' | 'admin' | string;
  entry: string;
  activeRule: string;
  mountContainer: string;
  routeBase: string;
  ownerTeam: string;
  version: string;
  standaloneUrl: string;
  healthcheckUrl?: string;
  featureFlags?: string[];
}
```

约束：

- `name` 全局唯一
- `activeRule` 与 `routeBase` 一致
- `entry` 必须可独立访问
- `version` 必须可追踪到具体构建产物

## 2. 生命周期契约

每个微应用必须导出：

```ts
export async function bootstrap(): Promise<void> {}
export async function mount(props: ShellAppProps): Promise<void> {}
export async function unmount(props: ShellAppProps): Promise<void> {}
export async function update?(props: Partial<ShellAppProps>): Promise<void> {}
```

约束：

- `mount` 可重复进入
- `unmount` 必须完整清理副作用
- `update` 可选，但如果支持，则必须是幂等的

必须清理的副作用：

- 定时器
- 全局事件监听
- 自建缓存订阅
- WebSocket / SSE
- 挂载在 `window` 上的临时对象

## 3. 独立运行契约

每个微应用必须支持：

- 独立本地开发
- 独立部署预览
- 被 shell 挂载

最低实现方式：

```ts
if (!(window as any).__POWERED_BY_QIANKUN__) {
  renderStandalone();
}
```

## 4. Shell 注入 props 契约

Shell 传入微应用的标准 props 建议如下：

```ts
export interface ShellAppProps {
  appName: string;
  routeBase: string;
  container?: HTMLElement;
  currentUser: {
    id: string;
    name: string;
    tenantId?: string;
    locale?: string;
  };
  auth: {
    isAuthenticated(): boolean;
    getAccessToken(): Promise<string | null>;
    refresh(): Promise<void>;
    logout(options?: { redirectTo?: string }): Promise<void>;
  };
  navigation: {
    push(path: string): void;
    replace(path: string): void;
  };
  telemetry: {
    log(event: string, payload?: Record<string, unknown>): void;
    error(error: Error, context?: Record<string, unknown>): void;
    traceId(): string;
  };
  theme: {
    mode: 'light' | 'dark' | 'system';
    tokensVersion: string;
  };
  sharedState?: {
    onGlobalStateChange?: Function;
    setGlobalState?: Function;
    offGlobalStateChange?: Function;
  };
}
```

约束：

- 不通过 `props` 传递长生命周期敏感 token
- 用户对象只传展示与鉴权所需最小字段
- 所有函数型能力都来自 shell 门面，不直接暴露主应用内部实现

## 5. 路由契约

原则：

- Shell 负责全局路由
- 微应用负责自己的 base route 以下的路由
- 跨应用跳转统一通过 shell 导航门面

示例：

```text
/workspace
/orders/*
/finance/*
/admin/*
```

禁止：

- 微应用 A 直接依赖微应用 B 的 router 实例
- 微应用内部硬编码其他系统部署域名

## 6. 鉴权契约

必须满足：

- 未登录时，shell 统一处理跳转登录
- 会话过期时，shell 能统一触发刷新或退出
- 微应用不自行管理独立登录页，除非得到平台层显式许可

禁止：

- 通过 qiankun 全局状态广播 access token
- 每个微应用维护不同的登录态协议

推荐：

- 同主域走 session cookie + BFF
- 跨域走 OIDC Code + PKCE

## 7. 设计系统契约

设计一致性由以下顺序保证：

1. 设计令牌统一
2. Shell 布局统一
3. 公共组件有限共享
4. 微应用本地样式约束

最小要求：

- 使用统一的 token 源
- 遵守统一字号、间距、圆角、颜色和层级表
- 微应用样式不能污染 shell

建议：

- CSS Modules
- 命名空间前缀
- CSS variables

不建议默认使用：

- `strictStyleIsolation`

原因：

- Shadow DOM 适配成本高
- 对弹层、Portal、三方组件和主题系统有额外复杂度

## 8. 通信契约

通信优先级从高到低如下：

1. 路由跳转
2. shell props
3. shell 注入的 shared state bridge
4. 自定义事件总线

规则：

- 高频、复杂数据不能走 shared state bridge
- 跨应用通信必须可审计、可追踪
- 事件名必须收敛到常量表，不允许随意字符串散落

说明：

- 当前仓库默认不用 qiankun `initGlobalState`
- 原因是当前实现要规避后续版本的弃用风险
- 对外契约保留 `sharedState` 能力，但底层实现由 shell 控制

推荐事件示例：

```ts
export const CrossAppEvents = {
  TENANT_CHANGED: 'platform.tenant.changed',
  THEME_CHANGED: 'platform.theme.changed',
  SESSION_EXPIRED: 'platform.session.expired',
} as const;
```

## 9. 构建契约

每个微应用必须：

- 在入口最顶部处理运行时 `publicPath`
- 输出带 hash 的静态资源
- 保持 `index.html` 不缓存
- 暴露可用于回滚的版本信息

构建检查项：

- 入口文件是否注入 `__INJECTED_PUBLIC_PATH_BY_QIANKUN__`
- 静态资源是否支持 CDN
- Source map 是否按环境控制

## 10. 观测契约

每个微应用必须输出以下公共字段：

- `appName`
- `appVersion`
- `env`
- `route`
- `traceId`
- `userId` 或匿名标识

错误上报必须带：

- shell 版本
- 微应用版本
- mount 状态
- 是否运行在 qiankun 上下文中

## 11. 降级契约

当微应用加载失败时，shell 必须提供：

- 降级占位
- 重试按钮
- 错误码
- 支持联系排障信息

微应用必须支持：

- 加载失败后重新 mount
- 不污染其他应用运行

## 12. 契约测试

每次接入新微应用至少要有：

- manifest 校验测试
- props 兼容性测试
- mount/unmount 清理测试
- route base 测试
- auth 门面集成测试
