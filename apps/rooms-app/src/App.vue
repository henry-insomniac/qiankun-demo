<template>
  <div
    id="rooms-app"
    :class="{
      'rooms-theme-dark': isDark,
      'rooms-standalone': !isHosted,
      'rooms-style-1': styleMode === '风格1',
      'rooms-style-2': styleMode === '风格2',
      'rooms-style-3': styleMode === '风格3',
    }"
  >
    <a-config-provider :theme="antdTheme">
      <a-layout class="rooms-layout">
        <a-layout-header class="rooms-header">
          <div class="rooms-header__left">Rooms</div>
          <div class="rooms-header__right">
            <a-button @click="toggleTheme">
              {{ isDark ? "白天" : "黑夜" }}
            </a-button>

            <div class="rooms-header__divider" />

            <a-select
              v-model:value="styleMode"
              class="rooms-style-select"
              :options="styleOptions"
            />
          </div>
        </a-layout-header>

        <a-layout-content class="rooms-content">
          <component :is="Option1DocsComp" />
        </a-layout-content>
      </a-layout>
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { theme as antdThemeApi } from "ant-design-vue";
import * as Option1DocsModule from "./pages/Option1Docs.vue";

const Option1DocsComp =
  (Option1DocsModule as any).default ?? (Option1DocsModule as any);

const isHosted = Boolean((window as any).__POWERED_BY_QIANKUN__);

const isDark = ref(false);
type StyleMode = "风格1" | "风格2" | "风格3";

const styleMode = ref<StyleMode>("风格1");
const isThemeTransitioning = ref(false);

const themePrimary = computed(() => {
  const style = styleMode.value;
  if (style === "风格2") return isDark.value ? "#22d3ee" : "#0891b2";
  if (style === "风格3") return isDark.value ? "#34d399" : "#16a34a";
  return isDark.value ? "#4c9aff" : "#1677ff";
});

const themePrimarySoft = computed(() => {
  const style = styleMode.value;
  if (style === "风格2") return isDark.value ? "rgba(34, 211, 238, 0.18)" : "rgba(8, 145, 178, 0.14)";
  if (style === "风格3") return isDark.value ? "rgba(52, 211, 153, 0.18)" : "rgba(22, 163, 74, 0.14)";
  return isDark.value ? "rgba(76, 154, 255, 0.16)" : "rgba(22, 119, 255, 0.12)";
});

const themeSuccess = computed(() => (isDark.value ? "#34d399" : "#16a34a"));
const themeWarning = computed(() => (isDark.value ? "#fbbf24" : "#f59e0b"));
const themeError = computed(() => (isDark.value ? "#fb7185" : "#ef4444"));

const themeBg = computed(() => {
  const style = styleMode.value;
  if (style === "风格2") return isDark.value ? "#0b1220" : "#f3f8ff";
  if (style === "风格3") return isDark.value ? "#08130d" : "#f6fbf7";
  return isDark.value ? "#0f1115" : "#f6f7fb";
});

const themeSurface = computed(() => {
  const style = styleMode.value;
  if (style === "风格2") return isDark.value ? "#0f1a2e" : "#ffffff";
  if (style === "风格3") return isDark.value ? "#0c1f15" : "#ffffff";
  return isDark.value ? "#12151d" : "#ffffff";
});

const themeSurface2 = computed(() => {
  const style = styleMode.value;
  if (style === "风格2") return isDark.value ? "#0b1220" : "#f8fbff";
  if (style === "风格3") return isDark.value ? "#08130d" : "#fbfdfb";
  return isDark.value ? "#0f1115" : "#fbfbfd";
});

const themeBorder = computed(() => {
  const style = styleMode.value;
  if (style === "风格2") return isDark.value ? "rgba(148, 163, 184, 0.22)" : "rgba(15, 23, 42, 0.12)";
  if (style === "风格3") return isDark.value ? "rgba(134, 239, 172, 0.22)" : "rgba(20, 83, 45, 0.14)";
  return isDark.value ? "rgba(255, 255, 255, 0.18)" : "rgba(0, 0, 0, 0.12)";
});

const themeText = computed(() => (isDark.value ? "rgba(255, 255, 255, 0.88)" : "rgba(0, 0, 0, 0.88)"));
const themeTextSecondary = computed(() =>
  isDark.value ? "rgba(255, 255, 255, 0.68)" : "rgba(0, 0, 0, 0.56)",
);

function getBgFor(style: StyleMode, dark: boolean): string {
  if (style === "风格2") return dark ? "#0b1220" : "#f3f8ff";
  if (style === "风格3") return dark ? "#08130d" : "#f6fbf7";
  return dark ? "#0f1115" : "#f6f7fb";
}

const antdTheme = computed(() => ({
  algorithm: isDark.value ? antdThemeApi.darkAlgorithm : antdThemeApi.defaultAlgorithm,
  token: {
    colorPrimary: themePrimary.value,
    colorInfo: themePrimary.value,
    colorLink: themePrimary.value,
    colorSuccess: themeSuccess.value,
    colorWarning: themeWarning.value,
    colorError: themeError.value,
    colorBgBase: themeBg.value,
    colorBgLayout: themeBg.value,
    colorBgContainer: themeSurface.value,
    colorBgElevated: themeSurface.value,
    colorFillTertiary: themeSurface2.value,
    colorText: themeText.value,
    colorTextSecondary: themeTextSecondary.value,
    colorBorder: themeBorder.value,
  },
  components: {
    Menu: {
      itemSelectedBg: themePrimarySoft.value,
      itemSelectedColor: themePrimary.value,
      itemHoverColor: themePrimary.value,
      itemActiveBg: themePrimarySoft.value,
    },
    Tabs: {
      itemSelectedColor: themePrimary.value,
      inkBarColor: themePrimary.value,
      itemHoverColor: themePrimary.value,
    },
    Steps: {
      colorPrimary: themePrimary.value,
    },
    Slider: {
      colorPrimary: themePrimary.value,
      colorPrimaryHover: themePrimary.value,
    },
  },
}));

const styleOptions = computed(() => [
  { value: "风格1", label: "风格1" },
  { value: "风格2", label: "风格2" },
  { value: "风格3", label: "风格3" },
]);

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined"
    ? window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
    : false;
}

async function animateThemeReveal(ev: MouseEvent, nextDark: boolean): Promise<void> {
  const target = ev.currentTarget as HTMLElement | null;
  const rect = target?.getBoundingClientRect();
  const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

  const maxX = Math.max(cx, window.innerWidth - cx);
  const maxY = Math.max(cy, window.innerHeight - cy);
  const radius = Math.ceil(Math.hypot(maxX, maxY));

  // Prefer View Transitions (keeps old UI visible while revealing the new theme).
  const docAny = document as any;
  if (typeof docAny.startViewTransition === "function") {
    const transition = docAny.startViewTransition(() => {
      isDark.value = nextDark;
    });

    await transition.ready;

    const keyframes = [
      { clipPath: `circle(0px at ${cx}px ${cy}px)` },
      { clipPath: `circle(${radius}px at ${cx}px ${cy}px)` },
    ];

    const opts = {
      duration: 420,
      easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      fill: "both",
    } as const;

    document.documentElement.animate(keyframes, {
      ...opts,
      pseudoElement: "::view-transition-new(rooms-app)",
    } as any);

    document.documentElement.animate(keyframes.slice().reverse(), {
      ...opts,
      pseudoElement: "::view-transition-old(rooms-app)",
    } as any);

    await transition.finished;
    return;
  }

  // Fallback: in-app overlay reveal.
  const host = document.getElementById("rooms-app");
  const hostRect = host?.getBoundingClientRect();
  const localX = hostRect ? cx - hostRect.left : cx;
  const localY = hostRect ? cy - hostRect.top : cy;
  const localMaxX = hostRect ? Math.max(localX, hostRect.width - localX) : maxX;
  const localMaxY = hostRect ? Math.max(localY, hostRect.height - localY) : maxY;
  const localRadius = Math.ceil(Math.hypot(localMaxX, localMaxY));

  const overlay = document.createElement("div");
  overlay.className = "rooms-theme-reveal";
  overlay.style.background = getBgFor(styleMode.value, nextDark);
  overlay.style.clipPath = `circle(0px at ${localX}px ${localY}px)`;
  host?.appendChild(overlay);

  const duration = 360;
  const switchAt = Math.floor(duration * 0.55);

  const anim = overlay.animate(
    [
      { clipPath: `circle(0px at ${localX}px ${localY}px)` },
      { clipPath: `circle(${localRadius}px at ${localX}px ${localY}px)` },
    ],
    { duration, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", fill: "forwards" },
  );

  window.setTimeout(() => {
    isDark.value = nextDark;
  }, switchAt);

  await anim.finished.catch(() => undefined);
  overlay.remove();
}

function toggleTheme(ev?: MouseEvent): void {
  const nextDark = !isDark.value;
  if (isThemeTransitioning.value) return;

  if (!ev || prefersReducedMotion()) {
    isDark.value = nextDark;
    return;
  }

  isThemeTransitioning.value = true;
  void animateThemeReveal(ev, nextDark).finally(() => {
    isThemeTransitioning.value = false;
  });
}
</script>

<style>
#rooms-app {
  height: 100%;
  overflow: hidden;
  background: var(--rooms-bg);
  position: relative;
  view-transition-name: rooms-app;
}

#rooms-app.rooms-standalone {
  height: 100vh;
}

.rooms-layout {
  height: 100%;
  background: var(--rooms-bg);
  color: var(--rooms-fg);
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.rooms-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--rooms-header-bg) !important;
  color: var(--rooms-fg) !important;
  padding: 0 16px;
  position: sticky;
  top: 0;
  z-index: 30;
  box-shadow: 0 1px 0 var(--rooms-border);
  height: var(--rooms-header-height);
  flex: 0 0 var(--rooms-header-height);
}

.rooms-header__left {
  font-weight: 600;
}

.rooms-header__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rooms-theme-reveal {
  position: absolute;
  inset: 0;
  z-index: 60;
  pointer-events: none;
  will-change: clip-path;
}

::view-transition-old(rooms-app),
::view-transition-new(rooms-app) {
  animation: none;
  mix-blend-mode: normal;
}

.rooms-header__divider {
  width: 1px;
  height: 18px;
  background: var(--rooms-border);
}

.rooms-style-select {
  width: 140px;
}

.rooms-content {
  padding: 16px;
  background: var(--rooms-bg);
  flex: 1;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: none;
}
</style>
