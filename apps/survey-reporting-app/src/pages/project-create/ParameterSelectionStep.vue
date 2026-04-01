<template>
  <div class="sr-wizard__content">
    <div class="sr-page__two-col">
      <a-card class="sr-page__card">
        <span class="sr-section-eyebrow">工程参数</span>
        <a-form layout="vertical" :model="draft.parameterSelection">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="工程类型" required>
                <a-select v-model:value="draft.parameterSelection.engineeringType" :options="typeOptions" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="勘察阶段" required>
                <a-select v-model:value="draft.parameterSelection.stage" :options="stageOptions" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="行政区域">
                <a-select v-model:value="draft.parameterSelection.region" :options="regionOptions" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="负责人">
                <a-input v-model:value="draft.parameterSelection.owner" placeholder="项目负责人姓名" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>

      <div class="sr-page__stack">
        <a-card class="sr-page__card">
          <span class="sr-section-eyebrow">参数说明</span>
          <p class="sr-page__desc">
            工程类型和勘察阶段决定了报告的模板结构和章节内容要求。
            行政区域影响适用的地方规范补充条文。
          </p>
          <a-alert
            show-icon
            type="info"
            message="参数会影响后续生成结果"
            description="确认参数后进入目录编写，AI 将据此推荐章节结构和规范引用。"
            style="margin-top: 16px"
          />
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { draft } from "@/lib/project-create-draft";

const typeOptions = [
  { value: "房建", label: "房建" },
  { value: "市政", label: "市政" },
  { value: "公路", label: "公路" },
  { value: "水利", label: "水利" },
];

const stageOptions = [
  { value: "初勘", label: "初勘" },
  { value: "详勘", label: "详勘" },
  { value: "施工勘察", label: "施工勘察" },
];

const regionOptions = [
  { value: "西南", label: "西南" },
  { value: "西北", label: "西北" },
  { value: "华东", label: "华东" },
  { value: "华南", label: "华南" },
];
</script>
