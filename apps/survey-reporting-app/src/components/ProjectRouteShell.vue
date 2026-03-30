<template>
  <section class="sr-project-shell">
    <a-card class="sr-project-shell__hero" :bordered="false">
      <div class="sr-project-shell__hero-head">
        <div>
          <a-space wrap class="sr-project-shell__meta">
            <a-tag color="geekblue">{{ project.engineeringType }}</a-tag>
            <a-tag>{{ project.stage }}</a-tag>
            <ProjectStatusTag :status="project.status" />
          </a-space>
          <h2 class="sr-project-shell__title">{{ title }}</h2>
          <p class="sr-project-shell__summary">{{ description }}</p>
        </div>
        <div class="sr-project-shell__hero-side">
          <div class="sr-kpi">
            <span>项目负责人</span>
            <strong>{{ project.owner }}</strong>
          </div>
          <div class="sr-kpi">
            <span>项目地点</span>
            <strong>{{ project.location }}</strong>
          </div>
        </div>
      </div>

      <div class="sr-project-shell__flow">
        <div class="sr-project-shell__flow-head">
          <div>
            <span class="sr-section-eyebrow">流程导航</span>
            <h3 class="sr-project-shell__flow-title">
              第 {{ currentIndex + 1 }} 步 · {{ currentStep.title }}
            </h3>
            <p class="sr-project-shell__flow-summary">{{ currentStep.summary }}</p>
          </div>
          <a-space wrap>
            <a-tag color="processing">当前环节</a-tag>
            <a-button v-if="previousStepHref" @click="router.push(previousStepHref)">
              返回上一步
            </a-button>
            <a-button
              v-if="nextStepHref"
              type="primary"
              @click="router.push(nextStepHref)"
            >
              查看下一步
            </a-button>
          </a-space>
        </div>

        <div class="sr-project-shell__flow-grid">
          <a-button
            v-for="(item, index) in flowLinks"
            :key="item.key"
            class="sr-project-shell__flow-card"
            :class="{
              'is-current': item.key === step,
              'is-finished': index < currentIndex,
            }"
            block
            @click="router.push(item.href)"
          >
            <span class="sr-project-shell__flow-card-index">
              {{ item.index }}
            </span>
            <span class="sr-project-shell__flow-card-copy">
              <strong>{{ item.title }}</strong>
              <small>{{ item.summary }}</small>
            </span>
            <a-tag :color="flowStatusColor(index)">
              {{ flowStatusLabel(index) }}
            </a-tag>
          </a-button>
        </div>
      </div>
    </a-card>

    <div class="sr-project-shell__grid">
      <div class="sr-project-shell__main">
        <slot />
      </div>
      <div class="sr-project-shell__aside">
        <slot name="aside" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";

import type { ProjectRecord } from "@/mock/data";
import {
  PROJECT_FLOW_STEPS,
  buildProjectRoute,
  nextProjectFlowStep,
  previousProjectFlowStep,
  type ProjectFlowKey,
} from "@/lib/workflow";
import ProjectStatusTag from "./ProjectStatusTag.vue";

const props = defineProps<{
  project: ProjectRecord;
  step: ProjectFlowKey;
  title: string;
  description: string;
}>();

const router = useRouter();

const currentIndex = computed(() =>
  PROJECT_FLOW_STEPS.findIndex((item) => item.key === props.step),
);

const currentStep = computed(
  () =>
    PROJECT_FLOW_STEPS.find((item) => item.key === props.step) ??
    PROJECT_FLOW_STEPS[0],
);

const previousStepHref = computed(() => {
  const previous = previousProjectFlowStep(props.step);
  return previous ? buildProjectRoute(props.project.id, previous) : null;
});

const nextStepHref = computed(() => {
  const next = nextProjectFlowStep(props.step);
  return next ? buildProjectRoute(props.project.id, next) : null;
});

const flowLinks = computed(() =>
  PROJECT_FLOW_STEPS.map((item, index) => ({
    ...item,
    index: index + 1,
    href: buildProjectRoute(props.project.id, item.key),
  })),
);

function flowStatusLabel(index: number): string {
  if (index < currentIndex.value) {
    return "已完成";
  }

  if (index === currentIndex.value) {
    return "当前";
  }

  return "待处理";
}

function flowStatusColor(index: number): string {
  if (index < currentIndex.value) {
    return "success";
  }

  if (index === currentIndex.value) {
    return "processing";
  }

  return "default";
}
</script>
