<template>
  <main
    class="micro-app"
    :data-theme="themeMode"
  >
    <header class="micro-app__header">
      <div>
        <span class="micro-badge">Mounted by qiankun</span>
        <h1>{{ shellProps.appDisplayName }}</h1>
        <p>routeBase: {{ shellProps.routeBase }}</p>
      </div>
      <div class="micro-actions">
        <button
          class="micro-button micro-button--ghost"
          @click="goLogin"
        >
          回到登录页
        </button>
        <button
          class="micro-button"
          @click="logout"
        >
          退出登录
        </button>
      </div>
    </header>

    <router-view />
  </main>
</template>

<script setup>
import { provide, ref } from "vue";

const props = defineProps({
  shellProps: {
    type: Object,
    default: () => ({}),
  },
});

const shellProps = {
  appDisplayName: "__APP_DISPLAY_NAME__",
  routeBase: "/",
  currentUser: null,
  auth: null,
  navigation: null,
  telemetry: null,
  sharedState: null,
  theme: {
    mode: "light",
  },
  ...props.shellProps,
};

const themeMode = ref(shellProps.theme?.mode || "light");

shellProps.sharedState?.onGlobalStateChange?.((state) => {
  themeMode.value = state.themeMode;
}, true);

provide("shellProps", shellProps);

function goLogin() {
  shellProps.navigation?.push?.("/login");
}

async function logout() {
  await shellProps.auth?.logout?.();
  shellProps.navigation?.push?.("/login");
}
</script>

<style>
:root {
  --micro-background: #fffdf9;
  --micro-background-strong: #fff7ea;
  --micro-border: #dbcab6;
  --micro-text: #201910;
  --micro-text-muted: #665a4a;
  --micro-accent: #c65d1f;
  --micro-radius-lg: 24px;
  --micro-radius-md: 14px;
}

.micro-app {
  min-height: 100vh;
  padding: 24px;
  color: var(--micro-text);
  background:
    linear-gradient(140deg, rgba(198, 93, 31, 0.14), transparent 36%),
    var(--micro-background);
}

.micro-app[data-theme="dark"] {
  --micro-background: #27211a;
  --micro-background-strong: #33281d;
  --micro-border: #5c4a36;
  --micro-text: #f8eee3;
  --micro-text-muted: #d0bfaa;
  --micro-accent: #ff975c;
}

.micro-app__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 20px;
}

.micro-page-card {
  padding: 24px;
  border-radius: var(--micro-radius-lg);
  border: 1px solid var(--micro-border);
  background: var(--micro-background-strong);
}

.micro-page-card--compact {
  display: grid;
  gap: 12px;
}

.micro-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.micro-button,
.micro-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  border: none;
  text-decoration: none;
  cursor: pointer;
  background: var(--micro-accent);
  color: #fff;
}

.micro-button--ghost {
  background: transparent;
  color: var(--micro-text);
  border: 1px solid var(--micro-border);
}

.micro-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(198, 93, 31, 0.12);
  color: var(--micro-accent);
  font-size: 12px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .micro-app__header {
    flex-direction: column;
  }
}
</style>
