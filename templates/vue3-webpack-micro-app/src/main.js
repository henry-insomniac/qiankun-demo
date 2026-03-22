import "./public-path";
import { createApp } from "vue";

import App from "./App.vue";
import { createAppRouter } from "./router";

let app = null;
let router = null;
let root = null;
let cleanupSharedState = null;

function resolveContainer(container) {
  if (container) {
    return container.querySelector("#app");
  }

  return document.querySelector("#app");
}

function normalizeShellProps(props = {}) {
  return {
    appName: "__APP_NAME__",
    appDisplayName: "__APP_DISPLAY_NAME__",
    routeBase: "__APP_ROUTE_BASE__",
    currentUser: null,
    auth: null,
    navigation: null,
    telemetry: null,
    sharedState: null,
    theme: {
      mode: "light",
    },
    ...props,
  };
}

function render(props = {}) {
  const shellProps = normalizeShellProps(props);
  root = resolveContainer(shellProps.container);

  if (!root) {
    throw new Error("__APP_NAME__ mount container #app not found.");
  }

  router = createAppRouter(shellProps.routeBase);
  app = createApp(App, { shellProps });
  app.use(router);
  app.mount(root);

  cleanupSharedState = () => {
    shellProps.sharedState?.offGlobalStateChange?.();
  };
}

export async function bootstrap() {}

export async function mount(props) {
  render(props);
}

export async function unmount() {
  cleanupSharedState?.();

  if (app) {
    app.unmount();
  }

  app = null;
  router = null;
  root = null;
  cleanupSharedState = null;
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({
    routeBase: "/",
  });
}

