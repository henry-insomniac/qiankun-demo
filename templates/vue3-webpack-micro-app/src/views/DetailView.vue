<template>
  <section class="micro-page-card micro-page-card--compact">
    <span class="micro-badge">Detail</span>
    <h2>详情页</h2>
    <p>当前记录 ID：{{ id }}</p>
    <RouterLink
      class="micro-link"
      to="/"
    >
      返回首页
    </RouterLink>
  </section>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: "",
  },
});
</script>
