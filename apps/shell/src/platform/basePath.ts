export function normalizeShellBasePath(basePath: string): string {
  if (!basePath || basePath === "/") {
    return "";
  }

  return basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
}

export function normalizeAppPath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

const runtimeShellBasePath =
  typeof __SHELL_BASE_PATH__ !== "undefined" ? __SHELL_BASE_PATH__ : "";

export const shellBasePath = normalizeShellBasePath(runtimeShellBasePath);
export const useHashRouting =
  typeof __USE_HASH_ROUTING__ !== "undefined" ? __USE_HASH_ROUTING__ : false;

export function resolveLogicalAppPath(path: string): string {
  return normalizeAppPath(path);
}

export function resolveShellPathForMode(
  path: string,
  options: {
    useHashRouting: boolean;
    shellBasePath?: string;
  },
): string {
  const normalizedPath = normalizeAppPath(path);

  if (options.useHashRouting) {
    return `#${normalizedPath}`;
  }

  const normalizedShellBasePath = normalizeShellBasePath(
    options.shellBasePath ?? "",
  );

  return normalizedShellBasePath
    ? `${normalizedShellBasePath}${normalizedPath}`
    : normalizedPath;
}

export function resolveShellPath(path: string): string {
  return resolveShellPathForMode(path, {
    useHashRouting,
    shellBasePath,
  });
}

export function matchHashRoutePrefixForPath(
  routePrefix: string,
  currentHash: string,
): boolean {
  const normalizedPrefix = normalizeAppPath(routePrefix);
  const normalizedCurrentPath =
    (currentHash.replace(/^#/, "").split(/[?#]/, 1)[0] || "/").trim() || "/";

  if (normalizedCurrentPath === normalizedPrefix) {
    return true;
  }

  return normalizedCurrentPath.startsWith(`${normalizedPrefix}/`);
}

export function matchHashRoutePrefix(routePrefix: string): boolean {
  return matchHashRoutePrefixForPath(routePrefix, window.location.hash);
}
