<template>
  <section v-if="report" class="sr-page sr-report-preview">
    <a-card class="sr-page__card sr-report-preview__meta">
      <h2 class="sr-report-preview__title">{{ report.name }}</h2>
      <a-descriptions :column="{ xs: 1, sm: 2, md: 4 }" size="small" :bordered="false">
        <a-descriptions-item label="状态">
          <ProjectStatusTag :status="report.status" />
        </a-descriptions-item>
        <a-descriptions-item label="负责人">{{ report.owner }}</a-descriptions-item>
        <a-descriptions-item label="生成时间">{{ report.generatedAt }}</a-descriptions-item>
        <a-descriptions-item label="更新时间">{{ report.updatedAt }}</a-descriptions-item>
      </a-descriptions>
      <div class="sr-report-preview__actions">
        <a-button size="small" @click="router.push('/projects')">返回列表</a-button>
      </div>
    </a-card>

    <a-card class="sr-page__card">
      <div class="sr-report-view__content" v-html="report.htmlContent" />
    </a-card>
  </section>

  <section v-else class="sr-page sr-report-preview">
    <a-card class="sr-page__card">
      <a-empty description="未找到该报告">
        <a-button @click="router.push('/projects')">返回列表</a-button>
      </a-empty>
    </a-card>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import ProjectStatusTag from "@/components/ProjectStatusTag.vue";
import { findReportById, reportRows } from "@/mock/data";

const route = useRoute();
const router = useRouter();

const report = computed(() => {
  const reportId = route.query.reportId as string | undefined;
  if (reportId) {
    return findReportById(reportId);
  }
  return reportRows.find((r) => r.projectId === route.params.id);
});
</script>
