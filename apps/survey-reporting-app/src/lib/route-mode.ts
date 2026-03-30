export function normalizeRouteBase(base = "/"): string {
  if (!base || base === "/") {
    return "/";
  }

  return base.startsWith("/") ? base.replace(/\/+$/, "") : `/${base.replace(/\/+$/, "")}`;
}

export function shouldUseShellHashBridge(
  routeBase: string,
  options: {
    container?: unknown;
    currentHash?: string;
  },
): boolean {
  if (!options.container) {
    return false;
  }

  const normalizedRouteBase = normalizeRouteBase(routeBase);
  const normalizedHash = (options.currentHash ?? "").replace(/^#/, "");

  if (!normalizedHash) {
    return false;
  }

  return (
    normalizedHash === normalizedRouteBase ||
    normalizedHash.startsWith(`${normalizedRouteBase}/`)
  );
}
