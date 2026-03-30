<template>
  <a-config-provider :theme="themeConfig">
    <div
      id="survey-reporting-app"
      class="sr-app"
      :class="{ 'sr-app--dark': isDark }"
      :style="appCssVars"
    >
      <div class="sr-app__backdrop" />
      <div class="sr-app__content">
        <section class="sr-app__hero">
          <div class="sr-app__hero-copy">
            <span class="sr-app__eyebrow">Survey Reporting Workspace</span>
            <h1>{{ title }}</h1>
            <p>{{ summary }}</p>
          </div>
          <div class="sr-app__hero-metrics">
            <a-card size="small" class="sr-app__metric-card">
              <span>活跃项目</span>
              <strong>{{ projectRows.length }}</strong>
            </a-card>
            <a-card size="small" class="sr-app__metric-card">
              <span>当前用户</span>
              <strong>{{ currentUserName }}</strong>
            </a-card>
            <a-card size="small" class="sr-app__metric-card">
              <span>路由基座</span>
              <strong>{{ routeBase }}</strong>
            </a-card>
          </div>
        </section>

        <router-view />
      </div>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { theme as antdTheme } from "ant-design-vue";

import { projectRows } from "@/mock/data";
import { useShellProps } from "@/lib/shell";

const route = useRoute();
const shellProps = useShellProps();

const title = computed(
  () => (route.meta.title as string | undefined) ?? "AI 勘察报告智能生成系统",
);

const summary = computed(
  () =>
    (route.meta.summary as string | undefined) ??
    "把项目、数据、模板、AI 编排、合规校验和审核归档收敛到同一条生产线。",
);

const currentUserName = computed(
  () => shellProps.currentUser?.name ?? "Standalone User",
);

const routeBase = computed(() => shellProps.routeBase ?? "/");
const currentThemeId = ref("tech");
const darkThemeIds = new Set(["dark", "dark-one"]);
const isDark = computed(() => darkThemeIds.has(currentThemeId.value));

interface ResolvedShellTheme {
  colorPrimary: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
  colorBgBase: string;
  colorBgContainer: string;
  colorBgElevated: string;
  colorText: string;
  colorTextSecondary: string;
  colorBorder: string;
}

const fallbackTheme: ResolvedShellTheme = {
  colorPrimary: "#2563eb",
  colorSuccess: "#059669",
  colorWarning: "#d97706",
  colorError: "#dc2626",
  colorBgBase: "#f0f7ff",
  colorBgContainer: "#ffffff",
  colorBgElevated: "#f0f9ff",
  colorText: "#1e3a5f",
  colorTextSecondary: "#3b82f6",
  colorBorder: "#bfdbfe",
};

const resolvedTheme = ref<ResolvedShellTheme>(fallbackTheme);

function pickCssVar(
  styles: CSSStyleDeclaration,
  name: string,
  fallback: string,
): string {
  return styles.getPropertyValue(name).trim() || fallback;
}

function resolveThemeHost(): Element {
  return document.querySelector(".shell") ?? document.documentElement;
}

function refreshTheme() {
  if (typeof window === "undefined") {
    resolvedTheme.value = fallbackTheme;
    return;
  }

  currentThemeId.value =
    document.documentElement.getAttribute("data-theme")?.trim() || "tech";

  const styles = window.getComputedStyle(resolveThemeHost());
  if (darkThemeIds.has(currentThemeId.value)) {
    resolvedTheme.value = {
      colorPrimary:
        currentThemeId.value === "dark-one" ? "#7ec8ff" : "#8ea7ff",
      colorSuccess: "#34d399",
      colorWarning: "#fbbf24",
      colorError: "#fb7185",
      colorBgBase:
        currentThemeId.value === "dark-one" ? "#1b1e23" : "#09090b",
      colorBgContainer:
        currentThemeId.value === "dark-one" ? "#232833" : "#15171c",
      colorBgElevated:
        currentThemeId.value === "dark-one" ? "#2b3140" : "#1c2027",
      colorText: "#f5f7fb",
      colorTextSecondary: "#c6d0de",
      colorBorder:
        currentThemeId.value === "dark-one"
          ? "rgba(126, 200, 255, 0.22)"
          : "rgba(142, 167, 255, 0.22)",
    };
    return;
  }

  resolvedTheme.value = {
    colorPrimary: pickCssVar(styles, "--color-accent", fallbackTheme.colorPrimary),
    colorSuccess: fallbackTheme.colorSuccess,
    colorWarning: fallbackTheme.colorWarning,
    colorError: fallbackTheme.colorError,
    colorBgBase: pickCssVar(styles, "--bg-color", fallbackTheme.colorBgBase),
    colorBgContainer: pickCssVar(
      styles,
      "--color-surface",
      fallbackTheme.colorBgContainer,
    ),
    colorBgElevated: pickCssVar(
      styles,
      "--color-surface-strong",
      fallbackTheme.colorBgElevated,
    ),
    colorText: pickCssVar(styles, "--color-text", fallbackTheme.colorText),
    colorTextSecondary: pickCssVar(
      styles,
      "--color-text-muted",
      fallbackTheme.colorTextSecondary,
    ),
    colorBorder: pickCssVar(styles, "--color-border", fallbackTheme.colorBorder),
  };
}

function toRgbChannels(value: string): string {
  const normalized = value.trim();

  if (normalized.startsWith("#")) {
    const hex = normalized.slice(1);
    const fullHex =
      hex.length === 3
        ? hex
            .split("")
            .map((char) => `${char}${char}`)
            .join("")
        : hex;

    if (fullHex.length === 6) {
      const bigint = Number.parseInt(fullHex, 16);
      const red = (bigint >> 16) & 255;
      const green = (bigint >> 8) & 255;
      const blue = bigint & 255;
      return `${red} ${green} ${blue}`;
    }
  }

  const rgbMatch = normalized.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (rgbMatch) {
    return `${rgbMatch[1]} ${rgbMatch[2]} ${rgbMatch[3]}`;
  }

  return "37 99 235";
}

let themeObserver: MutationObserver | null = null;

onMounted(() => {
  refreshTheme();
  themeObserver = new MutationObserver(() => {
    refreshTheme();
  });

  const shellElement = document.querySelector(".shell");
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-theme", "style"],
  });

  if (shellElement) {
    themeObserver.observe(shellElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
  }
});

onBeforeUnmount(() => {
  themeObserver?.disconnect();
  themeObserver = null;
});

const appCssVars = computed(() => ({
  "--sr-bg": resolvedTheme.value.colorBgBase,
  "--sr-surface": resolvedTheme.value.colorBgContainer,
  "--sr-surface-strong": resolvedTheme.value.colorBgElevated,
  "--sr-border": resolvedTheme.value.colorBorder,
  "--sr-text": resolvedTheme.value.colorText,
  "--sr-text-muted": resolvedTheme.value.colorTextSecondary,
  "--sr-primary": resolvedTheme.value.colorPrimary,
  "--sr-primary-contrast": isDark.value ? "#0f1726" : "#f8fbff",
  "--sr-primary-rgb": toRgbChannels(resolvedTheme.value.colorPrimary),
  "--sr-bg-rgb": toRgbChannels(resolvedTheme.value.colorBgBase),
  "--sr-bg-accent-rgb": toRgbChannels(resolvedTheme.value.colorBgElevated),
}));

const themeConfig = computed(() => ({
  algorithm: isDark.value
    ? antdTheme.darkAlgorithm
    : antdTheme.defaultAlgorithm,
  token: {
    colorPrimary: resolvedTheme.value.colorPrimary,
    colorInfo: resolvedTheme.value.colorPrimary,
    colorSuccess: resolvedTheme.value.colorSuccess,
    colorWarning: resolvedTheme.value.colorWarning,
    colorError: resolvedTheme.value.colorError,
    colorBgBase: resolvedTheme.value.colorBgBase,
    colorBgContainer: resolvedTheme.value.colorBgContainer,
    colorBgElevated: resolvedTheme.value.colorBgElevated,
    colorText: resolvedTheme.value.colorText,
    colorTextSecondary: resolvedTheme.value.colorTextSecondary,
    colorTextLightSolid: isDark.value ? "#0f1726" : "#f8fbff",
    colorBorder: resolvedTheme.value.colorBorder,
    borderRadius: 18,
    fontFamily: '"IBM Plex Sans", "Noto Sans SC", sans-serif',
  },
}));
</script>
