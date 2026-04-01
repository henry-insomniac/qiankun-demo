import {
  createPlatformApps,
  findPlatformAppByPath,
  isEmbeddedPlatformApp,
  isQiankunPlatformApp,
  microAppManifests,
  platformApps,
  supportsEmbeddedFrame,
} from "./catalog";

describe("platform app catalog", () => {
  it("registers the real survey reporting app and the rooms sample app as qiankun apps", () => {
    const qiankunApps = platformApps.filter(isQiankunPlatformApp);

    expect(qiankunApps.map((app) => app.id)).toEqual([
      "survey-reporting-app",
      "rooms-app",
    ]);
    expect(microAppManifests).toHaveLength(2);
    expect(microAppManifests.map((item) => item.name)).toEqual([
      "survey-reporting-app",
      "rooms-app",
    ]);
    expect(microAppManifests.map((item) => item.routeBase)).toEqual([
      "/survey-reporting",
      "/rooms",
    ]);
    expect(microAppManifests.map((item) => item.activeRule)).toEqual([
      "/survey-reporting",
      "/rooms",
    ]);
  });

  it("registers the four external systems as embedded apps", () => {
    const embeddedApps = platformApps.filter(isEmbeddedPlatformApp);

    expect(embeddedApps.map((app) => app.id)).toEqual([
      "survey-doctor-qa",
      "cross-document-annotation",
      "pdf-parser",
      "knowledge-graph",
    ]);
  });

  it("keeps embedded legacy apps on the local compat proxy by default", () => {
    const embeddedApps = createPlatformApps({ embeddedProxyEnabled: true }).filter(
      isEmbeddedPlatformApp,
    );

    expect(embeddedApps.every(supportsEmbeddedFrame)).toBe(true);
    expect(embeddedApps.map((app) => app.integrationLabel)).toEqual([
      "兼容代理",
      "兼容代理",
      "兼容代理",
      "兼容代理",
    ]);
  });

  it("downgrades embedded legacy apps to external-only links for static preview builds", () => {
    const embeddedApps = createPlatformApps({ embeddedProxyEnabled: false }).filter(
      isEmbeddedPlatformApp,
    );

    expect(embeddedApps.every((app) => app.embedUrl === null)).toBe(true);
    expect(embeddedApps.map((app) => app.accessMode)).toEqual([
      "external-only",
      "external-only",
      "external-only",
      "external-only",
    ]);
    expect(embeddedApps.map((app) => app.standaloneUrl)).toEqual(
      embeddedApps.map((app) => app.sourceUrl),
    );
  });

  it("matches current routes to the configured app entry", () => {
    expect(findPlatformAppByPath("/survey-reporting/projects/alpha-station/report")?.id).toBe(
      "survey-reporting-app",
    );
    expect(findPlatformAppByPath("/knowledge-graph/workspace")?.id).toBe(
      "knowledge-graph",
    );
    expect(findPlatformAppByPath("/rooms/detail/42")?.id).toBe("rooms-app");
    expect(findPlatformAppByPath("/missing")).toBeNull();
  });
});
