<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <RouterView />
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f3f6fb;
  color: #0f172a;
  font-family: Arial, sans-serif;
}

button,
input,
select,
textarea {
  font: inherit;
}
</style>