import {
  findPlatformAppByPath,
  isEmbeddedPlatformApp,
  isQiankunPlatformApp,
  microAppManifests,
  platformApps,
} from "./catalog";

describe("platform app catalog", () => {
  it("keeps rooms as the only qiankun-managed sample app", () => {
    const qiankunApps = platformApps.filter(isQiankunPlatformApp);

    expect(qiankunApps).toHaveLength(1);
    expect(qiankunApps[0]?.id).toBe("rooms-app");
    expect(microAppManifests).toHaveLength(1);
    expect(microAppManifests[0]?.name).toBe("rooms-app");
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

  it("matches current routes to the configured app entry", () => {
    expect(findPlatformAppByPath("/knowledge-graph/workspace")?.id).toBe(
      "knowledge-graph",
    );
    expect(findPlatformAppByPath("/rooms/detail/42")?.id).toBe("rooms-app");
    expect(findPlatformAppByPath("/missing")).toBeNull();
  });
});
