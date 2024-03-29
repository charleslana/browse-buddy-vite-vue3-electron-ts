<template>
  <div class="notification is-danger is-light" :class="{ 'is-hidden': isHidden }">
    <button class="delete" @click="closeNotification"></button>
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  message: {
    type: String,
    required: true,
  },
});

import { ref } from 'vue';

const isHidden = ref(true);

function closeNotification(): void {
  isHidden.value = true;
}
</script>

<style scoped></style>
