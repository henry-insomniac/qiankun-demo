import { normalizeRouteBase, shouldUseShellHashBridge } from "./route-mode";

describe("route mode helpers", () => {
  it("normalizes route base with a leading slash", () => {
    expect(normalizeRouteBase("survey-reporting/")).toBe("/survey-reporting");
    expect(normalizeRouteBase("/survey-reporting/")).toBe("/survey-reporting");
    expect(normalizeRouteBase("/")).toBe("/");
  });

  it("uses shell hash bridge when qiankun mount container exists and hash matches route base", () => {
    expect(
      shouldUseShellHashBridge("/survey-reporting", {
        container: {},
        currentHash: "#/survey-reporting/projects",
      }),
    ).toBe(true);
  });

  it("does not use shell hash bridge for unrelated hashes", () => {
    expect(
      shouldUseShellHashBridge("/survey-reporting", {
        container: {},
        currentHash: "#/rooms",
      }),
    ).toBe(false);
    expect(
      shouldUseShellHashBridge("/survey-reporting", {
        container: {},
        currentHash: "#/survey-reporting-labs",
      }),
    ).toBe(false);
  });

  it("does not use shell hash bridge without a qiankun container", () => {
    expect(
      shouldUseShellHashBridge("/survey-reporting", {
        currentHash: "#/survey-reporting/projects",
      }),
    ).toBe(false);
  });
});
