<template>
  <section class="micro-page-card">
    <span class="micro-badge">Micro App Home</span>
    <h2>{{ shellProps.appDisplayName }}</h2>
    <p>当前用户：{{ shellProps.currentUser?.name || "匿名" }}</p>
    <p>当前租户：{{ shellProps.currentUser?.tenantId || "未绑定" }}</p>
    <p>当前主题：{{ themeMode }}</p>

    <div class="micro-actions">
      <RouterLink
        class="micro-link"
        to="/detail/template-order"
      >
        查看详情页
      </RouterLink>
      <button
        class="micro-button"
        @click="emitTelemetry"
      >
        发送埋点
      </button>
      <button
        class="micro-button micro-button--ghost"
        @click="gotoShellProfile"
      >
        跳到平台个人中心
      </button>
    </div>
  </section>
</template>

<script setup>
import { inject, ref } from "vue";

const shellProps = inject("shellProps", {});
const themeMode = ref(shellProps.theme?.mode || "light");

shellProps.sharedState?.onGlobalStateChange?.((state) => {
  themeMode.value = state.themeMode;
}, true);

function emitTelemetry() {
  shellProps.telemetry?.log?.("__APP_NAME__.home.view", {
    routeBase: shellProps.routeBase,
  });
}

function gotoShellProfile() {
  shellProps.navigation?.push?.("/profile");
}
</script>
