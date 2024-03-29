<template>
  <div class="notification is-success is-light" :class="{ 'is-hidden': isHidden }">
    <button class="delete" @click="closeNotification"></button>
    <div class="buttons">
      <p>O teste foi executado com sucesso.</p>
      <button class="button is-primary is-dark is-small">Ver resultados</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isHidden = ref(true);

function closeNotification(): void {
  isHidden.value = true;
}
</script>

<style scoped></style>
