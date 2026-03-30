<template>
  <ProjectRouteShell
    v-if="project"
    :project="project"
    step="report"
    title="报告预览与在线编辑"
    description="先用结构化章节编辑器收敛内容，再决定是否引入真正富文本内核。"
  >
    <div class="sr-editor-layout">
      <a-card class="sr-page__card sr-editor-layout__tree">
        <div class="sr-page__toolbar">
          <h3 class="sr-page__subtitle">章节目录</h3>
          <a-button size="small">折叠</a-button>
        </div>
        <a-tree
          :selected-keys="[selectedSection]"
          :tree-data="treeData"
          @select="handleTreeSelect"
        />
      </a-card>

      <div class="sr-editor-layout__main">
        <a-card class="sr-page__card">
          <div class="sr-page__toolbar">
            <div>
              <h3 class="sr-page__subtitle">{{ activeSection?.title }}</h3>
              <p class="sr-page__desc">右侧问题面板点击后可回到对应段落进行修订。</p>
            </div>
            <a-space wrap>
              <a-button>保存修订</a-button>
              <a-button>版本对比</a-button>
              <a-button>导出 Word</a-button>
              <a-button type="primary" @click="router.push(`/projects/${project.id}/audit`)">
                提交审核
              </a-button>
            </a-space>
          </div>

          <a-tabs v-model:activeKey="editorTab">
            <a-tab-pane key="content" tab="正文编辑">
              <a-form layout="vertical">
                <a-form-item label="段落正文">
                  <a-textarea
                    v-model:value="sectionDraft"
                    :rows="10"
                    placeholder="编辑当前章节的结构化内容"
                  />
                </a-form-item>
                <a-form-item label="结论摘要">
                  <a-textarea :rows="4" placeholder="提炼本章节要点与设计建议" />
                </a-form-item>
              </a-form>
            </a-tab-pane>
            <a-tab-pane key="table" tab="表格修订">
              <a-table
                :columns="tableColumns"
                :data-source="tableRows"
                row-key="key"
                :pagination="false"
              />
            </a-tab-pane>
          </a-tabs>
        </a-card>

        <a-card class="sr-page__card">
          <div class="sr-bubble-stack">
            <Bubble
              content="AI 建议将粉质黏土承载力描述统一到附表口径。"
              placement="start"
              variant="outlined"
            />
            <Bubble
              content="保留原始试验值，正文统一为 160kPa，并补充差异说明。"
              placement="end"
              variant="filled"
            />
          </div>
        </a-card>
      </div>
    </div>

    <template #aside>
      <a-card class="sr-page__card">
        <div class="sr-page__toolbar">
          <h3 class="sr-page__subtitle">合规提示</h3>
          <a-tag color="warning">3 条</a-tag>
        </div>
        <a-list :data-source="issues" size="small">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta :title="item.title" :description="item.description" />
            </a-list-item>
          </template>
        </a-list>
      </a-card>

      <a-card class="sr-page__card">
        <div class="sr-action-card">
          <div>
            <h3 class="sr-page__subtitle">快捷修订</h3>
            <p>建议集先负责定位修订方向，动作区负责把当前章节送到下一步。</p>
          </div>
          <Suggestion :items="suggestionItems" @select="handleSuggestionSelect" block>
            <template #default="slotProps">
              <a-button block @click="triggerSuggestions(slotProps)">打开快捷修订</a-button>
            </template>
          </Suggestion>
          <QuickActionPanel
            title="章节动作"
            description="保存、对比和送审直接明文展示，不再用猜图标。"
            :items="actionItems"
          />
        </div>
      </a-card>
    </template>
  </ProjectRouteShell>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { message } from "ant-design-vue";
import { AuditOutlined, DiffOutlined, SaveOutlined } from "@ant-design/icons-vue";
import { Bubble, Suggestion } from "ant-design-x-vue";
import { useRoute, useRouter } from "vue-router";

import ProjectRouteShell from "@/components/ProjectRouteShell.vue";
import QuickActionPanel, { type QuickActionItem } from "@/components/QuickActionPanel.vue";
import { complianceIssues, findProjectById, reportSections } from "@/mock/data";

const route = useRoute();
const router = useRouter();
const project = computed(() => findProjectById(route.params.id as string | undefined));

const selectedSection = ref("overview");
const editorTab = ref("content");

const activeSection = computed(
  () => reportSections.find((item) => item.key === selectedSection.value) ?? reportSections[0],
);

const sectionDraft = ref(activeSection.value?.content ?? "");

watch(activeSection, (nextSection) => {
  sectionDraft.value = nextSection?.content ?? "";
});

const treeData = reportSections.map((item) => ({
  key: item.key,
  title: item.title,
}));

const tableColumns = [
  { title: "参数", dataIndex: "name", key: "name" },
  { title: "修订值", dataIndex: "value", key: "value" },
  { title: "说明", dataIndex: "note", key: "note" },
];

const tableRows = [
  { key: "1", name: "承载力特征值", value: "160kPa", note: "与附表统一" },
  { key: "2", name: "地下水埋深", value: "3.2m - 5.1m", note: "补充雨季修正" },
];

const issues = complianceIssues;
const suggestionItems = [
  { label: "统一承载力表述", value: "统一承载力表述" },
  { label: "补充雨季工况", value: "补充雨季工况" },
  { label: "插入方案对比段", value: "插入方案对比段" },
];

const actionItems: QuickActionItem[] = [
  {
    key: "save",
    label: "保存当前章节",
    description: "先把正文和摘要固化到当前草稿版本。",
    icon: SaveOutlined,
    tone: "primary",
  },
  {
    key: "compare",
    label: "打开版本对比",
    description: "快速看这一版相对上一个已保存版本改了什么。",
    icon: DiffOutlined,
  },
  {
    key: "submit",
    label: "提交审核",
    description: "当前章节检查完成后，直接送到审核流。",
    icon: AuditOutlined,
  },
];

function handleTreeSelect(keys: string[]) {
  selectedSection.value = keys[0] ?? "overview";
}

function handleSuggestionSelect(value: string) {
  message.success(`已触发快捷修订：${value}`);
}

function triggerSuggestions(slotProps?: { onTrigger?: () => void }) {
  slotProps?.onTrigger?.();
}
</script>
