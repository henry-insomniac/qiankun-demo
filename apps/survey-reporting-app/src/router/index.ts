import { createRouter, createWebHistory } from "vue-router";

import AuditPage from "@/pages/AuditPage.vue";
import CompliancePage from "@/pages/CompliancePage.vue";
import DataManagementPage from "@/pages/DataManagementPage.vue";
import GeneratePage from "@/pages/GeneratePage.vue";
import ProjectSettingsPage from "@/pages/ProjectSettingsPage.vue";
import ProjectsListPage from "@/pages/ProjectsListPage.vue";
import ReportEditorPage from "@/pages/ReportEditorPage.vue";
import TemplateSelectPage from "@/pages/TemplateSelectPage.vue";

export function createAppRouter(base = "/") {
  return createRouter({
    history: createWebHistory(base),
    routes: [
      {
        path: "/",
        redirect: "/projects",
      },
      {
        path: "/projects",
        component: ProjectsListPage,
        meta: {
          title: "项目列表",
          summary: "从统一项目台账进入 AI 勘察报告生产流程。",
        },
      },
      {
        path: "/projects/new",
        component: ProjectSettingsPage,
        meta: {
          title: "新建项目",
          summary: "定义项目、阶段和负责人，作为后续数据装配入口。",
        },
      },
      {
        path: "/projects/:id/settings",
        component: ProjectSettingsPage,
        meta: {
          title: "项目设置",
          summary: "校准项目元数据与勘察边界。",
        },
      },
      {
        path: "/projects/:id/data",
        component: DataManagementPage,
        meta: {
          title: "多源数据管理",
          summary: "录入、导入与校验勘察数据，形成可生成的结构化底稿。",
        },
      },
      {
        path: "/projects/:id/template",
        component: TemplateSelectPage,
        meta: {
          title: "模板选择",
          summary: "根据工程类型、地区和规范组合报告模板。",
        },
      },
      {
        path: "/projects/:id/generate",
        component: GeneratePage,
        meta: {
          title: "AI 生成控制",
          summary: "编排多智能体生成、校验和文档合成任务。",
        },
      },
      {
        path: "/projects/:id/report",
        component: ReportEditorPage,
        meta: {
          title: "报告编辑",
          summary: "基于章节树和问题面板进行结构化修订。",
        },
      },
      {
        path: "/projects/:id/compliance",
        component: CompliancePage,
        meta: {
          title: "合规校验",
          summary: "集中处理规范冲突、参数异常和优化建议。",
        },
      },
      {
        path: "/projects/:id/audit",
        component: AuditPage,
        meta: {
          title: "审核与归档",
          summary: "完成复核、意见回流和只读归档。",
        },
      },
    ],
  });
}
