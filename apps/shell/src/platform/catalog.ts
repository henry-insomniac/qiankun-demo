import {
  assertMicroAppManifest,
  type MicroAppManifest,
} from "@qiankun-demo/contracts";

const roomsAppEntry =
  typeof __ROOMS_APP_ENTRY__ !== "undefined"
    ? __ROOMS_APP_ENTRY__
    : "http://localhost:7102";

const surveyReportingAppEntry =
  typeof __SURVEY_REPORTING_APP_ENTRY__ !== "undefined"
    ? __SURVEY_REPORTING_APP_ENTRY__
    : "http://localhost:7103";

const surveyDoctorQaProxyUrl =
  typeof __SURVEY_DOCTOR_QA_PROXY_URL__ !== "undefined"
    ? __SURVEY_DOCTOR_QA_PROXY_URL__
    : "http://localhost:7203";

const crossDocumentAnnotationProxyUrl =
  typeof __CROSS_DOCUMENT_ANNOTATION_PROXY_URL__ !== "undefined"
    ? __CROSS_DOCUMENT_ANNOTATION_PROXY_URL__
    : "http://localhost:7205";

const pdfParserProxyUrl =
  typeof __PDF_PARSER_PROXY_URL__ !== "undefined"
    ? __PDF_PARSER_PROXY_URL__
    : "http://localhost:7204";

const knowledgeGraphProxyUrl =
  typeof __KNOWLEDGE_GRAPH_PROXY_URL__ !== "undefined"
    ? __KNOWLEDGE_GRAPH_PROXY_URL__
    : "http://localhost:7206";

const embeddedProxyEnabled =
  typeof __EMBEDDED_PROXY_ENABLED__ !== "undefined"
    ? __EMBEDDED_PROXY_ENABLED__
    : true;

interface PlatformAppCommon {
  id: string;
  routePath: string;
  navLabel: string;
  title: string;
  summary: string;
  integrationLabel: string;
}

export interface QiankunPlatformApp extends PlatformAppCommon {
  kind: "qiankun";
  manifest: MicroAppManifest;
  standaloneUrl: string;
}

export interface EmbeddedPlatformApp extends PlatformAppCommon {
  kind: "embedded";
  embedUrl: string | null;
  sourceUrl: string;
  standaloneUrl: string;
  accessMode: "compat-proxy" | "external-only";
  accessNotice?: string;
}

export type PlatformApp = QiankunPlatformApp | EmbeddedPlatformApp;

interface EmbeddedCatalogInput extends PlatformAppCommon {
  proxyUrl: string;
  sourceUrl: string;
}

interface CreatePlatformAppsOptions {
  embeddedProxyEnabled?: boolean;
}

const roomsRoutePath = "/rooms";
const surveyReportingRoutePath = "/survey-reporting";
const embeddedExternalOnlyNotice =
  "当前静态预览环境不提供旧系统兼容代理，不能在 shell 内直接内嵌，请使用独立打开。";

function createEmbeddedPlatformApp({
  proxyUrl,
  sourceUrl,
  ...app
}: EmbeddedCatalogInput,
proxyEnabled: boolean,
): EmbeddedPlatformApp {
  const accessMode = proxyEnabled ? "compat-proxy" : "external-only";

  return {
    ...app,
    kind: "embedded",
    integrationLabel: proxyEnabled ? "兼容代理" : "外部直达",
    embedUrl: proxyEnabled ? proxyUrl : null,
    standaloneUrl: proxyEnabled ? proxyUrl : sourceUrl,
    sourceUrl,
    accessMode,
    accessNotice:
      accessMode === "external-only" ? embeddedExternalOnlyNotice : undefined,
  };
}

export function createPlatformApps(
  options: CreatePlatformAppsOptions = {},
): PlatformApp[] {
  const proxyEnabled = options.embeddedProxyEnabled ?? embeddedProxyEnabled;
  const roomsManifest: MicroAppManifest = {
    name: "rooms-app",
    domain: "rooms",
    entry: roomsAppEntry,
    activeRule: roomsRoutePath,
    mountContainer: "#micro-app-slot",
    routeBase: roomsRoutePath,
    ownerTeam: "platform",
    version: "0.1.0",
    standaloneUrl: roomsAppEntry,
    critical: false,
  };

  assertMicroAppManifest(roomsManifest);

  const surveyReportingManifest: MicroAppManifest = {
    name: "survey-reporting-app",
    domain: "survey-reporting",
    entry: surveyReportingAppEntry,
    activeRule: surveyReportingRoutePath,
    mountContainer: "#micro-app-slot",
    routeBase: surveyReportingRoutePath,
    ownerTeam: "survey-ai",
    version: "0.1.0",
    standaloneUrl: surveyReportingAppEntry,
    critical: true,
  };

  assertMicroAppManifest(surveyReportingManifest);

  return [
    {
      id: "survey-reporting-app",
      kind: "qiankun",
      routePath: surveyReportingRoutePath,
      navLabel: "AI 勘察报告",
      title: "AI 勘察报告智能生成系统",
      summary:
        "首个真实业务 qiankun 微应用，覆盖项目、数据、模板、生成、编辑、校验和审核流程。",
      integrationLabel: "qiankun",
      standaloneUrl: surveyReportingAppEntry,
      manifest: surveyReportingManifest,
    },
    createEmbeddedPlatformApp({
      id: "survey-doctor-qa",
      routePath: "/survey-doctor-qa",
      navLabel: "勘察博士问答",
      title: "勘察博士问答系统",
      summary:
        "现有系统，当前通过壳内兼容代理接入，便于在统一导航下直接访问。",
      integrationLabel: "兼容代理",
      proxyUrl: surveyDoctorQaProxyUrl,
      sourceUrl: "http://125.71.97.56:9003",
    }, proxyEnabled),
    createEmbeddedPlatformApp({
      id: "cross-document-annotation",
      routePath: "/cross-document-annotation",
      navLabel: "跨文档标注",
      title: "跨文档关联标注工具",
      summary:
        "现有 Nuxt 系统，当前通过壳内兼容代理接入，保留原有页面和路由行为。",
      integrationLabel: "兼容代理",
      proxyUrl: crossDocumentAnnotationProxyUrl,
      sourceUrl: "http://125.71.97.56:9005",
    }, proxyEnabled),
    createEmbeddedPlatformApp({
      id: "pdf-parser",
      routePath: "/pdf-parser",
      navLabel: "PDF 解析",
      title: "PDF解析工具",
      summary:
        "现有 Vue 系统，当前通过壳内兼容代理接入，保留现有入口与子页面。",
      integrationLabel: "兼容代理",
      proxyUrl: pdfParserProxyUrl,
      sourceUrl: "http://125.71.97.56:9004",
    }, proxyEnabled),
    createEmbeddedPlatformApp({
      id: "knowledge-graph",
      routePath: "/knowledge-graph",
      navLabel: "知识图谱",
      title: "知识图谱",
      summary:
        "现有知识图谱平台，当前通过壳内兼容代理接入，后续可再评估 qiankun 生命周期改造。",
      integrationLabel: "兼容代理",
      proxyUrl: knowledgeGraphProxyUrl,
      sourceUrl: "http://125.71.97.56:9006/",
    }, proxyEnabled),
    {
      id: "rooms-app",
      kind: "qiankun",
      routePath: roomsRoutePath,
      navLabel: "样板间",
      title: "样板间",
      summary:
        "平台内置 qiankun 样板微应用，保留用于契约、主题和生命周期验证。",
      integrationLabel: "qiankun",
      standaloneUrl: roomsAppEntry,
      manifest: roomsManifest,
    },
  ];
}

export const platformApps: PlatformApp[] = createPlatformApps();

export const microAppManifests = platformApps
  .filter(isQiankunPlatformApp)
  .map((app) => app.manifest);

export function isQiankunPlatformApp(
  app: PlatformApp,
): app is QiankunPlatformApp {
  return app.kind === "qiankun";
}

export function isEmbeddedPlatformApp(
  app: PlatformApp,
): app is EmbeddedPlatformApp {
  return app.kind === "embedded";
}

export function supportsEmbeddedFrame(
  app: EmbeddedPlatformApp,
): app is EmbeddedPlatformApp & { embedUrl: string } {
  return typeof app.embedUrl === "string" && app.embedUrl.length > 0;
}

export function findPlatformAppByPath(pathname: string): PlatformApp | null {
  const matchedApps = platformApps
    .filter(
      (app) =>
        pathname === app.routePath || pathname.startsWith(`${app.routePath}/`),
    )
    .sort((left, right) => right.routePath.length - left.routePath.length);

  return matchedApps[0] ?? null;
}
