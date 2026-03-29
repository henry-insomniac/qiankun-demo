# 主题系统对接指南

本文档定义子应用（微应用）如何接入平台主题系统，实现与 Shell 主题同步的完整指南。

## 1. 主题系统概述

平台主题系统基于以下技术方案：

| 特性 | 技术方案 |
|------|----------|
| 主题状态管理 | `next-themes` |
| 主题切换触发 | 波纹扩散动画 + 平滑过渡 |
| 主题持久化 | `localStorage` |
| DOM 属性 | `data-theme` |

### 1.1 可用主题列表

| Theme ID | 名称 | 主色调 |
|----------|------|--------|
| `tech` | 企业蓝 | `#2563eb` |
| `dark` | 极夜黑 | `#ffffff` |
| `dark-one` | 深邃黑 | `#61afef` |
| `business` | 事务金 | `#c28100` |
| `mint` | 薄荷绿 | `#059669` |
| `sunset` | 晚霞橙 | `#ea580c` |
| `grape` | 葡萄灰紫 | `#7c3aed` |
| `ocean` | 海湾青 | `#0284c7` |
| `forest` | 松林绿 | `#166534` |
| `rose` | 玫瑰粉 | `#db2777` |
| `slate` | 石板灰 | `#475569` |
| `aurora` | 极光青 | `#0d9488` |

**默认主题**: `tech`（企业蓝）

---

## 2. Shell 注入的主题 Props

Shell 在微应用 mount 时通过 props 注入主题信息。

### 2.1 Props 结构定义

```typescript
// Shell 传递给微应用的主题配置
interface ThemeProps {
  /** 当前主题 ID，如 'tech', 'dark', 'business' 等 */
  mode: string;

  /** Design Tokens 版本号，用于缓存失效 */
  tokensVersion: string;

  /** 完整的 theme 对象（可选，提供更多元数据） */
  theme?: {
    /** 主题 ID */
    id: string;

    /** 主题名称 */
    name: string;

    /** 主题主色（HEX） */
    color: string;
  };
}
```

### 2.2 完整 ShellAppProps 类型（供参考）

```typescript
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
    mode: string;
    tokensVersion: string;
    theme?: {
      id: string;
      name: string;
      color: string;
    };
  };
  sharedState?: {
    onGlobalStateChange?: (callback: Function, fireImmediately?: boolean) => void;
    setGlobalState?: (state: Record<string, unknown>) => boolean;
    offGlobalStateChange?: () => boolean;
  };
}
```

---

## 3. 微应用对接方式

### 3.1 React 微应用对接

#### 方案一：使用 CSS Variables（推荐）

子应用接收主题后，设置对应 CSS 变量：

```tsx
// MicroApp.tsx
import { useEffect } from 'react';

interface ThemeProps {
  theme: {
    mode: string;
    tokensVersion: string;
  };
}

export function MicroApp(props: ThemeProps) {
  const { theme } = props;

  // 监听主题变化
  useEffect(() => {
    // 方式一：通过 data-theme 属性让 CSS 自动响应
    document.documentElement.setAttribute('data-theme', theme.mode);

    // 方式二：手动应用主题色到 CSS 变量
    const themeColors: Record<string, { primary: string; background: string }> = {
      tech: { primary: '#2563eb', background: '#f4f1eb' },
      dark: { primary: '#ffffff', background: '#09090b' },
      business: { primary: '#c28100', background: '#fffaf0' },
      mint: { primary: '#059669', background: '#f0fdf4' },
      // ... 其他主题
    };

    const colors = themeColors[theme.mode] || themeColors.tech;
    document.documentElement.style.setProperty('--app-primary', colors.primary);
    document.documentElement.style.setProperty('--app-background', colors.background);
  }, [theme.mode, theme.tokensVersion]);

  return <div className="micro-app">应用内容</div>;
}
```

#### 方案二：使用 next-themes（与 Shell 一致）

```tsx
// MicroApp.tsx
import { ThemeProvider, useTheme } from 'next-themes';
import { useEffect } from 'react';

interface ThemeWrapperProps {
  children: React.ReactNode;
  initialTheme: string;
}

function ThemeWrapper({ children, initialTheme }: ThemeWrapperProps) {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    // 监听 Shell 传递的主题变化
    setTheme(initialTheme);
  }, [initialTheme, setTheme]);

  return <>{children}</>;
}

export function MicroApp(props: ThemeProps) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme={props.theme.mode}
      themes={['tech', 'dark', 'dark-one', 'business', 'mint', 'sunset', 'grape', 'ocean', 'forest', 'rose', 'slate', 'aurora']}
      enableSystem={false}
      disableTransitionOnChange
    >
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();
  return <div>当前主题: {theme}</div>;
}
```

### 3.2 Vue 3 微应用对接

```vue
<!-- MicroApp.vue -->
<template>
  <div class="micro-app" :data-theme="currentTheme">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

interface Props {
  theme?: {
    mode: string;
    tokensVersion: string;
  };
}

const props = defineProps<Props>();

const currentTheme = ref(props.theme?.mode || 'tech');

// 监听主题变化
watch(() => props.theme?.mode, (newTheme) => {
  if (newTheme) {
    currentTheme.value = newTheme;
    document.documentElement.setAttribute('data-theme', newTheme);
  }
}, { immediate: true });

onMounted(() => {
  // 初始化主题
  if (props.theme?.mode) {
    document.documentElement.setAttribute('data-theme', props.theme.mode);
  }
});
</script>

<style>
/* 使用 CSS Variables */
.micro-app {
  --app-primary: #2563eb;
  --app-background: #f4f1eb;
  background-color: var(--app-background);
  transition: background-color 0.4s ease;
}

/* 主题覆盖 */
[data-theme="tech"] .micro-app {
  --app-primary: #2563eb;
  --app-background: #f4f1eb;
}

[data-theme="dark"] .micro-app {
  --app-primary: #ffffff;
  --app-background: #09090b;
}

[data-theme="business"] .micro-app {
  --app-primary: #c28100;
  --app-background: #fffaf0;
}

/* 其他主题... */
</style>
```

---

## 4. 主题变化监听与响应

### 4.1 通过 sharedState 监听主题变化（推荐）

Shell 提供 `sharedState` 用于跨应用状态同步，包含主题变化：

```typescript
interface SharedStateBridge {
  onGlobalStateChange?: (
    callback: (state: PlatformGlobalState) => void,
    fireImmediately?: boolean
  ) => void;
  setGlobalState?: (state: Partial<PlatformGlobalState>) => boolean;
  offGlobalStateChange?: () => boolean;
}

interface PlatformGlobalState {
  tenantId: string;
  locale: string;
  themeMode: string;  // 当前主题 ID
}
```

**微应用中使用示例**：

```typescript
// 在 mount 时订阅主题变化
export async function mount(props: ShellAppProps) {
  const { sharedState, theme } = props;

  // 初始化本地主题
  document.documentElement.setAttribute('data-theme', theme.mode);

  // 订阅全局状态变化
  sharedState?.onGlobalStateChange?.((state) => {
    if (state.themeMode) {
      document.documentElement.setAttribute('data-theme', state.themeMode);
      // 触发应用内主题更新逻辑
      handleThemeChange(state.themeMode);
    }
  }, true);
}

function handleThemeChange(themeId: string) {
  console.log('主题已切换:', themeId);
  // 子应用自定义的主题切换逻辑
}
```

### 4.2 主题变化事件常量

推荐使用事件常量避免硬编码：

```typescript
// 跨应用事件常量
export const PlatformEvents = {
  THEME_CHANGED: 'platform.theme.changed',
  TENANT_CHANGED: 'platform.tenant.changed',
  SESSION_EXPIRED: 'platform.session.expired',
} as const;

// 订阅示例
sharedState?.onGlobalStateChange?.((state) => {
  // 可以监听特定属性变化
  console.log('状态变化:', state);
}, true);
```

---

## 5. 主题 CSS Variables 参考

Shell 定义了以下 CSS Variables，子应用可直接使用：

### 5.1 核心颜色变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `--background` | 页面背景色 | `#f4f1eb` |
| `--color-surface` | 卡片/面板背景 | `#fffdf9` |
| `--color-surface-strong` | 深色表面 | `#fff7ea` |
| `--color-text` | 主文字颜色 | `#201910` |
| `--color-text-muted` | 次要文字 | `#665a4a` |
| `--color-border` | 边框颜色 | `#dbcab6` |
| `--color-accent` | 主题强调色 | `#c65d1f` |
| `--color-accent-strong` | 深强调色 | `#9f4310` |

### 5.2 主题特定的 RGB 变量

| 变量名 | 说明 | tech 示例 |
|--------|------|--------|
| `--primary` | 主题主色 | `#2563eb` |
| `--primary-rgb` | RGB 格式 | `37, 99, 235` |
| `--surface-rgb` | 表面 RGB | `255, 253, 249` |
| `--background-rgb` | 背景 RGB | `244, 241, 235` |

### 5.3 子应用自定义变量模式

建议子应用定义自己的变量，引用 Shell 变量：

```css
/* 子应用自己的变量，引用平台变量 */
:root {
  --my-primary: var(--color-accent);
  --my-background: var(--background);
  --my-text: var(--color-text);
}

/* 子应用样式使用自己的变量 */
.my-component {
  background-color: var(--my-background);
  color: var(--my-text);
  border: 1px solid var(--color-border);
  transition: all 0.4s ease;
}
```

---

## 6. 主题切换动画配合

子应用可以配合 Shell 的主题切换动画：

### 6.1 CSS 过渡动画

确保子应用样式有平滑过渡：

```css
/* 全局过渡 */
body,
.micro-app,
.micro-app * {
  transition: background-color 0.4s ease,
              color 0.4s ease,
              border-color 0.4s ease,
              box-shadow 0.4s ease;
}

/* 禁用特定动画（如不需要主题过渡） */
.no-theme-transition {
  transition: none !important;
}
```

### 6.2 波纹效果配合（可选）

如果子应用也想有波纹效果：

```typescript
// 主题切换时触发波纹
function triggerThemeRipple(themeColor: string) {
  const ripple = document.createElement('div');
  ripple.className = 'theme-ripple';
  ripple.style.cssText = `
    position: fixed;
    left: 50%;
    top: 50%;
    width: 100vmax;
    height: 100vmax;
    border-radius: 50%;
    background: ${themeColor};
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.3;
    pointer-events: none;
    z-index: 9999;
    animation: ripple-expand 0.4s ease-out forwards;
  `;
  document.body.appendChild(ripple);

  setTimeout(() => ripple.remove(), 400);
}

@keyframes ripple-expand {
  0% { transform: translate(-50%, -50%) scale(0); opacity: 0.35; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
}
```

---

## 7. 独立运行适配

微应用必须支持独立运行和被 Shell 挂载两种模式：

### 7.1 入口判断

```typescript
// main.ts / main.js
import { createApp } from 'vue';
import App from './App.vue';

// 判断是否在 qiankun 环境中
const isQiankun = !!(window as any).__POWERED_BY_QIANKUN__;

if (isQiankun) {
  // qiankun 环境：导出生命周期
  export async function bootstrap() {
    console.log('[MicroApp] bootstrap');
  }

  export async function mount(props: ShellAppProps) {
    console.log('[MicroApp] mount with props:', props);
    const app = createApp(App);
    app.provide('shellProps', props);
    app.mount(props.container);
  }

  export async function unmount() {
    console.log('[MicroApp] unmount');
    // 清理逻辑
  }
} else {
  // 独立运行模式
  const app = createApp(App);
  app.mount('#app');
}
```

### 7.2 独立运行时的默认主题

```typescript
// 独立运行时使用默认主题或 localStorage 存储的主题
const getStandaloneTheme = () => {
  const stored = localStorage.getItem('app-theme');
  return stored || 'tech';
};
```

---

## 8. 完整对接清单

| 步骤 | 内容 | 状态 |
|------|------|------|
| 1 | 在 `mount` 中接收并应用 `props.theme.mode` | ⬜ |
| 2 | 在 `document.documentElement` 设置 `data-theme` 属性 | ⬜ |
| 3 | 订阅 `sharedState.onGlobalStateChange` 监听主题变化 | ⬜ |
| 4 | 在 `unmount` 中清理主题相关的副作用 | ⬜ |
| 5 | 添加 CSS 变量支持（引用平台变量或自定义） | ⬜ |
| 6 | 确保有 0.4s 的颜色过渡动画 | ⬜ |
| 7 | 支持独立运行和被挂载两种模式 | ⬜ |
| 8 | 测试所有 12 个主题的显示效果 | ⬜ |

---

## 9. 常见问题

### Q1: 子应用主题没有变化？
- 检查 `data-theme` 属性是否正确设置在 `document.documentElement` 上
- 检查 CSS 选择器是否正确（如 `[data-theme="tech"]`）

### Q2: 主题切换有闪烁？
- 确保 CSS 有 `transition` 属性
- 确保在 DOM 更新前设置 `data-theme` 属性

### Q3: 深色主题下文字看不清？
- 检查文字颜色变量是否使用了 `var(--color-text)` 而不是硬编码颜色
- 确保背景色和文字色有足够的对比度

### Q4: 子应用样式污染 Shell？
- 使用 CSS Modules 或 BEM 命名
- 避免使用全局选择器（`body`, `html` 等）
- 使用 scoped styles

---

## 10. 参考资源

- [qiankun 官方文档](https://qiankun.umijs.org/)
- [next-themes 文档](https://next-themes.vercel.app/)
- [CSS Variables MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
