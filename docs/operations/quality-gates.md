# 质量门禁与生产运维要求

## 1. 目标

本文件定义“什么叫生产可用”。如果一项能力不能通过这些门禁，它就还只是 demo。

## 2. CI 质量门禁

每次变更至少执行：

### 静态检查

- TypeScript 类型检查
- ESLint
- 格式检查
- 依赖许可证与安全扫描

### 单元测试

必须覆盖：

- shell 注册与清单解析
- route guard
- auth facade
- global state 轻量同步逻辑
- manifest 版本与开关策略

### 契约测试

必须验证：

- shell 注入 props 是否符合 contract
- 微应用生命周期导出是否完整
- route base 是否与 activeRule 一致
- 微应用独立运行模式是否可用

### E2E 测试

至少覆盖以下主路径：

- 登录后进入 shell
- 从 shell 进入微应用 A
- 从微应用 A 跳到微应用 B
- 刷新深链页面不 404
- 会话过期后重新鉴权
- 微应用加载失败后正确降级

## 3. 测试图谱

```text
+-------------------+------------------------+-----------------------------+
| Layer             | What to test           | Why it matters              |
+-------------------+------------------------+-----------------------------+
| Unit              | contracts, guards      | 快速定位边界错误            |
| Contract          | shell <-> micro app    | 防止团队间接口漂移          |
| Integration       | auth, routing, config  | 验证平台能力能串起来        |
| E2E               | login, mount, fallback | 覆盖真实用户路径            |
| Synthetic Monitor | shell and app entries  | 生产环境持续可用性监测      |
+-------------------+------------------------+-----------------------------+
```

## 4. 性能门禁

建议指标：

- shell 首屏可交互时间
- 首个微应用首次挂载耗时
- 路由切换耗时
- 预加载资源体积
- 单个微应用 JS 体积预算

建议策略：

- 只对高频应用做积极预加载
- 大应用采用路由命中时加载
- 监控脚本在首个微应用 mount 后启动

## 5. 缓存与发布门禁

每个微应用发布时必须确认：

- `index.html` 设置 `Cache-Control: no-cache`
- JS/CSS/图片等静态资源带 hash
- `entry` 可跨域访问且 CORS 设置正确
- 部署清单可回滚

推荐发布流：

```text
build -> upload assets -> publish app manifest -> smoke test -> gradual rollout
```

## 6. 回滚策略

回滚必须分两层：

### 层 1：配置回滚

通过更新 app manifest 或配置中心，把 shell 指向上一版 `entry`。

优点：

- 快
- 不需要所有应用重新部署

### 层 2：应用回滚

业务系统自身回滚到上一版构建产物。

要求：

- 每个版本可追踪
- 每个版本都能被重新指向

## 7. 可观测性

### 日志

统一日志字段：

- `appName`
- `appVersion`
- `shellVersion`
- `traceId`
- `route`
- `env`
- `tenantId`

### 指标

至少采集：

- 微应用加载成功率
- 微应用 mount 耗时
- 跨应用跳转成功率
- 登录续期成功率
- JS 异常率

### 错误

错误要能区分：

- shell 自身错误
- 子应用加载错误
- 子应用运行时错误
- 认证错误
- 资源 404 / CORS / publicPath 错误

## 8. 安全要求

必须治理：

- CORS 白名单
- cookie `SameSite` / `Secure` / 域策略
- 登录重定向来源校验
- CSP
- 依赖扫描

明确禁止：

- 在 `initGlobalState` 中传递敏感凭证
- 在前端代码里散落多个登录实现

## 9. Nginx / CDN 关键要求

### Shell

- `index.html` 不缓存
- 路由深链全部回退到 shell 入口

### Micro App

- `index.html` 不缓存
- 资源允许通过绝对路径访问
- 字体、图片等非 JS 资源要么走 CDN，要么构建期写完整路径

## 10. 故障演练

上线前至少演练：

- 子应用 entry 404
- 子应用 JS 加载超时
- 鉴权过期
- 某个微应用发布坏包后配置回滚
- 主应用导航正常，但一个子应用完全不可用

## 11. Open Source 标准

本仓库作为开源项目，应做到：

- 文档先行
- 关键架构有 ADR
- 接入契约可复制
- 本地联调路径清晰
- 示例应用可验证
- 生产限制讲清楚，不美化 demo 能力

## 12. 上线门槛

满足以下条件才允许宣称“生产可用”：

- 至少一个真实业务微应用接入
- 登录链路统一
- 深链刷新正常
- 资源路径与缓存策略正确
- 有错误降级页
- 有配置回滚能力
- 有端到端回归用例
