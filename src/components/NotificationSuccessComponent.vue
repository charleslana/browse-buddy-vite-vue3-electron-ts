<template>
  <div class="notification is-success is-light">
    <button class="delete" @click="closeNotification"></button>
    <div class="buttons">
      <p>O teste foi executado com sucesso.</p>
      <button class="button is-primary is-dark is-small">Ver resultados</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['close']);

function closeNotification(): void {
  emit('close');
}
</script>

<style scoped></style>
