function normalizeShellBasePath(basePath: string): string {
  if (!basePath || basePath === "/") {
    return "";
  }

  return basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
}

const runtimeShellBasePath =
  typeof __SHELL_BASE_PATH__ !== "undefined" ? __SHELL_BASE_PATH__ : "";

export const shellBasePath = normalizeShellBasePath(runtimeShellBasePath);

export function resolveShellPath(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return shellBasePath ? `${shellBasePath}${normalizedPath}` : normalizedPath;
}
