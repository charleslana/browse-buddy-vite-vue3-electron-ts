<template>
  <div class="box">
    <div class="is-size-4 has-text-weight-bold mb-2">
      <span class="mr-2"><FontAwesomeIcon :icon="faComputerMouse" /></span>
      <span>Ações</span>
    </div>
    <button class="button is-info" :disabled="disabled">
      <span class="icon">
        <FontAwesomeIcon :icon="faPlus" />
      </span>
      <span>Selecione ação</span>
    </button>
    <div class="py-4"></div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faComputerMouse, faPlus } from '@fortawesome/free-solid-svg-icons';

defineProps({
  disabled: {
    type: Boolean,
    required: true,
  },
});
</script>

<style scoped></style>
