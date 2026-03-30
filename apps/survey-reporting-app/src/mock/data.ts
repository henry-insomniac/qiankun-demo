export interface ProjectRecord {
  id: string;
  name: string;
  location: string;
  engineeringType: string;
  stage: string;
  owner: string;
  createdAt: string;
  status:
    | "未生成"
    | "生成中"
    | "已生成"
    | "待审核"
    | "已归档";
  riskLevel: "低" | "中" | "高";
}

export interface TemplateRecord {
  id: string;
  name: string;
  type: string;
  region: string;
  standard: string;
  chapters: number;
  summary: string;
  recommended?: boolean;
}

export interface ComplianceIssue {
  id: string;
  level: "错误" | "警告" | "提示";
  section: string;
  title: string;
  description: string;
  action: string;
}

export const projectRows: ProjectRecord[] = [
  {
    id: "alpha-station",
    name: "南站综合交通枢纽详勘",
    location: "成都·武侯",
    engineeringType: "市政",
    stage: "详勘",
    owner: "刘海泉",
    createdAt: "2026-03-25",
    status: "待审核",
    riskLevel: "高",
  },
  {
    id: "river-bridge",
    name: "东河大桥桥位勘察",
    location: "德阳·旌阳",
    engineeringType: "公路",
    stage: "初勘",
    owner: "唐姝",
    createdAt: "2026-03-26",
    status: "生成中",
    riskLevel: "中",
  },
  {
    id: "science-park",
    name: "科创园二期房建勘察",
    location: "成都·高新",
    engineeringType: "房建",
    stage: "施工勘察",
    owner: "何骁",
    createdAt: "2026-03-21",
    status: "已生成",
    riskLevel: "低",
  },
  {
    id: "canal-repair",
    name: "南干渠加固与补勘",
    location: "眉山·东坡",
    engineeringType: "水利",
    stage: "详勘",
    owner: "向真",
    createdAt: "2026-03-19",
    status: "已归档",
    riskLevel: "中",
  },
];

export const templateRows: TemplateRecord[] = [
  {
    id: "tpl-municipal-west",
    name: "市政道路西南地区标准模板",
    type: "市政",
    region: "西南",
    standard: "GB 50021 + 地方补充条文",
    chapters: 16,
    summary: "适合道路、管廊与综合交通枢纽项目，强调地层与水文协同叙述。",
    recommended: true,
  },
  {
    id: "tpl-building-urban",
    name: "房建深基础勘察模板",
    type: "房建",
    region: "全国",
    standard: "GB 50021",
    chapters: 14,
    summary: "适合高层房建和复杂基础形式，章节结构偏重地基评价与建议。",
  },
  {
    id: "tpl-water-canal",
    name: "水利渠道治理模板",
    type: "水利",
    region: "西南",
    standard: "SL 188",
    chapters: 15,
    summary: "适合河渠整治、边坡补勘与防渗专题说明。",
  },
];

export const complianceIssues: ComplianceIssue[] = [
  {
    id: "cmp-01",
    level: "错误",
    section: "4.2 地层分布",
    title: "粉质黏土承载力表述与附表数值不一致",
    description: "正文写为 180kPa，附表记录为 160kPa，需要统一数据源。",
    action: "跳转并统一",
  },
  {
    id: "cmp-02",
    level: "警告",
    section: "6.1 地下水评价",
    title: "地下水埋深缺失雨季修正说明",
    description: "当前结论只引用一次采样结果，缺少雨季不利工况判断。",
    action: "补充判断",
  },
  {
    id: "cmp-03",
    level: "提示",
    section: "7.3 基础建议",
    title: "建议增加持力层选择对比",
    description: "可在桩基础与复合地基方案之间增加经济性对比段落。",
    action: "插入优化段",
  },
];

export const reportSections = [
  {
    key: "overview",
    title: "1. 工程概况",
    content:
      "项目位于成都南站片区，拟建综合交通枢纽及配套地下空间。勘察任务覆盖站场、落客平台和附属市政道路。",
  },
  {
    key: "strata",
    title: "4. 地层与岩性",
    content:
      "场区上覆杂填土与粉质黏土，局部夹卵石层，下伏中风化泥岩。整体分布稳定，但横向变化明显。",
  },
  {
    key: "water",
    title: "5. 地下水",
    content:
      "地下水类型以第四系孔隙潜水为主，受季节降雨和周边排水工程影响较大，建议按不利工况校核。",
  },
  {
    key: "advice",
    title: "7. 基础建议",
    content:
      "站房核心区宜采用桩基础，附属道路与配套构筑物可结合换填和复合地基综合处理。",
  },
];

export const auditThreads = [
  {
    key: "thread-1",
    label: "总工复核意见",
    group: "待处理",
    timestamp: 1711760400000,
  },
  {
    key: "thread-2",
    label: "规范差异说明",
    group: "待处理",
    timestamp: 1711767600000,
  },
  {
    key: "thread-3",
    label: "归档版备注",
    group: "已关闭",
    timestamp: 1711771200000,
  },
];

export function findProjectById(projectId?: string): ProjectRecord | undefined {
  return projectRows.find((item) => item.id === projectId);
}
