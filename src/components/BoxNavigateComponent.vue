<template>
  <div class="box">
    <div class="is-size-4 has-text-weight-bold mb-2">
      <span class="mr-2"><FontAwesomeIcon :icon="faRoute" /></span>
      <span>Navegar para</span>
    </div>
    <div class="is-flex is-align-items-center is-justify-content-space-between is-flex-wrap-wrap">
      <button class="button is-info mb-4" @click="openModal">Selecione a url</button>
      <div class="break-words">{{ inputUrl || 'vazio' }}</div>
    </div>
  </div>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Digite a url desejada</p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <div class="notification is-danger is-light" v-if="!isValidUrl(inputUrl)">
          Informe uma url válida.
        </div>
        <input
          v-model.trim="inputUrl"
          class="input is-medium"
          type="text"
          placeholder="https://example.com"
        />
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-success" :disabled="!isValidUrl(inputUrl)" @click="saveURL">
            Salvar
          </button>
          <button class="button" @click="closeModal">Cancelar</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faRoute } from '@fortawesome/free-solid-svg-icons';
import { ref, watch } from 'vue';
import { runTestStore as useRunTestStore } from '@/store/runTestStore';

const emit = defineEmits(['input-filled']);

const isActive = ref(false);
const inputUrl = ref('');
const store = useRunTestStore();

watch(
  () => store.runTest.url,
  newValue => {
    if (newValue && newValue !== '') {
      inputUrl.value = newValue;
      emit('input-filled', true);
      return;
    }
    inputUrl.value = '';
    emit('input-filled', false);
  }
);

function openModal(): void {
  isActive.value = true;
}

function saveURL(): void {
  isActive.value = false;
  checkInput();
  store.saveUrl(inputUrl.value);
}

function closeModal(): void {
  if (!isValidUrl(inputUrl.value)) {
    inputUrl.value = '';
    store.saveUrl('');
  }
  checkInput();
  isActive.value = false;
}

function isValidUrl(url: string): boolean {
  const pattern = new RegExp('^(https?://)?([\\w-]+\\.)+[\\w-]+(/[\\w- ./?%&=]*)?$');
  return pattern.test(url);
}

function checkInput(): void {
  if (inputUrl.value.trim() !== '') {
    emit('input-filled', true);
    return;
  }
  emit('input-filled', false);
}
</script>

<style scoped></style>
