<template>
  <a-tag :color="color">{{ status }}</a-tag>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  status: "未生成" | "生成中" | "已生成" | "待审核" | "已归档";
}>();

const color = computed(() => {
  switch (props.status) {
    case "未生成":
      return "default";
    case "生成中":
      return "processing";
    case "已生成":
      return "success";
    case "待审核":
      return "warning";
    case "已归档":
      return "purple";
    default:
      return "default";
  }
});
</script>
