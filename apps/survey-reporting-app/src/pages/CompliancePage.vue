<template>
  <ProjectRouteShell
    v-if="project"
    :project="project"
    step="compliance"
    title="合规校验结果"
    description="把错误、警告和优化建议集中到一个问题工作台，逐条定位与处理。"
  >
    <div class="sr-page__stack">
      <div class="sr-stat-grid">
        <a-card size="small" class="sr-stat-card">
          <span>错误</span>
          <strong>1</strong>
        </a-card>
        <a-card size="small" class="sr-stat-card">
          <span>警告</span>
          <strong>1</strong>
        </a-card>
        <a-card size="small" class="sr-stat-card">
          <span>提示</span>
          <strong>1</strong>
        </a-card>
      </div>

      <a-card class="sr-page__card">
        <div class="sr-page__toolbar">
          <div class="sr-page__filters">
            <a-select v-model:value="levelFilter" class="sr-page__select" :options="levelOptions" />
          </div>
          <a-space wrap>
            <a-button @click="router.push(`/projects/${project.id}/report`)">回到编辑</a-button>
            <a-button type="primary" @click="router.push(`/projects/${project.id}/audit`)">
              校验通过，提交审核
            </a-button>
          </a-space>
        </div>

        <a-table
          :columns="columns"
          :data-source="filteredIssues"
          row-key="id"
          :pagination="false"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'level'">
              <a-tag :color="levelColorMap[record.level]">{{ record.level }}</a-tag>
            </template>
            <template v-else-if="column.key === 'title'">
              <div class="sr-project-cell">
                <strong>{{ record.title }}</strong>
                <span>{{ record.description }}</span>
              </div>
            </template>
            <template v-else-if="column.key === 'action'">
              <a-space wrap>
                <a-button size="small">定位</a-button>
                <a-button size="small">忽略</a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-card>
    </div>

    <template #aside>
      <a-card class="sr-page__card">
        <QuickActionPanel
          title="批量动作"
          description="这几步负责批量处理，但不替代逐条核对结论。"
          :items="actionItems"
        />
      </a-card>
    </template>
  </ProjectRouteShell>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { AimOutlined, ReloadOutlined, StopOutlined } from "@ant-design/icons-vue";
import { useRoute, useRouter } from "vue-router";

import ProjectRouteShell from "@/components/ProjectRouteShell.vue";
import QuickActionPanel, { type QuickActionItem } from "@/components/QuickActionPanel.vue";
import { complianceIssues, findProjectById } from "@/mock/data";

const route = useRoute();
const router = useRouter();
const project = computed(() => findProjectById(route.params.id as string | undefined));

const levelFilter = ref("全部等级");

const levelOptions = [
  { value: "全部等级", label: "全部等级" },
  { value: "错误", label: "错误" },
  { value: "警告", label: "警告" },
  { value: "提示", label: "提示" },
];

const columns = [
  { title: "等级", key: "level" },
  { title: "问题", key: "title" },
  { title: "章节", dataIndex: "section", key: "section" },
  { title: "建议动作", dataIndex: "action", key: "actionLabel" },
  { title: "操作", key: "action" },
];

const filteredIssues = computed(() =>
  complianceIssues.filter((item) => {
    return levelFilter.value === "全部等级" || item.level === levelFilter.value;
  }),
);

const levelColorMap: Record<string, string> = {
  错误: "red",
  警告: "gold",
  提示: "blue",
};

const actionItems: QuickActionItem[] = [
  {
    key: "fix",
    label: "批量定位到正文",
    description: "把当前筛选出的校验项逐条带回编辑区。",
    icon: AimOutlined,
    tone: "primary",
  },
  {
    key: "ignore",
    label: "批量忽略提示",
    description: "只忽略提示级问题，错误和警告仍然保留。",
    icon: StopOutlined,
  },
  {
    key: "rerun",
    label: "重新执行校验",
    description: "在修订后重跑一次规则检查，确认问题是否收敛。",
    icon: ReloadOutlined,
  },
];
</script>
