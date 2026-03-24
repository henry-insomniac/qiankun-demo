import { describe, expect, it } from "vitest";

import {
  matchHashRoutePrefixForPath,
  normalizeAppPath,
  normalizeShellBasePath,
  resolveShellPathForMode,
} from "./basePath";

describe("base path helpers", () => {
  it("normalizes shell and app paths", () => {
    expect(normalizeShellBasePath("")).toBe("");
    expect(normalizeShellBasePath("/qiankun-demo/")).toBe("/qiankun-demo");
    expect(normalizeAppPath("rooms")).toBe("/rooms");
    expect(normalizeAppPath("/rooms")).toBe("/rooms");
  });

  it("builds pathname routes for non-pages environments", () => {
    expect(
      resolveShellPathForMode("/rooms", {
        useHashRouting: false,
        shellBasePath: "/qiankun-demo",
      }),
    ).toBe("/qiankun-demo/rooms");
  });

  it("builds hash routes for pages deployments", () => {
    expect(
      resolveShellPathForMode("/rooms", {
        useHashRouting: true,
        shellBasePath: "/qiankun-demo",
      }),
    ).toBe("#/rooms");
  });

  it("matches hash route prefixes for nested and query routes", () => {
    expect(matchHashRoutePrefixForPath("/rooms", "#/rooms")).toBe(true);
    expect(matchHashRoutePrefixForPath("/rooms", "#/rooms/editor")).toBe(true);
    expect(matchHashRoutePrefixForPath("/rooms", "#/rooms?tab=preview")).toBe(true);
    expect(matchHashRoutePrefixForPath("/rooms", "#/orders")).toBe(false);
  });
});
