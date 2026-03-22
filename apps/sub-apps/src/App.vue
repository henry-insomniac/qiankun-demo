<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/theme1">主题1</RouterLink>
    <RouterLink to="/theme2">主题2</RouterLink>
    <RouterLink to="/theme3">主题3</RouterLink>
  </nav>
  <RouterView />
</template>

<style scoped>
nav {
  display: flex;
  gap: 20px;
  padding: 20px;
}

a {
  text-decoration: none;
  color: #333;
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

a:hover {
  background-color: #f0f0f0;
}

a.router-link-active {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}
</style>
