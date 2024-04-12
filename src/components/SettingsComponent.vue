<template>
  <div class="column mx-5">
    <div class="is-size-4 has-text-weight-bold mb-5">{{ $t('runSettings') }}</div>
    <label class="checkbox mb-4">
      <input type="checkbox" v-model="saveLastScreenshot" @change="updateSaveLastScreenshot" />
      {{ $t('saveScreenshotEndOfTest') }}
    </label>
    <label class="checkbox mb-4">
      <input type="checkbox" v-model="saveEveryScreenshot" @change="updateSaveEveryScreenshot" />
      {{ $t('saveScreenshotForEachAction') }}
    </label>
    <label class="checkbox mb-4">
      <input type="checkbox" v-model="saveHeadless" @change="updateSaveHeadless" />
      {{ $t('headlessMode') }}
    </label>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { runTestStore as useRunTestStore } from '@/store/runTestStore';

const store = useRunTestStore();
const saveLastScreenshot = ref(store.runTest.isSaveLastScreenshot);
const saveEveryScreenshot = ref(store.runTest.isSaveEveryScreenshot);
const saveHeadless = ref(store.runTest.isHeadless);

watch(
  [
    () => store.runTest.isSaveLastScreenshot,
    () => store.runTest.isSaveEveryScreenshot,
    () => store.runTest.isHeadless,
  ],
  ([saveLastScreenshotValue, saveEveryScreenshotValue, saveHeadlessValue]) => {
    saveLastScreenshot.value = saveLastScreenshotValue;
    saveEveryScreenshot.value = saveEveryScreenshotValue;
    saveHeadless.value = saveHeadlessValue;
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
