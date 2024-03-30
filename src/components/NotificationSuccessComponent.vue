<template>
  <div class="notification is-success is-light">
    <button class="delete" @click="closeNotification"></button>
    <div class="buttons">
      <p>O teste foi executado com sucesso.</p>
      <button class="button is-primary is-dark is-small" @click="openModalResult">
        Ver resultados
      </button>
    </div>
  </div>
  <ModalResultTestComponent v-if="isCloseModalResult" @close="closeModalResult" />
</template>

<script setup lang="ts">
import ModalResultTestComponent from '@/components/ModalResultTestComponent.vue';
import { ref } from 'vue';

const emit = defineEmits(['close']);
const isCloseModalResult = ref(false);

function closeNotification(): void {
  emit('close');
}

function openModalResult(): void {
  isCloseModalResult.value = true;
}

function closeModalResult(): void {
  isCloseModalResult.value = false;
  window.scrollTo(0, 0);
}
</script>

<style scoped></style>
