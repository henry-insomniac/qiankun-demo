<template>
  <ProjectRouteShell
    v-if="project"
    :project="project"
    step="template"
    title="报告模板选择"
    description="先确定规范模板，再进入 AI 编排，减少后续结构性返工。"
  >
    <a-card class="sr-page__card">
      <div class="sr-page__filters">
        <a-select v-model:value="typeFilter" class="sr-page__select" :options="typeOptions" />
        <a-select v-model:value="regionFilter" class="sr-page__select" :options="regionOptions" />
      </div>

      <div class="sr-template-grid">
        <a-card
          v-for="item in filteredTemplates"
          :key="item.id"
          class="sr-template-card"
          :class="{ 'is-selected': item.id === selectedTemplateId }"
          hoverable
        >
          <template #title>
            <div class="sr-template-card__title">
              <span>{{ item.name }}</span>
              <a-tag v-if="item.recommended" color="success">推荐</a-tag>
            </div>
          </template>

          <a-space wrap class="sr-template-card__meta">
            <a-tag color="geekblue">{{ item.type }}</a-tag>
            <a-tag>{{ item.region }}</a-tag>
            <a-tag>{{ item.standard }}</a-tag>
          </a-space>

          <p>{{ item.summary }}</p>
          <div class="sr-template-card__footer">
            <span>{{ item.chapters }} 个章节</span>
            <a-space>
              <a-button size="small" @click="openPreview(item.id)">预览</a-button>
              <a-button size="small" type="primary" @click="selectedTemplateId = item.id">
                选择
              </a-button>
            </a-space>
          </div>
        </a-card>
      </div>
    </a-card>

    <template #aside>
      <a-card class="sr-page__card">
        <Welcome
          title="系统推荐"
          description="当前项目是西南地区市政详勘，优先推荐包含水文补充说明和综合交通章节结构的模板。"
          variant="borderless"
        />
        <a-space direction="vertical" style="width: 100%">
          <a-button block @click="openPreview(selectedTemplateId)">查看推荐模板</a-button>
          <a-button
            block
            type="primary"
            @click="router.push(`/projects/${project.id}/generate`)"
          >
            确认并进入生成
          </a-button>
        </a-space>
      </a-card>
    </template>

    <a-drawer
      :open="previewOpen"
      width="420"
      title="模板预览"
      @close="previewOpen = false"
    >
      <template v-if="selectedTemplate">
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="模板名称">
            {{ selectedTemplate.name }}
          </a-descriptions-item>
          <a-descriptions-item label="适用类型">
            {{ selectedTemplate.type }}
          </a-descriptions-item>
          <a-descriptions-item label="规范">
            {{ selectedTemplate.standard }}
          </a-descriptions-item>
          <a-descriptions-item label="章节数">
            {{ selectedTemplate.chapters }}
          </a-descriptions-item>
        </a-descriptions>
        <a-divider />
        <p>{{ selectedTemplate.summary }}</p>
      </template>
    </a-drawer>
  </ProjectRouteShell>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Welcome } from "ant-design-x-vue";

import ProjectRouteShell from "@/components/ProjectRouteShell.vue";
import { findProjectById, templateRows } from "@/mock/data";

const route = useRoute();
const router = useRouter();
const project = computed(() => findProjectById(route.params.id as string | undefined));

const typeFilter = ref("全部类型");
const regionFilter = ref("全部地区");
const previewOpen = ref(false);
const selectedTemplateId = ref("tpl-municipal-west");

const typeOptions = [
  { value: "全部类型", label: "全部类型" },
  { value: "市政", label: "市政" },
  { value: "房建", label: "房建" },
  { value: "水利", label: "水利" },
];

const regionOptions = [
  { value: "全部地区", label: "全部地区" },
  { value: "西南", label: "西南" },
  { value: "全国", label: "全国" },
];

const filteredTemplates = computed(() =>
  templateRows.filter((item) => {
    const matchesType =
      typeFilter.value === "全部类型" || item.type === typeFilter.value;
    const matchesRegion =
      regionFilter.value === "全部地区" || item.region === regionFilter.value;

    return matchesType && matchesRegion;
  }),
);

const selectedTemplate = computed(
  () => templateRows.find((item) => item.id === selectedTemplateId.value) ?? templateRows[0],
);

function openPreview(templateId: string) {
  selectedTemplateId.value = templateId;
  previewOpen.value = true;
}
</script>
