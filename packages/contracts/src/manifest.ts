export interface MicroAppManifest {
  name: string;
  domain: string;
  entry: string;
  activeRule: string;
  mountContainer: string;
  routeBase: string;
  ownerTeam: string;
  version: string;
  standaloneUrl: string;
  critical?: boolean;
}

export function normalizeRouteBase(routeBase: string): string {
  if (!routeBase.startsWith("/")) {
    return `/${routeBase}`;
  }

  return routeBase;
}

export function assertMicroAppManifest(
  manifest: Partial<MicroAppManifest>,
): asserts manifest is MicroAppManifest {
  const requiredFields: Array<keyof MicroAppManifest> = [
    "name",
    "domain",
    "entry",
    "activeRule",
    "mountContainer",
    "routeBase",
    "ownerTeam",
    "version",
    "standaloneUrl",
  ];

  for (const field of requiredFields) {
    if (!manifest[field]) {
      throw new Error(`Micro app manifest field "${field}" is required.`);
    }
  }

  if (!manifest.routeBase?.startsWith("/")) {
    throw new Error('Micro app manifest "routeBase" must start with "/".');
  }

  if (!manifest.activeRule?.startsWith("/")) {
    throw new Error('Micro app manifest "activeRule" must start with "/".');
  }
}

