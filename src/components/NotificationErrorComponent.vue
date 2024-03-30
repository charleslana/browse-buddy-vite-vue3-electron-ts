<template>
  <div class="notification is-danger is-light">
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

const emit = defineEmits(['close']);

function closeNotification(): void {
  emit('close');
}
</script>

<style scoped></style>
