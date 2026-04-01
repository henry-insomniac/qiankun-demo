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

export type ReportStatus = "已生成" | "待审核" | "已归档";

export interface ReportRecord {
  id: string;
  projectId: string;
  name: string;
  projectName: string;
  status: ReportStatus;
  owner: string;
  generatedAt: string;
  updatedAt: string;
  htmlContent: string;
}

export const reportRows: ReportRecord[] = [
  {
    id: "rpt-alpha-01",
    projectId: "alpha-station",
    name: "南站综合交通枢纽详勘报告（初稿）",
    projectName: "南站综合交通枢纽详勘",
    status: "待审核",
    owner: "刘海泉",
    generatedAt: "2026-03-28",
    updatedAt: "2026-03-30",
    htmlContent: `
<h1>南站综合交通枢纽详勘报告</h1>
<h2>1. 工程概况</h2>
<p>项目位于成都南站片区，拟建综合交通枢纽及配套地下空间。勘察任务覆盖站场、落客平台和附属市政道路。场地面积约 <strong>12.6 万 m²</strong>，建筑总面积约 <strong>38 万 m²</strong>。</p>
<h2>2. 勘察工作量</h2>
<p>本次勘察共完成钻孔 <strong>86 个</strong>，其中控制性孔 24 个、一般性孔 62 个；原位测试包括标贯试验 312 次、静力触探 18 孔、波速测试 6 孔。</p>
<h2>3. 场地工程地质条件</h2>
<p>场区上覆杂填土与粉质黏土，局部夹卵石层，下伏中风化泥岩。地层整体分布较稳定，但横向厚度变化明显，尤其在站场西侧卵石层尖灭区域需重点关注。</p>
<h3>3.1 地层分布</h3>
<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%">
<thead><tr><th>层号</th><th>岩土名称</th><th>厚度 (m)</th><th>承载力特征值 (kPa)</th></tr></thead>
<tbody>
<tr><td>①</td><td>杂填土</td><td>1.2 ~ 3.8</td><td>—</td></tr>
<tr><td>②</td><td>粉质黏土</td><td>3.5 ~ 8.2</td><td>160</td></tr>
<tr><td>③</td><td>卵石</td><td>0 ~ 6.1</td><td>450</td></tr>
<tr><td>④</td><td>中风化泥岩</td><td>>10</td><td>800</td></tr>
</tbody></table>
<h2>4. 地下水</h2>
<p>地下水类型以第四系孔隙潜水为主，稳定水位埋深 <strong>3.2 m ~ 5.1 m</strong>，受季节降雨和周边排水工程影响较大，建议按不利工况（雨季高水位）校核。</p>
<h2>5. 基础建议</h2>
<p>站房核心区宜采用<strong>桩基础</strong>，以中风化泥岩作为桩端持力层；附属道路与配套构筑物可结合换填和复合地基综合处理。建议桩径 800 mm，有效桩长不小于 18 m。</p>
`,
  },
  {
    id: "rpt-science-01",
    projectId: "science-park",
    name: "科创园二期房建勘察报告",
    projectName: "科创园二期房建勘察",
    status: "已生成",
    owner: "何骁",
    generatedAt: "2026-03-22",
    updatedAt: "2026-03-23",
    htmlContent: `
<h1>科创园二期房建勘察报告</h1>
<h2>1. 工程概况</h2>
<p>项目位于成都高新区，拟建 3 栋高层住宅（地上 32 层、地下 2 层）及裙房商业，总建筑面积约 <strong>15.8 万 m²</strong>。</p>
<h2>2. 场地稳定性评价</h2>
<p>场地地形平坦，无不良地质作用。地震设防烈度 Ⅶ 度，设计基本地震加速度 0.10g，场地类别为 <strong>Ⅱ 类</strong>。</p>
<h2>3. 基础建议</h2>
<p>建议高层主楼采用旋挖灌注桩基础，桩径 1000 mm，桩端进入中风化泥岩不少于 2 倍桩径；裙房可采用天然地基筏板基础。</p>
`,
  },
  {
    id: "rpt-canal-01",
    projectId: "canal-repair",
    name: "南干渠加固与补勘报告（终版）",
    projectName: "南干渠加固与补勘",
    status: "已归档",
    owner: "向真",
    generatedAt: "2026-03-20",
    updatedAt: "2026-03-21",
    htmlContent: `
<h1>南干渠加固与补勘报告</h1>
<h2>1. 工程概况</h2>
<p>南干渠位于眉山市东坡区，全长约 <strong>6.2 km</strong>，本次勘察范围为 K3+200 ~ K5+800 段渠道边坡加固与渗漏治理。</p>
<h2>2. 工程地质条件</h2>
<p>渠道两侧边坡主要由粉质黏土和强风化砂岩组成，局部段存在渗透变形隐患，建议采用灌浆帷幕 + 格构锚固的综合治理方案。</p>
<h2>3. 结论与建议</h2>
<p>K4+100 ~ K4+600 段为重点治理区域，边坡稳定性安全系数不满足规范要求（现状 Fs=0.95），建议在汛期前完成加固施工。</p>
`,
  },
  {
    id: "rpt-alpha-02",
    projectId: "alpha-station",
    name: "南站枢纽补充勘察专题报告",
    projectName: "南站综合交通枢纽详勘",
    status: "已生成",
    owner: "刘海泉",
    generatedAt: "2026-03-30",
    updatedAt: "2026-03-31",
    htmlContent: `
<h1>南站枢纽补充勘察专题报告</h1>
<h2>1. 补勘目的</h2>
<p>针对站场西侧卵石层尖灭区域，补充 12 个钻孔以查明地层横向变化规律，为桩基设计提供依据。</p>
<h2>2. 补勘成果</h2>
<p>补勘结果表明，卵石层在 K0+380 处完全尖灭，桩基需穿越粉质黏土直接进入中风化泥岩，有效桩长相应增加约 4 m。</p>
`,
  },
];

export function findReportById(reportId?: string): ReportRecord | undefined {
  return reportRows.find((item) => item.id === reportId);
}

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
