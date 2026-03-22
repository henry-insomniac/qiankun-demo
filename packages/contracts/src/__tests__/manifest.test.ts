import {
  assertMicroAppManifest,
  normalizeRouteBase,
} from "../manifest";

describe("manifest helpers", () => {
  it("normalizes route base with a leading slash", () => {
    expect(normalizeRouteBase("orders")).toBe("/orders");
    expect(normalizeRouteBase("/orders")).toBe("/orders");
  });

  it("rejects manifests without required fields", () => {
    expect(() => {
      assertMicroAppManifest({
        name: "orders-app",
      });
    }).toThrowError(/required/);
  });

  it("rejects route base without a leading slash", () => {
    expect(() => {
      assertMicroAppManifest({
        name: "orders-app",
        domain: "orders",
        entry: "http://localhost:7101",
        activeRule: "/orders",
        mountContainer: "#micro-app-slot",
        routeBase: "orders",
        ownerTeam: "platform",
        version: "0.1.0",
        standaloneUrl: "http://localhost:7101",
      });
    }).toThrowError(/routeBase/);
  });
});
