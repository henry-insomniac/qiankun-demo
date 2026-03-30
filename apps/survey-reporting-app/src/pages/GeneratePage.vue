<template>
  <ProjectRouteShell
    v-if="project"
    :project="project"
    step="generate"
    title="AI 生成任务控制"
    description="把数据融合、模板映射、章节生成、合规校验和文档合成放进同一条任务链。"
  >
    <div class="sr-page__stack">
      <a-card class="sr-page__card">
        <Welcome
          title="生成总控台"
          description="当前已加载模板与数据快照，可以发起多智能体生成任务。"
          variant="filled"
        />
        <div class="sr-generate-hero">
          <a-progress type="circle" :percent="progress" :stroke-color="'#9c5d34'" />
          <div class="sr-generate-hero__copy">
            <h3>任务进度 {{ progress }}%</h3>
            <p>当前阶段：{{ stageLabel }}</p>
            <a-space wrap>
              <a-button type="primary" @click="progress = 100">开始 AI 生成</a-button>
              <a-button @click="progress = 68">重试中断任务</a-button>
            </a-space>
          </div>
        </div>
        <a-steps :current="currentStep" size="small">
          <a-step title="数据融合与校验" />
          <a-step title="模板章节映射" />
          <a-step title="多智能体协同生成" />
          <a-step title="合规校验与输出" />
        </a-steps>
      </a-card>

      <a-card class="sr-page__card" title="智能体执行状态">
        <ThoughtChain :items="thoughtItems" collapsible />
      </a-card>

      <a-card class="sr-page__card" title="AI 对话与修正指令">
        <div class="sr-bubble-stack">
          <Bubble
            v-for="messageItem in bubbles"
            :key="messageItem.key"
            :content="messageItem.content"
            :placement="messageItem.placement"
            :variant="messageItem.variant"
          />
        </div>

        <Prompts
          :items="promptItems"
          wrap
          title="快速指令"
          @item-click="handlePromptClick"
        />

        <Attachments
          :items="attachmentItems"
          :placeholder="attachmentPlaceholder"
          overflow="wrap"
          class="sr-block-space"
        />

        <Sender
          v-model:value="command"
          placeholder="输入生成约束，例如：地下水章节增加雨季不利工况说明"
          :auto-size="{ minRows: 1, maxRows: 4 }"
          @submit="handleSubmit"
        />
      </a-card>
    </div>

    <template #aside>
      <a-card class="sr-page__card">
        <QuickActionPanel
          title="任务动作"
          description="把最常用的生成控制动作固定在右侧，不需要猜图标含义。"
          :items="actionItems"
        />
      </a-card>

      <a-card class="sr-page__card">
        <a-result
          status="info"
          title="校验概览"
          sub-title="2 条预警，1 条错误，完成后可进入结构化编辑。"
        >
          <template #extra>
            <a-button @click="router.push(`/projects/${project.id}/report`)">进入编辑</a-button>
            <a-button type="primary" @click="router.push(`/projects/${project.id}/compliance`)">
              查看校验
            </a-button>
          </template>
        </a-result>
      </a-card>
    </template>
  </ProjectRouteShell>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { message } from "ant-design-vue";
import {
  FastForwardOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons-vue";
import {
  Attachments,
  Bubble,
  Prompts,
  Sender,
  ThoughtChain,
  Welcome,
} from "ant-design-x-vue";
import { useRoute, useRouter } from "vue-router";

import ProjectRouteShell from "@/components/ProjectRouteShell.vue";
import QuickActionPanel, { type QuickActionItem } from "@/components/QuickActionPanel.vue";
import { findProjectById } from "@/mock/data";

const route = useRoute();
const router = useRouter();
const project = computed(() => findProjectById(route.params.id as string | undefined));

const progress = ref(76);
const command = ref("");

const currentStep = computed(() => {
  if (progress.value < 20) return 0;
  if (progress.value < 40) return 1;
  if (progress.value < 90) return 2;
  return 3;
});

const stageLabel = computed(() => {
  if (progress.value < 20) return "数据融合与校验";
  if (progress.value < 40) return "模板解构与章节映射";
  if (progress.value < 70) return "多智能体协同生成";
  if (progress.value < 90) return "合规性自动校验";
  return "Word 文档合成";
});

const thoughtItems = [
  {
    key: "outline",
    title: "大纲架构师",
    description: "已根据模板结构生成章节骨架。",
    status: "success" as const,
    content: "完成 16 个章节映射，并为高风险章节插入补充说明位。",
  },
  {
    key: "transform",
    title: "数据转化师",
    description: "已完成多源数据归并。",
    status: "success" as const,
    content: "识别到 2 项异常值，已转交校验师复核。",
  },
  {
    key: "narrative",
    title: "地质叙述师",
    description: "正在生成地层与地下水章节。",
    status: "pending" as const,
    content: "当前聚焦分区地层横向变化和雨季不利工况说明。",
  },
  {
    key: "compliance",
    title: "合规校验师",
    description: "等待正文生成后执行。",
    status: "pending" as const,
    content: "将检查参数一致性、章节覆盖和规范措辞。",
  },
];

const bubbles = ref([
  {
    key: "1",
    placement: "start" as const,
    content: "系统已锁定模板《市政道路西南地区标准模板》。",
    variant: "outlined" as const,
  },
  {
    key: "2",
    placement: "end" as const,
    content: "请在地下水章节补充雨季不利工况，并保留原始采样埋深。",
    variant: "filled" as const,
  },
]);

const promptItems = [
  { key: "1", label: "强调地下水不利工况", description: "补充雨季工况与周边排水影响。" },
  { key: "2", label: "增加基础方案对比", description: "比较桩基础与复合地基的适配性。" },
  { key: "3", label: "先生成目录与摘要", description: "跳过正文细节，先产出总览版本。" },
];

const attachmentItems = [
  { uid: "att-1", name: "模板映射快照.json", status: "done" },
  { uid: "att-2", name: "异常数据清单.xlsx", status: "done" },
];

const attachmentPlaceholder = {
  title: "生成上下文附件",
  description: "当前附带模板快照、异常清单和章节映射中间结果。",
};

const actionItems: QuickActionItem[] = [
  {
    key: "retry",
    label: "重试失败任务",
    description: "从最近一次失败节点继续，不重跑整条链路。",
    icon: ReloadOutlined,
    tone: "primary",
  },
  {
    key: "force",
    label: "强制继续生成",
    description: "忽略当前阻断警告，保留审计痕迹继续向后执行。",
    icon: FastForwardOutlined,
  },
  {
    key: "pause",
    label: "暂停并保存快照",
    description: "把中间态保存下来，稍后再回到当前进度。",
    icon: PauseCircleOutlined,
  },
];

function handlePromptClick(info: { data: { label?: string | unknown } }) {
  command.value = typeof info.data.label === "string" ? info.data.label : "";
}

function handleSubmit(value: string) {
  if (!value.trim()) {
    return;
  }

  bubbles.value.push({
    key: `${Date.now()}`,
    placement: "end",
    content: value,
    variant: "filled",
  });
  bubbles.value.push({
    key: `${Date.now()}-reply`,
    placement: "start",
    content: "指令已加入当前任务上下文，后续生成将优先考虑该约束。",
    variant: "outlined",
  });
  command.value = "";
  message.success("生成指令已提交");
}
</script>
