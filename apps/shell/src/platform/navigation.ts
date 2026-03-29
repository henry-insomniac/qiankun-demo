import type { ShellNavigation } from "@qiankun-demo/contracts";
import { resolveShellPath } from "./basePath";

function notifyHistoryListeners(): void {
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export const shellNavigation: ShellNavigation = {
  push(path) {
    window.history.pushState(null, "", resolveShellPath(path));
    notifyHistoryListeners();
  },
  replace(path) {
    window.history.replaceState(null, "", resolveShellPath(path));
    notifyHistoryListeners();
  },
};
