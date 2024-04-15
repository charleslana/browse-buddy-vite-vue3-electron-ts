<template>
  <div class="notification is-success is-light" :class="type">
    <button class="delete" @click="closeNotification"></button>
    <div class="buttons">
      <p>{{ message }}</p>
      <button class="button is-dark is-small" @click="openModalResult">Ver resultados</button>
    </div>
  </div>
  <ModalResultTestComponent v-if="isCloseModalResult" @close="closeModalResult" />
</template>

<script setup lang="ts">
import ModalResultTestComponent from '@/components/ModalResultTestComponent.vue';
import { ref } from 'vue';

defineProps({
  type: {
    type: String,
    required: true,
    validator: (value: string) => {
      return ['is-danger', 'is-success'].includes(value);
    },
  },
  message: {
    type: String,
    required: true,
  },
});

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
