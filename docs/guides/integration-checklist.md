# 接入验收清单

本文档给外部系统和平台团队共同使用。目标是把“我觉得能用了”变成“我确认它符合接入标准”。

## 1. 基础信息

接入前先补齐：

- 应用名称
- 业务域
- `routeBase`
- `entry`
- owner team
- 发布环境地址

## 2. 开发态检查

### 独立运行

- [ ] 应用独立打开时能正常渲染
- [ ] 应用独立打开时子路由可访问
- [ ] 应用独立打开时不会依赖 shell 才能启动

### 生命周期

- [ ] 导出 `bootstrap`
- [ ] 导出 `mount`
- [ ] 导出 `unmount`
- [ ] `mount` 重复进入不会报错
- [ ] `unmount` 后不会残留定时器、全局事件或 websocket

### 构建与资源

- [ ] 已处理 `public-path`
- [ ] dev server 已开启 CORS
- [ ] 打包产物支持 HTML entry 加载
- [ ] 应用 library 名称唯一

## 3. 路由检查

- [ ] router `base` 来自 shell 注入的 `routeBase`
- [ ] 内部路由没有写死完整业务前缀
- [ ] shell 中访问 `/routeBase`
- [ ] shell 中访问 `/routeBase/child-path`
- [ ] 浏览器刷新深链不 404
- [ ] 微应用可以跳回 shell 页面

## 4. props 接入检查

- [ ] 能读取 `currentUser`
- [ ] 能使用 `auth.logout`
- [ ] 能使用 `navigation.push`
- [ ] 能使用 `telemetry.log`
- [ ] 主题切换时能响应 `sharedState`

## 5. 样式检查

- [ ] 不修改全局 `body/html/#root`
- [ ] 不污染 shell 导航与布局
- [ ] 弹层 z-index 不覆盖 shell 全局层级
- [ ] 字体、颜色、间距至少不明显偏离平台规范

## 6. 登录与会话检查

- [ ] 从 shell 进入微应用时保持登录状态
- [ ] 微应用退出登录后能回到 shell 登录页
- [ ] 会话失效后有统一处理
- [ ] 没有私自维护第二套登录缓存

## 7. 错误与降级检查

- [ ] 微应用抛错时不会拖垮 shell
- [ ] 入口资源异常时 shell 有降级展示
- [ ] 关键错误能上报日志

## 8. 生产发布检查

- [ ] `index.html` 不缓存
- [ ] 静态资源带 hash
- [ ] `entry` 地址可访问
- [ ] CDN / 域名 / CORS 配置正确
- [ ] 版本号可追踪
- [ ] 存在回滚方案

## 9. 测试检查

- [ ] 至少有 1 条 mount/unmount 自动化测试
- [ ] 至少有 1 条路由 base 测试
- [ ] 至少有 1 条登录链路测试
- [ ] 至少有 1 条 shell -> 微应用 -> shell 跳转测试

## 10. 提测前最终确认

以下全部打勾，才能进入联调或上线审批：

- [ ] 本地独立运行通过
- [ ] 本地被 shell 挂载通过
- [ ] 预发环境被 shell 挂载通过
- [ ] 接入文档已更新
- [ ] owner team 已确认接管维护

