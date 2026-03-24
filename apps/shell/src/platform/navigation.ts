import type { ShellNavigation } from "@qiankun-demo/contracts";
import { resolveLogicalAppPath, resolveShellPath, useHashRouting } from "./basePath";

function notifyHistoryListeners(): void {
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function notifyHashListeners(): void {
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

export const shellNavigation: ShellNavigation = {
  push(path) {
    if (useHashRouting) {
      window.location.hash = resolveLogicalAppPath(path);
      return;
    }

    window.history.pushState(null, "", resolveShellPath(path));
    notifyHistoryListeners();
  },
  replace(path) {
    if (useHashRouting) {
      const hashPath = `#${resolveLogicalAppPath(path)}`;
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}${hashPath}`,
      );
      notifyHashListeners();
      return;
    }

    window.history.replaceState(null, "", resolveShellPath(path));
    notifyHistoryListeners();
  },
};
