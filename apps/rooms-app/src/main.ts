import { createApp, type App as VueApp } from "vue";
import Antd from "ant-design-vue";
import App from "./App.vue";

import "./public-path";
import "ant-design-vue/dist/reset.css";
import "./styles/index.css";

type QiankunProps = {
  container?: HTMLElement;
};

let app: VueApp<Element> | null = null;

function render(props?: QiankunProps): void {
  const container =
    props?.container?.querySelector("#app") ?? document.querySelector("#app");

  if (!container) {
    throw new Error("Rooms micro app mount container #app not found.");
  }

  app = createApp(App);
  app.use(Antd);
  app.mount(container);
}

export async function bootstrap(): Promise<void> {}

export async function mount(props: QiankunProps): Promise<void> {
  app?.unmount();
  app = null;
  render(props);
}

export async function unmount(): Promise<void> {
  app?.unmount();
  app = null;
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
