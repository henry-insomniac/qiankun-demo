import type { ShellNavigation } from "@qiankun-demo/contracts";

function notifyHistoryListeners(): void {
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export const shellNavigation: ShellNavigation = {
  push(path) {
    window.history.pushState(null, "", path);
    notifyHistoryListeners();
  },
  replace(path) {
    window.history.replaceState(null, "", path);
    notifyHistoryListeners();
  },
};

