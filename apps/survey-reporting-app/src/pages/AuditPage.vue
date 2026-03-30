<template>
  <ProjectRouteShell
    v-if="project"
    :project="project"
    step="audit"
    title="审核与归档"
    description="统一查看报告、记录审核意见，并把通过版本切到只读归档态。"
  >
    <div class="sr-page__stack">
      <a-card class="sr-page__card">
        <a-descriptions bordered :column="2" size="small">
          <a-descriptions-item label="项目">{{ project.name }}</a-descriptions-item>
          <a-descriptions-item label="负责人">{{ project.owner }}</a-descriptions-item>
          <a-descriptions-item label="当前状态">{{ project.status }}</a-descriptions-item>
          <a-descriptions-item label="版本">R2026.03.30-01</a-descriptions-item>
        </a-descriptions>
      </a-card>

      <a-card class="sr-page__card">
        <div class="sr-page__toolbar">
          <h3 class="sr-page__subtitle">审核意见</h3>
          <a-space wrap>
            <a-button @click="router.push(`/projects/${project.id}/report`)">退回编辑</a-button>
            <a-button type="primary">审核通过并归档</a-button>
          </a-space>
        </div>
        <a-form layout="vertical">
          <a-form-item label="审核结论">
            <a-textarea
              v-model:value="reviewNote"
              :rows="6"
              placeholder="填写审核意见、修改要求或归档说明"
            />
          </a-form-item>
        </a-form>
      </a-card>

      <a-card class="sr-page__card">
        <div class="sr-page__toolbar">
          <h3 class="sr-page__subtitle">审核线程</h3>
          <a-tag color="purple">协同复核</a-tag>
        </div>
        <Conversations
          :items="auditThreads"
          :active-key="activeThread"
          groupable
          @active-change="handleActiveChange"
        />
      </a-card>
    </div>

    <template #aside>
      <a-card class="sr-page__card">
        <a-result
          status="success"
          title="归档后只读"
          sub-title="通过后仅保留查看、导出和打印能力，不允许再直接修改正文。"
        />
      </a-card>

      <a-card class="sr-page__card">
        <QuickActionPanel
          title="归档动作"
          description="审核通过后只留下导出、打印和回退记录查看。"
          :items="actionItems"
        />
      </a-card>
    </template>
  </ProjectRouteShell>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  FileWordOutlined,
  PrinterOutlined,
  RollbackOutlined,
} from "@ant-design/icons-vue";
import { Conversations } from "ant-design-x-vue";
import { useRoute, useRouter } from "vue-router";

import ProjectRouteShell from "@/components/ProjectRouteShell.vue";
import QuickActionPanel, { type QuickActionItem } from "@/components/QuickActionPanel.vue";
import { auditThreads, findProjectById } from "@/mock/data";

const route = useRoute();
const router = useRouter();
const project = computed(() => findProjectById(route.params.id as string | undefined));

const reviewNote = ref(
  "建议统一承载力口径，补充地下水雨季不利工况说明后归档。",
);
const activeThread = ref("thread-1");

const actionItems: QuickActionItem[] = [
  {
    key: "export",
    label: "导出归档版",
    description: "输出当前通过审核的只读归档文档。",
    icon: FileWordOutlined,
    tone: "primary",
  },
  {
    key: "print",
    label: "打印审核单",
    description: "生成适合线下盖章或签批的审核单页面。",
    icon: PrinterOutlined,
  },
  {
    key: "rollback",
    label: "打开回退记录",
    description: "查看此前被驳回或撤回的版本痕迹。",
    icon: RollbackOutlined,
  },
];

function handleActiveChange(key: string) {
  activeThread.value = key;
}
</script>
