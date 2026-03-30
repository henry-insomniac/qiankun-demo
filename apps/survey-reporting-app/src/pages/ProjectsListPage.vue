<template>
  <section class="sr-page">
    <a-card class="sr-page__card sr-page__card--hero" :bordered="false">
      <div class="sr-page__toolbar">
        <div>
          <h2 class="sr-page__title">项目列表</h2>
          <p class="sr-page__desc">
            从同一张项目台账进入数据装配、模板匹配和生成流程。
          </p>
        </div>
        <a-space wrap>
          <a-button @click="router.push('/projects/alpha-station/report')">
            打开最近报告
          </a-button>
          <a-button type="primary" @click="router.push('/projects/new')">
            新建项目
          </a-button>
        </a-space>
      </div>

      <div class="sr-stat-grid">
        <a-card size="small" class="sr-stat-card">
          <span>待审核</span>
          <strong>{{ auditPendingCount }}</strong>
        </a-card>
        <a-card size="small" class="sr-stat-card">
          <span>生成中</span>
          <strong>{{ generatingCount }}</strong>
        </a-card>
        <a-card size="small" class="sr-stat-card">
          <span>已归档</span>
          <strong>{{ archivedCount }}</strong>
        </a-card>
        <a-card size="small" class="sr-stat-card">
          <span>高风险项目</span>
          <strong>{{ highRiskCount }}</strong>
        </a-card>
      </div>
    </a-card>

    <a-card class="sr-page__card">
      <div class="sr-page__filters">
        <a-input-search
          v-model:value="keyword"
          class="sr-page__search"
          placeholder="搜索项目名称或地点"
          allow-clear
        />
        <a-select
          v-model:value="statusFilter"
          class="sr-page__select"
          :options="statusOptions"
        />
        <a-select
          v-model:value="stageFilter"
          class="sr-page__select"
          :options="stageOptions"
        />
      </div>

      <a-table
        :columns="columns"
        :data-source="filteredProjects"
        row-key="id"
        :pagination="{ pageSize: 6 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div class="sr-project-cell">
              <strong>{{ record.name }}</strong>
              <span>{{ record.location }}</span>
            </div>
          </template>
          <template v-else-if="column.key === 'status'">
            <ProjectStatusTag :status="record.status" />
          </template>
          <template v-else-if="column.key === 'riskLevel'">
            <a-tag :color="riskColorMap[record.riskLevel]">{{ record.riskLevel }}</a-tag>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space wrap>
              <a-button size="small" @click="router.push(`/projects/${record.id}/settings`)">
                编辑
              </a-button>
              <a-button size="small" @click="router.push(`/projects/${record.id}/data`)">
                进入
              </a-button>
              <a-popconfirm
                title="已生成和已归档项目不允许删除，是否仅清理草稿数据？"
                ok-text="确认"
                cancel-text="取消"
              >
                <a-button size="small" danger :disabled="record.status !== '未生成'">
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import ProjectStatusTag from "@/components/ProjectStatusTag.vue";
import { projectRows } from "@/mock/data";

const router = useRouter();

const keyword = ref("");
const statusFilter = ref<string>("全部状态");
const stageFilter = ref<string>("全部阶段");

const statusOptions = [
  { value: "全部状态", label: "全部状态" },
  { value: "未生成", label: "未生成" },
  { value: "生成中", label: "生成中" },
  { value: "已生成", label: "已生成" },
  { value: "待审核", label: "待审核" },
  { value: "已归档", label: "已归档" },
];

const stageOptions = [
  { value: "全部阶段", label: "全部阶段" },
  { value: "初勘", label: "初勘" },
  { value: "详勘", label: "详勘" },
  { value: "施工勘察", label: "施工勘察" },
];

const columns = [
  { title: "项目名称 / 地点", key: "name" },
  { title: "工程类型", dataIndex: "engineeringType", key: "engineeringType" },
  { title: "勘察阶段", dataIndex: "stage", key: "stage" },
  { title: "负责人", dataIndex: "owner", key: "owner" },
  { title: "创建时间", dataIndex: "createdAt", key: "createdAt" },
  { title: "风险等级", key: "riskLevel" },
  { title: "报告状态", key: "status" },
  { title: "操作", key: "actions" },
];

const filteredProjects = computed(() =>
  projectRows.filter((project) => {
    const matchesKeyword =
      !keyword.value ||
      project.name.includes(keyword.value) ||
      project.location.includes(keyword.value);
    const matchesStatus =
      statusFilter.value === "全部状态" || project.status === statusFilter.value;
    const matchesStage =
      stageFilter.value === "全部阶段" || project.stage === stageFilter.value;

    return matchesKeyword && matchesStatus && matchesStage;
  }),
);

const auditPendingCount = computed(
  () => projectRows.filter((item) => item.status === "待审核").length,
);
const generatingCount = computed(
  () => projectRows.filter((item) => item.status === "生成中").length,
);
const archivedCount = computed(
  () => projectRows.filter((item) => item.status === "已归档").length,
);
const highRiskCount = computed(
  () => projectRows.filter((item) => item.riskLevel === "高").length,
);

const riskColorMap: Record<string, string> = {
  低: "green",
  中: "gold",
  高: "red",
};
</script>
