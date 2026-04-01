<template>
  <section class="sr-page">
    <a-card class="sr-page__card">
      <div class="sr-page__toolbar">
        <div>
          <h2 class="sr-page__title">报告列表</h2>
          <p class="sr-page__desc">
            已生成的勘察报告台账，可在此查看、编辑或管理报告。
          </p>
        </div>
        <a-button type="primary" @click="router.push('/projects/new')">
          新建项目
        </a-button>
      </div>

      <div class="sr-stat-grid sr-stat-grid--compact">
        <a-card size="small" class="sr-stat-card">
          <span>已生成</span>
          <strong>{{ generatedCount }}</strong>
        </a-card>
        <a-card size="small" class="sr-stat-card">
          <span>待审核</span>
          <strong>{{ auditPendingCount }}</strong>
        </a-card>
        <a-card size="small" class="sr-stat-card">
          <span>已归档</span>
          <strong>{{ archivedCount }}</strong>
        </a-card>
        <a-card size="small" class="sr-stat-card">
          <span>报告总数</span>
          <strong>{{ reports.length }}</strong>
        </a-card>
      </div>
    </a-card>

    <a-card class="sr-page__card">
      <div class="sr-page__filters">
        <a-input-search
          v-model:value="keyword"
          class="sr-page__search"
          placeholder="搜索报告名称或所属项目"
          allow-clear
        />
        <a-select
          v-model:value="statusFilter"
          class="sr-page__select"
          :options="statusOptions"
        />
      </div>

      <a-table
        :columns="columns"
        :data-source="filteredReports"
        row-key="id"
        :pagination="{ pageSize: 8 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div class="sr-project-cell">
              <strong>{{ record.name }}</strong>
              <span>{{ record.projectName }}</span>
            </div>
          </template>
          <template v-else-if="column.key === 'status'">
            <ProjectStatusTag :status="record.status" />
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space wrap>
              <a-button
                size="small"
                @click="router.push(`/projects/${record.projectId}/report/view?reportId=${record.id}`)"
              >
                查看
              </a-button>
              <a-button
                size="small"
                @click="router.push(`/projects/${record.projectId}/report`)"
              >
                编辑
              </a-button>
              <a-popconfirm
                title="确认删除该报告？删除后不可恢复。"
                ok-text="确认"
                cancel-text="取消"
                @confirm="handleDelete(record.id)"
              >
                <a-button size="small" danger>
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
import { message } from "ant-design-vue";

import ProjectStatusTag from "@/components/ProjectStatusTag.vue";
import { reportRows } from "@/mock/data";

const router = useRouter();

const reports = ref([...reportRows]);

const keyword = ref("");
const statusFilter = ref<string>("全部状态");

const statusOptions = [
  { value: "全部状态", label: "全部状态" },
  { value: "已生成", label: "已生成" },
  { value: "待审核", label: "待审核" },
  { value: "已归档", label: "已归档" },
];

const columns = [
  { title: "报告名称 / 所属项目", key: "name" },
  { title: "负责人", dataIndex: "owner", key: "owner" },
  { title: "报告状态", key: "status" },
  { title: "生成时间", dataIndex: "generatedAt", key: "generatedAt" },
  { title: "更新时间", dataIndex: "updatedAt", key: "updatedAt" },
  { title: "操作", key: "actions", width: 220 },
];

const filteredReports = computed(() =>
  reports.value.filter((report) => {
    const matchesKeyword =
      !keyword.value ||
      report.name.includes(keyword.value) ||
      report.projectName.includes(keyword.value);
    const matchesStatus =
      statusFilter.value === "全部状态" || report.status === statusFilter.value;
    return matchesKeyword && matchesStatus;
  }),
);

const generatedCount = computed(
  () => reports.value.filter((r) => r.status === "已生成").length,
);
const auditPendingCount = computed(
  () => reports.value.filter((r) => r.status === "待审核").length,
);
const archivedCount = computed(
  () => reports.value.filter((r) => r.status === "已归档").length,
);

function handleDelete(reportId: string) {
  reports.value = reports.value.filter((r) => r.id !== reportId);
  message.success("报告已删除");
}
</script>
