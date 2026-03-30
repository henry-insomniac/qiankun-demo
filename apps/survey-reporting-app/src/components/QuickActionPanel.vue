<template>
  <div class="sr-quick-actions">
    <div class="sr-action-card">
      <div>
        <h3 class="sr-page__subtitle">{{ title }}</h3>
        <p>{{ description }}</p>
      </div>
    </div>

    <a-space direction="vertical" class="sr-quick-actions__list" :size="12">
      <a-button
        v-for="item in items"
        :key="item.key"
        block
        :type="item.tone === 'primary' ? 'primary' : 'default'"
        :danger="item.tone === 'danger'"
        class="sr-quick-actions__button"
      >
        <component :is="item.icon" />
        <span class="sr-quick-actions__copy">
          <strong>{{ item.label }}</strong>
          <small v-if="item.description">{{ item.description }}</small>
        </span>
      </a-button>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import type { Component } from "vue";

export interface QuickActionItem {
  key: string;
  label: string;
  description?: string;
  icon: Component;
  tone?: "default" | "primary" | "danger";
}

defineProps<{
  title: string;
  description: string;
  items: QuickActionItem[];
}>();
</script>
