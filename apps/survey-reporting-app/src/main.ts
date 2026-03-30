import { createApp, type App as VueApp } from "vue";
import Antd from "ant-design-vue";
import AntdX from "ant-design-x-vue";
import { qiankunWindow, renderWithQiankun } from "vite-plugin-qiankun/dist/helper";

import type { ShellAppProps } from "@qiankun-demo/contracts";
import "@qiankun-demo/design-tokens/styles.css";
import "ant-design-vue/dist/reset.css";

import App from "./App.vue";
import { shellPropsKey } from "./lib/shell";
import { createAppRouter } from "./router";
import "./styles.css";

let app: VueApp<Element> | null = null;
let disposeRouter: (() => void) | null = null;

function normalizeRouteBase(base = "/"): string {
  if (!base || base === "/") {
    return "/";
  }

  return base.startsWith("/") ? base.replace(/\/+$/, "") : `/${base.replace(/\/+$/, "")}`;
}

function shouldUseShellHashBridge(routeBase: string): boolean {
  if (typeof window === "undefined" || !qiankunWindow.__POWERED_BY_QIANKUN__) {
    return false;
  }

  const normalizedRouteBase = normalizeRouteBase(routeBase);
  const normalizedHash = window.location.hash.replace(/^#/, "");

  return Boolean(normalizedHash) && normalizedHash.startsWith(normalizedRouteBase);
}

async function render(props: Partial<ShellAppProps> = {}): Promise<void> {
  const container =
    props.container?.querySelector("#app") ?? document.querySelector("#app");

  if (!container) {
    throw new Error("Survey reporting app mount container #app not found.");
  }

  const routeBase = props.routeBase ?? "/";
  const routerBundle = createAppRouter({
    base: routeBase,
    useShellHashBridge: shouldUseShellHashBridge(routeBase),
    navigation: props.navigation,
  });

  disposeRouter?.();
  disposeRouter = routerBundle.dispose;
  await routerBundle.ready;

  app = createApp(App);
  app.provide(shellPropsKey, props);
  app.use(routerBundle.router);
  app.use(Antd);
  app.use(AntdX);
  app.mount(container);
}

renderWithQiankun({
  bootstrap() {},
  async mount(props) {
    app?.unmount();
    app = null;
    await render(props as ShellAppProps);
  },
  update() {},
  unmount() {
    disposeRouter?.();
    disposeRouter = null;
    app?.unmount();
    app = null;
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  void render({
    appName: "survey-reporting-app",
    routeBase: "/",
  });
}
