# Vue 3 Webpack Micro App Template

这是一个可复制的 qiankun 微应用模板，面向外部 Vue 团队。

## 模板定位

适用场景：

- 你的团队主要使用 Vue 3
- 希望按平台标准快速接入 qiankun
- 不想理解 shell 内部 React 代码

## 包含内容

- `public-path` 处理
- `bootstrap / mount / unmount` 生命周期
- 路由 base 接入
- shell props 消费示例
- 本地独立运行能力
- `vue.config.js` 微前端构建配置

## 两种使用方式

### 方式 1：直接复制模板目录

把本目录复制到你的新仓库，然后替换以下占位符：

- `__APP_NAME__`
- `__APP_DISPLAY_NAME__`
- `__APP_ROUTE_BASE__`
- `__APP_PORT__`
- `__APP_LIBRARY__`

### 方式 2：使用初始化脚本

在平台仓执行：

```bash
./scripts/create-vue3-micro-app.sh reports-app /reports /tmp/reports-app 7201 reportsApp "报表系统"
```

参数说明：

1. 应用名
2. 路由前缀
3. 输出目录
4. 本地端口
5. webpack library 名
6. 页面展示名

## 生成后的下一步

1. 安装依赖：`pnpm install`
2. 本地启动：`pnpm dev`
3. 替换示例页面为你的真实业务页面
4. 按平台要求完成接入验收

继续阅读：

- [Vue 微应用接入手册](../../docs/guides/vue-micro-app-onboarding.md)
- [接入验收清单](../../docs/guides/integration-checklist.md)
- [常见问题与排障](../../docs/guides/troubleshooting.md)

