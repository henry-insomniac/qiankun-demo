import { reactive } from "vue";

export interface CreateWizardStep {
  key: string;
  title: string;
  path: string;
}

export const WIZARD_STEPS: CreateWizardStep[] = [
  { key: "settings", title: "文档设置", path: "/projects/new/settings" },
  { key: "parameters", title: "参数选择", path: "/projects/new/parameters" },
  { key: "outline", title: "目录编写", path: "/projects/new/outline" },
  { key: "content", title: "正文编写", path: "/projects/new/content" },
];

export function getStepIndex(routePath: string): number {
  const idx = WIZARD_STEPS.findIndex((s) => routePath.startsWith(s.path));
  return idx >= 0 ? idx : 0;
}

export interface DocumentSettingsState {
  title: string;
  referenceDocFiles: string[];
  specificationFiles: string[];
  parameterFiles: string[];
  enableImageReference: boolean;
  generationMode: "ai-full" | "ai-assisted" | "manual";
}

export interface ParameterSelectionState {
  engineeringType: string;
  stage: string;
  region: string;
  owner: string;
}

export interface OutlineItem {
  id: string;
  title: string;
  aiGuidance: string;
  contentHtml: string;
}

export interface OutlineState {
  items: OutlineItem[];
  selectedItemId: string;
}

export type ContentViewMode = "outline" | "content";

export interface ChapterMeta {
  submitted: boolean;
  generatedAt: string;
  humanEdited: boolean;
}

export interface ContentState {
  notes: string;
  viewMode: ContentViewMode;
  selectedChapterId: string;
  isGenerating: boolean;
  chapterMeta: Record<string, ChapterMeta>;
}

export interface ProjectCreateDraft {
  documentSettings: DocumentSettingsState;
  parameterSelection: ParameterSelectionState;
  outline: OutlineState;
  content: ContentState;
}

export const draft = reactive<ProjectCreateDraft>({
  documentSettings: {
    title: "",
    referenceDocFiles: [],
    specificationFiles: [],
    parameterFiles: [],
    enableImageReference: true,
    generationMode: "ai-full",
  },
  parameterSelection: {
    engineeringType: "市政",
    stage: "详勘",
    region: "西南",
    owner: "",
  },
  outline: {
    items: createDefaultOutlineItems(),
    selectedItemId: "ch-1",
  },
  content: {
    notes: "",
    viewMode: "outline",
    selectedChapterId: "ch-1",
    isGenerating: false,
    chapterMeta: {},
  },
});

function createDefaultOutlineItems(): OutlineItem[] {
  return [
    {
      id: "ch-1",
      title: "1. 工程概况",
      aiGuidance: "概述工程名称、建设地点、规模、拟建结构形式和设计参数，明确项目来源和委托单位。",
      contentHtml: "",
    },
    {
      id: "ch-2",
      title: "2. 勘察目的与任务",
      aiGuidance: "阐述本次勘察的目的，列出主要任务清单，包括查明场地地质条件、评价稳定性、提供设计参数等。",
      contentHtml: "",
    },
    {
      id: "ch-3",
      title: "3. 勘察方法与工作量",
      aiGuidance: "介绍采用的勘探手段（钻探、静力触探、标贯等）、孔位布置原则和完成工作量统计表。",
      contentHtml: "",
    },
    {
      id: "ch-4",
      title: "4. 地层与岩性",
      aiGuidance: "按深度分层描述各土/岩层的分布、厚度、颜色、密实度和工程性质，配合柱状图说明。",
      contentHtml: "",
    },
    {
      id: "ch-5",
      title: "5. 地下水",
      aiGuidance: "描述地下水类型、赋存条件、水位观测结果、渗透性和腐蚀性评价。",
      contentHtml: "",
    },
    {
      id: "ch-6",
      title: "6. 场地稳定性评价",
      aiGuidance: "对场地的抗震设防、液化判别、边坡稳定性和不良地质作用进行综合评价。",
      contentHtml: "",
    },
    {
      id: "ch-7",
      title: "7. 基础建议",
      aiGuidance: "根据地质条件提出适宜的基础类型、持力层选择和地基处理方案建议。",
      contentHtml: "",
    },
    {
      id: "ch-8",
      title: "8. 结论与建议",
      aiGuidance: "总结主要勘察结论，提出施工注意事项和后续工作建议。",
      contentHtml: "",
    },
  ];
}

let outlineIdCounter = 9;

export function createOutlineItem(title: string): OutlineItem {
  const id = `ch-${outlineIdCounter++}`;
  return { id, title, aiGuidance: "", contentHtml: "" };
}

export function resetDraft() {
  Object.assign(draft.documentSettings, {
    title: "",
    referenceDocFiles: [],
    specificationFiles: [],
    parameterFiles: [],
    enableImageReference: true,
    generationMode: "ai-full",
  });
  Object.assign(draft.parameterSelection, {
    engineeringType: "市政",
    stage: "详勘",
    region: "西南",
    owner: "",
  });
  draft.outline.items = createDefaultOutlineItems();
  draft.outline.selectedItemId = "ch-1";
  draft.content.notes = "";
  draft.content.viewMode = "outline";
  draft.content.selectedChapterId = "ch-1";
  draft.content.isGenerating = false;
  draft.content.chapterMeta = {};
}
