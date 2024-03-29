<template>
  <div>{{ pageName }}</div>
  <RouterLink to="/path">{{ pageName }}</RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

defineProps({
  pageName: {
    type: String,
    required: true,
  },
});
</script>

<style scoped></style>
