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

function render(props: Partial<ShellAppProps> = {}): void {
  const container =
    props.container?.querySelector("#app") ?? document.querySelector("#app");

  if (!container) {
    throw new Error("Survey reporting app mount container #app not found.");
  }

  const router = createAppRouter(props.routeBase ?? "/");

  app = createApp(App);
  app.provide(shellPropsKey, props);
  app.use(router);
  app.use(Antd);
  app.use(AntdX);
  app.mount(container);
}

renderWithQiankun({
  bootstrap() {},
  mount(props) {
    app?.unmount();
    app = null;
    render(props as ShellAppProps);
  },
  update() {},
  unmount() {
    app?.unmount();
    app = null;
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({
    appName: "survey-reporting-app",
    routeBase: "/",
  });
}
