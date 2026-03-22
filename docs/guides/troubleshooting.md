# 常见问题与排障

本文档优先面向外部 Vue 团队。遇到问题时先看症状，再看排查步骤，不要一上来改很多配置。

## 1. 进入 shell 后白屏

### 常见原因

- `mount` 没有执行成功
- mount 容器选择器不对
- 生命周期没有正确导出
- 运行时报错但没有看到控制台

### 排查步骤

1. 打开浏览器控制台
2. 检查 shell 是否打印 `beforeLoad / afterMount`
3. 检查微应用是否有运行时错误
4. 检查 `container.querySelector('#app')` 或 `#root` 是否存在

## 2. 静态资源 404

### 常见原因

- 没有处理 `public-path`
- 打包后资源仍指向独立运行地址
- CDN 路径不对

### 优先检查

- 是否存在 `public-path.js`
- 是否在入口最顶部引入了 `public-path.js`
- Network 面板里失败资源的真实 URL 是什么

## 3. 刷新子路由 404

### 常见原因

- nginx / 网关没有做 history fallback
- router base 配置不对

### 解决思路

- 先确认应用内部 router `base` 是否等于 shell 注入的 `routeBase`
- 再确认服务端是否把深链回退到应用入口

## 4. 从微应用跳到 shell 页面失败

### 错误做法

```js
router.push("/profile");
```

这会把 `/profile` 当成你自己应用内部路由。

### 正确做法

```js
props.navigation.push("/profile");
```

## 5. 登录态不一致

### 常见原因

- 微应用自己存了一套 token
- 跨域请求没有带 cookie
- 退出登录只清了本地缓存，没有通知 shell

### 正确原则

- 登录由平台统一
- 微应用只消费 `auth` 能力
- 不自己维护第二套登录中心

## 6. 样式污染 shell

### 常见原因

- 写了全局 `body`
- 写了全局 `button`
- 三方组件库默认样式覆盖全局

### 解决思路

- 先把业务样式限制在应用根节点下
- 审查是否改了全局标签样式
- 审查弹层是否挂到了 `body`

## 7. 卸载后再次进入报错

### 常见原因

- `unmount` 没有清干净
- 定时器未清理
- window 事件未移除
- websocket 未关闭

### 最低检查项

- `setInterval / setTimeout`
- `window.addEventListener`
- `document.addEventListener`
- websocket / SSE

## 8. 主题切换不生效

### 常见原因

- 没有监听 `sharedState`
- 应用内部颜色完全写死

### 正确做法

- 在 mount 后订阅 `sharedState`
- 收到主题变化时更新自己的主题状态

## 9. 为什么我明明是 Vue 应用，却要理解 React shell

答案是不需要。

你只要理解：

- shell 会传什么 `props`
- 你的应用怎么导出生命周期
- 你的 router base 怎么设置

这三件事与 React 无关。

## 10. 什么时候该找平台团队

遇到下面这些情况，直接找平台团队，不要自己硬改：

- 平台分配的 `routeBase` 变更
- `entry` 域名策略变更
- 统一登录方案变更
- shell props contract 变更
- 跨应用导航需求新增

## 11. 最后一个原则

排障顺序永远是：

1. 先看控制台错误
2. 再看 Network 资源
3. 再看 router base
4. 最后才改构建配置

不要一开始就同时改：

- 路由
- publicPath
- 构建
- 生命周期

一次只动一个问题，才容易定位。
