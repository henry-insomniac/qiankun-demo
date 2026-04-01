<template>
  <section class="sr-page sr-wizard">
    <a-card class="sr-page__card sr-wizard__header" :bordered="false">
      <div class="sr-wizard__top">
        <div>
          <span class="sr-section-eyebrow">新建项目</span>
          <h2 class="sr-page__title">{{ currentStepConfig.title }}</h2>
        </div>
        <a-space wrap>
          <a-button @click="router.push('/projects')">返回列表</a-button>
          <a-button v-if="currentIndex > 0" @click="goPrev">上一步</a-button>
          <a-button v-if="currentIndex < WIZARD_STEPS.length - 1" type="primary" @click="goNext">
            下一步
          </a-button>
          <a-button v-if="currentIndex === WIZARD_STEPS.length - 1" type="primary" @click="handleFinish">
            完成创建
          </a-button>
        </a-space>
      </div>
      <a-steps :current="currentIndex" size="small" class="sr-wizard__steps">
        <a-step v-for="step in WIZARD_STEPS" :key="step.key" :title="step.title" />
      </a-steps>
    </a-card>

    <router-view v-slot="{ Component }">
      <transition name="sr-fade-slide" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";

import { WIZARD_STEPS, getStepIndex } from "@/lib/project-create-draft";

const route = useRoute();
const router = useRouter();

const currentIndex = computed(() => getStepIndex(route.path));
const currentStepConfig = computed(() => WIZARD_STEPS[currentIndex.value] ?? WIZARD_STEPS[0]);

function goNext() {
  const next = WIZARD_STEPS[currentIndex.value + 1];
  if (next) {
    router.push(next.path);
  }
}

function goPrev() {
  const prev = WIZARD_STEPS[currentIndex.value - 1];
  if (prev) {
    router.push(prev.path);
  }
}

function handleFinish() {
  message.success("项目创建完成");
  router.push("/projects");
}
</script>
