<template>
  <section class="sr-page">
    <a-card class="sr-page__card sr-page__card--hero" :bordered="false">
      <div class="sr-page__toolbar">
        <div>
          <h2 class="sr-page__title">{{ pageTitle }}</h2>
          <p class="sr-page__desc">
            先把项目、阶段、负责人和区域信息定准，后面的数据导入和模板推荐才稳定。
          </p>
        </div>
        <a-space wrap>
          <a-button @click="router.push('/projects')">返回列表</a-button>
          <a-button type="primary" @click="goNext">下一步</a-button>
        </a-space>
      </div>
    </a-card>

    <div class="sr-page__two-col">
      <a-card class="sr-page__card">
        <a-form layout="vertical" :model="formState">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="项目名称" required>
                <a-input v-model:value="formState.name" placeholder="例如：南站综合交通枢纽详勘" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="项目地点" required>
                <a-input
                  v-model:value="formState.location"
                  placeholder="支持行政区 + 详细地址"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="工程类型" required>
                <a-select v-model:value="formState.engineeringType" :options="typeOptions" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="勘察阶段" required>
                <a-select v-model:value="formState.stage" :options="stageOptions" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="负责人" required>
                <a-input v-model:value="formState.owner" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="行政区域">
                <a-auto-complete
                  v-model:value="formState.region"
                  :options="regionOptions"
                  placeholder="选择区域规范归属"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="项目坐标（预留）">
                <a-input
                  v-model:value="formState.coordinate"
                  placeholder="地图拾取将在后续阶段接入"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-alert
            show-icon
            type="info"
            message="地图拾取和真实查重接口暂未接入"
            description="第一阶段先收敛为结构化字段，避免引入额外地图 SDK 和全局副作用。"
          />
        </a-form>
      </a-card>

      <div class="sr-page__stack">
        <a-card class="sr-page__card">
          <Welcome
            title="项目初始化建议"
            description="先把工程类型、阶段和区域定准，模板推荐和规范校验才能稳定命中。"
            variant="borderless"
          />
          <Prompts
            :items="promptItems"
            vertical
            wrap
            title="常用初始化动作"
            @item-click="handlePromptClick"
          />
        </a-card>

        <a-card class="sr-page__card sr-page__card--muted">
          <div class="sr-map-placeholder">
            <span class="sr-map-placeholder__label">地图拾取占位</span>
            <strong>{{ formState.location || "待填写项目地点" }}</strong>
            <p>后续如确需接入地图能力，将作为明确例外项单独评审。</p>
          </div>
        </a-card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { message } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import { Prompts, Welcome } from "ant-design-x-vue";

import { findProjectById } from "@/mock/data";
import { buildProjectRoute } from "@/lib/workflow";
import { useShellProps } from "@/lib/shell";

const route = useRoute();
const router = useRouter();
const shellProps = useShellProps();

const project = computed(() => findProjectById(route.params.id as string | undefined));
const isCreateMode = computed(() => route.path === "/projects/new");

const formState = reactive({
  name: project.value?.name ?? "",
  location: project.value?.location ?? "",
  engineeringType: project.value?.engineeringType ?? "市政",
  stage: project.value?.stage ?? "详勘",
  owner: project.value?.owner ?? shellProps.currentUser?.name ?? "Demo User",
  region: "西南",
  coordinate: "30.6122, 104.0679",
});

const pageTitle = computed(() =>
  isCreateMode.value ? "新建项目" : `项目设置 · ${project.value?.name ?? "未命名项目"}`,
);

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
  { value: "西南" },
  { value: "西北" },
  { value: "华东" },
  { value: "华南" },
];

const promptItems = [
  {
    key: "fill-municipal",
    label: "按市政详勘初始化",
    description: "自动填入常用市政道路项目字段组合。",
  },
  {
    key: "fill-building",
    label: "切换为房建施工勘察",
    description: "适合房建深基础和地库补勘场景。",
  },
  {
    key: "copy-alpha",
    label: "引用近似项目结构",
    description: "复用同地区项目的字段结构，不复用业务数据。",
  },
];

function handlePromptClick(info: { data: { key: string } }) {
  if (info.data.key === "fill-building") {
    formState.engineeringType = "房建";
    formState.stage = "施工勘察";
  } else if (info.data.key === "fill-municipal") {
    formState.engineeringType = "市政";
    formState.stage = "详勘";
  } else {
    formState.region = "西南";
  }

  message.success("项目初始化建议已应用");
}

function goNext() {
  const targetId = project.value?.id ?? "alpha-station";
  router.push(buildProjectRoute(targetId, "data"));
}
</script>
