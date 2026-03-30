export type ProjectFlowKey =
  | "settings"
  | "data"
  | "template"
  | "generate"
  | "report"
  | "compliance"
  | "audit";

export interface ProjectFlowStep {
  key: ProjectFlowKey;
  title: string;
  summary: string;
}

export const PROJECT_FLOW_STEPS: ProjectFlowStep[] = [
  {
    key: "settings",
    title: "项目设置",
    summary: "定义项目基础信息与勘察边界。",
  },
  {
    key: "data",
    title: "多源数据",
    summary: "录入、导入并校验勘察原始数据。",
  },
  {
    key: "template",
    title: "模板选择",
    summary: "为工程类型和地区规范匹配模板。",
  },
  {
    key: "generate",
    title: "AI 生成",
    summary: "编排多智能体任务并输出草稿。",
  },
  {
    key: "report",
    title: "报告编辑",
    summary: "对章节、表格和结论进行结构化修订。",
  },
  {
    key: "compliance",
    title: "合规校验",
    summary: "定位规范冲突、异常参数和表述问题。",
  },
  {
    key: "audit",
    title: "审核归档",
    summary: "完成复核、驳回、通过与归档。",
  },
];

export function buildProjectRoute(projectId: string, step: ProjectFlowKey): string {
  switch (step) {
    case "settings":
      return `/projects/${projectId}/settings`;
    case "data":
      return `/projects/${projectId}/data`;
    case "template":
      return `/projects/${projectId}/template`;
    case "generate":
      return `/projects/${projectId}/generate`;
    case "report":
      return `/projects/${projectId}/report`;
    case "compliance":
      return `/projects/${projectId}/compliance`;
    case "audit":
      return `/projects/${projectId}/audit`;
    default:
      return `/projects/${projectId}/settings`;
  }
}

export function resolveProjectFlowFromPath(pathname: string): ProjectFlowKey | null {
  const step = PROJECT_FLOW_STEPS.find((item) =>
    pathname.includes(`/${item.key}`),
  );

  return step?.key ?? null;
}

export function nextProjectFlowStep(step: ProjectFlowKey): ProjectFlowKey | null {
  const index = PROJECT_FLOW_STEPS.findIndex((item) => item.key === step);

  if (index === -1 || index === PROJECT_FLOW_STEPS.length - 1) {
    return null;
  }

  return PROJECT_FLOW_STEPS[index + 1]?.key ?? null;
}

export function previousProjectFlowStep(step: ProjectFlowKey): ProjectFlowKey | null {
  const index = PROJECT_FLOW_STEPS.findIndex((item) => item.key === step);

  if (index <= 0) {
    return null;
  }

  return PROJECT_FLOW_STEPS[index - 1]?.key ?? null;
}
