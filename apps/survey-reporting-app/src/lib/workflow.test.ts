import {
  PROJECT_FLOW_STEPS,
  buildProjectRoute,
  nextProjectFlowStep,
  previousProjectFlowStep,
  resolveProjectFlowFromPath,
} from "./workflow";

describe("survey reporting workflow", () => {
  it("keeps the project workflow ordered from settings to audit", () => {
    expect(PROJECT_FLOW_STEPS.map((item) => item.key)).toEqual([
      "settings",
      "data",
      "template",
      "generate",
      "report",
      "compliance",
      "audit",
    ]);
  });

  it("builds stable project routes for each workflow step", () => {
    expect(buildProjectRoute("alpha-station", "generate")).toBe(
      "/projects/alpha-station/generate",
    );
    expect(buildProjectRoute("alpha-station", "audit")).toBe(
      "/projects/alpha-station/audit",
    );
  });

  it("derives the workflow step from a nested route path", () => {
    expect(resolveProjectFlowFromPath("/projects/alpha-station/report")).toBe(
      "report",
    );
    expect(resolveProjectFlowFromPath("/projects/alpha-station/compliance")).toBe(
      "compliance",
    );
    expect(resolveProjectFlowFromPath("/projects")).toBeNull();
  });

  it("calculates next and previous workflow links", () => {
    expect(nextProjectFlowStep("settings")).toBe("data");
    expect(nextProjectFlowStep("audit")).toBeNull();
    expect(previousProjectFlowStep("template")).toBe("data");
    expect(previousProjectFlowStep("settings")).toBeNull();
  });
});
