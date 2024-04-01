<template>
  <div class="column mx-5">
    <div class="is-size-4 has-text-weight-bold mb-5">Configurações de execução</div>
    <label class="checkbox mb-4">
      <input type="checkbox" v-model="saveLastScreenshot" @change="updateSaveLastScreenshot" />
      Salvar tela de captura no final do teste
    </label>
    <label class="checkbox mb-4">
      <input type="checkbox" v-model="saveEveryScreenshot" @change="updateSaveEveryScreenshot" />
      Salvar tela de captura a cada ação
    </label>
    <label class="checkbox mb-4">
      <input type="checkbox" v-model="saveHeadless" @change="updateSaveHeadless" />
      Modo sem cabeça (Ativado não irá mostrar o processo do teste em tempo real)
    </label>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { runTestStore as useRunTestStore } from '@/store/runTestStore';

const saveLastScreenshot = ref(true);
const saveEveryScreenshot = ref(true);
const saveHeadless = ref(true);
const store = useRunTestStore();

watch(saveLastScreenshot, newValue => {
  store.setIsSaveLastScreenshot(newValue);
});

watch(saveEveryScreenshot, newValue => {
  store.setIsSaveEveryScreenshot(newValue);
});

watch(saveHeadless, newValue => {
  console.log('watch normal');
  store.setIsSaveHeadless(newValue);
});

watch(
  [
    () => store.runTest.isSaveLastScreenshot,
    () => store.runTest.isSaveEveryScreenshot,
    () => store.runTest.isHeadless,
  ],
  ([saveLastScreenshotValue, saveEveryScreenshotValue, headlessValue]) => {
    console.log('watch store');
    saveLastScreenshot.value = saveLastScreenshotValue;
    saveEveryScreenshot.value = saveEveryScreenshotValue;
    saveHeadless.value = headlessValue;
  }
);

function updateSaveLastScreenshot(): void {
  store.setIsSaveLastScreenshot(saveLastScreenshot.value);
}

function updateSaveEveryScreenshot(): void {
  store.setIsSaveEveryScreenshot(saveEveryScreenshot.value);
}

function updateSaveHeadless(): void {
  store.setIsSaveHeadless(saveHeadless.value);
}
</script>

<style scoped></style>
