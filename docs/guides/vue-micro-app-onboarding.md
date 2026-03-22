# Vue 微应用接入手册

本文档的目标是：让一个主要使用 Vue 的外部系统，在不理解 shell React 实现细节的前提下，完成接入。

默认读者：

- Vue 2 / Vue 3 业务开发
- 能维护自己应用的构建配置
- 不想额外维护平台仓内部代码

## 1. 推荐支持矩阵

当前平台推荐顺序如下：

### 推荐 1：Vue 3 + Vue Router 4 + webpack

原因：

- 与当前 shell 的 webpack 体系配合最稳
- qiankun 常见接入问题更少
- 资源路径和生命周期控制更直观

### 推荐 2：Vue 2 + Vue Router 3 + webpack

适合存量系统接入。

### 可支持但不作为默认基线：Vue 3 + Vite

工程判断：

- 可以接入
- 但资源路径、开发态和插件适配成本通常更高
- 如果外部系统已经稳定运行在 Vite 上，可以单独评估，不建议让所有团队默认走这条路

这里的“推荐”是平台工程建议，不代表 Vue 3 + Vite 不可用。

## 2. 接入前必须确认的 4 件事

1. 平台已经为你的系统分配 `name`
2. 平台已经为你的系统分配 `routeBase`
3. 平台已经确认你的 `entry` 地址
4. 你的应用能先独立运行

示例：

```text
name: reports-app
routeBase: /reports
entry: https://xxx.example.com/
```

## 3. 接入后的应用应具备两种运行模式

### 模式 A：独立运行

用于：

- 本地开发
- 业务联调
- 预发验证

### 模式 B：被 shell 挂载

用于：

- 平台统一入口访问
- 跨应用跳转
- 统一登录态与统一主题

## 4. Vue 3 最小接入模板

下面是一套尽量简单的 Vue 3 接入模板，优先使用 JavaScript，避免把外部团队强行带入 TypeScript 成本。

如果你不想手动拼文件，直接使用仓库内模板：

- 模板目录：[templates/vue3-webpack-micro-app](/Users/Zhuanz/work-space/qiankun-demo/templates/vue3-webpack-micro-app)
- 初始化脚本：[create-vue3-micro-app.sh](/Users/Zhuanz/work-space/qiankun-demo/scripts/create-vue3-micro-app.sh)

示例：

```bash
./scripts/create-vue3-micro-app.sh reports-app /reports /tmp/reports-app 7201 reportsApp "报表系统"
```

### 4.1 `src/public-path.js`

```js
if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

作用：

- 保证被 qiankun 加载时，静态资源路径正确

### 4.2 `src/router/index.js`

```js
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import DetailPage from "../views/DetailPage.vue";

export function createAppRouter(base = "/") {
  return createRouter({
    history: createWebHistory(base),
    routes: [
      { path: "/", component: HomePage },
      { path: "/detail/:id", component: DetailPage },
    ],
  });
}
```

关键点：

- `base` 不能写死
- 必须能接收 shell 传入的 `routeBase`

### 4.3 `src/main.js`

```js
import "./public-path";
import { createApp } from "vue";
import App from "./App.vue";
import { createAppRouter } from "./router";

let app = null;
let router = null;
let root = null;

function render(props = {}) {
  const {
    container,
    routeBase = "/",
    currentUser = null,
    auth,
    navigation,
    telemetry,
    sharedState,
    theme,
  } = props;

  root = container
    ? container.querySelector("#app")
    : document.querySelector("#app");

  router = createAppRouter(routeBase);
  app = createApp(App, {
    shellProps: {
      currentUser,
      auth,
      navigation,
      telemetry,
      sharedState,
      theme,
      routeBase,
    },
  });

  app.use(router);
  app.mount(root);
}

export async function bootstrap() {}

export async function mount(props) {
  render(props);
}

export async function unmount() {
  app.unmount();
  app = null;
  router = null;
  root = null;
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
```

### 4.4 `App.vue`

```vue
<template>
  <main class="reports-app">
    <header class="reports-app__header">
      <h1>报表系统</h1>
      <p>当前用户：{{ shellProps.currentUser?.name || "匿名" }}</p>
    </header>

    <section class="reports-app__actions">
      <button @click="gotoProfile">跳到平台个人中心</button>
      <button @click="logout">退出登录</button>
    </section>

    <router-view />
  </main>
</template>

<script setup>
const props = defineProps({
  shellProps: {
    type: Object,
    default: () => ({}),
  },
});

function gotoProfile() {
  props.shellProps.navigation?.push?.("/profile");
}

async function logout() {
  await props.shellProps.auth?.logout?.();
  props.shellProps.navigation?.push?.("/login");
}
</script>
```

## 5. Vue 2 最小接入模板

如果你是 Vue 2 存量项目，核心思路不变，只是写法不同。

### `src/main.js`

```js
import "./public-path";
import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import routes from "./router";

Vue.use(VueRouter);

let instance = null;
let router = null;

function render(props = {}) {
  const { container, routeBase = "/" } = props;

  router = new VueRouter({
    mode: "history",
    base: routeBase,
    routes,
  });

  instance = new Vue({
    router,
    render: (h) => h(App, { props: { shellProps: props } }),
  }).$mount(container ? container.querySelector("#app") : "#app");
}

export async function bootstrap() {}
export async function mount(props) { render(props); }
export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = "";
  instance = null;
  router = null;
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
```

## 6. 构建配置要求

### Vue CLI / webpack 项目

至少满足这些要求：

1. 打包产物支持被外部 HTML entry 加载
2. `publicPath` 在开发和生产环境都可控
3. dev server 开启 CORS
4. history fallback 正常

一个常见的 `vue.config.js` 示例：

```js
const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === "development" ? "/" : "/",
  devServer: {
    port: 7201,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    historyApiFallback: true,
  },
  configureWebpack: {
    output: {
      library: "reportsApp",
      libraryTarget: "umd",
      chunkLoadingGlobal: "webpackJsonp_reportsApp",
    },
  },
});
```

关键点：

- `library` 名称要唯一
- `libraryTarget` 要允许 qiankun 调用生命周期
- dev server 必须允许 shell 拉取资源

## 7. 外部团队如何使用 shell props

### `navigation`

用途：

- 跳回 shell 页面
- 跳转其他微应用

示例：

```js
props.navigation.push("/profile");
props.navigation.push("/orders");
```

### `auth`

用途：

- 获取当前会话
- 刷新会话
- 退出登录

示例：

```js
const user = await props.auth.getCurrentUser();
const token = await props.auth.getAccessToken();
await props.auth.logout();
```

注意：

- 不要把 access token 长时间缓存到全局变量
- 不要自己再实现一套刷新逻辑

### `telemetry`

示例：

```js
props.telemetry.log("reports.export.click", {
  reportId: "2026-03",
});
```

### `sharedState`

推荐只做这些事情：

- 监听主题切换
- 监听租户切换
- 监听语言切换

不推荐：

- 传大列表
- 传高频业务数据
- 传 token

## 8. 路由处理规则

这是 Vue 团队最容易踩坑的地方。

### 正确做法

- shell 分配 `routeBase`
- Vue router 使用 `routeBase`
- 你的应用内部只处理 `routeBase` 后面的部分

例如：

```text
shell 路由: /reports
你的内部路由:
  /
  /detail/:id

最终用户地址:
  /reports
  /reports/detail/123
```

### 错误做法

- 在应用里写死 `/reports`
- 应用内部直接写死完整域名
- 跨应用跳转用自己 router 的 `push('/profile')`

## 9. 样式处理规则

外部 Vue 团队请遵循下面这些规则：

1. 不覆盖 `body`, `html`, `#root` 的全局样式
2. 业务样式尽量加应用名前缀
3. 弹层、抽屉、popover 要检查 z-index
4. 主题颜色优先消费平台 token，不要各自定义一套

推荐：

- scoped style
- CSS Modules
- BEM 命名

## 10. 本地联调建议

最稳妥的本地联调流程：

1. 先独立启动 Vue 应用
2. 再启动 shell
3. 在 shell 中访问你的 `routeBase`
4. 验证 mount / unmount / refresh / login / theme

联调时至少验证：

- 进入你的应用是否正常渲染
- 刷新子路由是否正常
- 从你的应用跳回 shell 是否正常
- 退出登录是否能回到 shell 登录页

## 11. 接入完成的定义

一个 Vue 微应用只有满足以下条件，才算接入完成：

- 能独立运行
- 能被 shell 挂载
- 生命周期完整
- 路由 base 正确
- 资源路径正确
- 样式不污染 shell
- 能通过接入验收清单

## 12. 下一步

接入代码写完后，不要急着提测，先继续执行：

1. [接入验收清单](./integration-checklist.md)
2. [常见问题与排障](./troubleshooting.md)
