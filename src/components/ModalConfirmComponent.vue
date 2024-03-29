<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <section class="modal-card-body">Você tem certeza que deseja continuar?</section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-success" @click="confirmModal">Confirmar</button>
          <button class="button" @click="closeModal">Cancelar</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['confirm-modal', 'close-modal']);

function confirmModal(): void {
  emit('confirm-modal');
}

function closeModal(): void {
  emit('close-modal');
}
</script>

<style scoped></style>
