import {
  assertMicroAppManifest,
  type MicroAppManifest,
} from "@qiankun-demo/contracts";
import { resolveShellPath } from "./basePath";

const roomsAppEntry =
  typeof __ROOMS_APP_ENTRY__ !== "undefined"
    ? __ROOMS_APP_ENTRY__
    : "http://localhost:7102";

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
  embedUrl: string;
  sourceUrl: string;
  standaloneUrl: string;
}

export type PlatformApp = QiankunPlatformApp | EmbeddedPlatformApp;

const roomsRoutePath = "/rooms";

const roomsManifest: MicroAppManifest = {
  name: "rooms-app",
  domain: "rooms",
  entry: roomsAppEntry,
  activeRule: resolveShellPath(roomsRoutePath),
  mountContainer: "#micro-app-slot",
  routeBase: resolveShellPath(roomsRoutePath),
  ownerTeam: "platform",
  version: "0.1.0",
  standaloneUrl: roomsAppEntry,
  critical: false,
};

assertMicroAppManifest(roomsManifest);

export const platformApps: PlatformApp[] = [
  {
    id: "survey-doctor-qa",
    kind: "embedded",
    routePath: "/survey-doctor-qa",
    navLabel: "勘察博士问答",
    title: "勘察博士问答系统",
    summary:
      "现有系统，当前通过壳内兼容代理接入，便于在统一导航下直接访问。",
    integrationLabel: "兼容代理",
    embedUrl: surveyDoctorQaProxyUrl,
    standaloneUrl: surveyDoctorQaProxyUrl,
    sourceUrl: "http://125.71.97.56:9003",
  },
  {
    id: "cross-document-annotation",
    kind: "embedded",
    routePath: "/cross-document-annotation",
    navLabel: "跨文档标注",
    title: "跨文档关联标注工具",
    summary:
      "现有 Nuxt 系统，当前通过壳内兼容代理接入，保留原有页面和路由行为。",
    integrationLabel: "兼容代理",
    embedUrl: crossDocumentAnnotationProxyUrl,
    standaloneUrl: crossDocumentAnnotationProxyUrl,
    sourceUrl: "http://125.71.97.56:9005",
  },
  {
    id: "pdf-parser",
    kind: "embedded",
    routePath: "/pdf-parser",
    navLabel: "PDF 解析",
    title: "PDF解析工具",
    summary:
      "现有 Vue 系统，当前通过壳内兼容代理接入，保留现有入口与子页面。",
    integrationLabel: "兼容代理",
    embedUrl: pdfParserProxyUrl,
    standaloneUrl: pdfParserProxyUrl,
    sourceUrl: "http://125.71.97.56:9004",
  },
  {
    id: "knowledge-graph",
    kind: "embedded",
    routePath: "/knowledge-graph",
    navLabel: "知识图谱",
    title: "知识图谱",
    summary:
      "现有知识图谱平台，当前通过壳内兼容代理接入，后续可再评估 qiankun 生命周期改造。",
    integrationLabel: "兼容代理",
    embedUrl: knowledgeGraphProxyUrl,
    standaloneUrl: knowledgeGraphProxyUrl,
    sourceUrl: "http://125.71.97.56:9006/",
  },
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

export function findPlatformAppByPath(pathname: string): PlatformApp | null {
  const matchedApps = platformApps
    .filter(
      (app) =>
        pathname === app.routePath || pathname.startsWith(`${app.routePath}/`),
    )
    .sort((left, right) => right.routePath.length - left.routePath.length);

  return matchedApps[0] ?? null;
}
