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
    <div class="field" v-tooltip="$t('defaultTimeTooltip')">
      <div class="control has-floating-label">
        <input
          class="input is-medium with-floating-label"
          :class="{ 'is-skeleton': isSkeleton }"
          id="default-timeout"
          placeholder=""
          type="number"
          v-model="saveDefaultTimeout"
          @change="updateSaveDefaultTimeout"
        />
        <label class="label is-floating-label" for="default-timeout">{{ $t('defaultTime') }}</label>
      </div>
    </div>
    <div class="field" v-tooltip="$t('repeatTooltip')">
      <div class="control has-floating-label">
        <input
          class="input is-medium with-floating-label"
          :class="{ 'is-skeleton': isSkeleton }"
          id="repeat-count"
          placeholder=""
          type="number"
          v-model="repeatedTimes"
          @change="updateRepeatedTimes"
        />
        <label class="label is-floating-label" for="repeat-count">{{ $t('repeatInput') }}</label>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { runTestStore as useRunTestStore } from '@/store/runTestStore';

defineProps({
  isSkeleton: {
    type: Boolean,
    required: true,
  },
});

onMounted(() => {
  store.setRepeat(1);
});

const store = useRunTestStore();
const saveLastScreenshot = ref(store.runTest.isSaveLastScreenshot);
const saveEveryScreenshot = ref(store.runTest.isSaveEveryScreenshot);
const saveHeadless = ref(store.runTest.isHeadless);
const saveDefaultTimeout = ref(store.runTest.defaultTimeout);
const repeatedTimes = ref(1);

watch(
  [
    () => store.runTest.isSaveLastScreenshot,
    () => store.runTest.isSaveEveryScreenshot,
    () => store.runTest.isHeadless,
    () => store.runTest.defaultTimeout,
  ],
  ([
    saveLastScreenshotValue,
    saveEveryScreenshotValue,
    saveHeadlessValue,
    saveDefaultTimeoutValue,
  ]) => {
    saveLastScreenshot.value = saveLastScreenshotValue;
    saveEveryScreenshot.value = saveEveryScreenshotValue;
    saveHeadless.value = saveHeadlessValue;
    saveDefaultTimeout.value = saveDefaultTimeoutValue;
  }
);

watch(saveDefaultTimeout, newValue => {
  if (newValue < 1) {
    saveDefaultTimeout.value = 1;
    updateSaveDefaultTimeout();
  } else if (newValue > 300000) {
    saveDefaultTimeout.value = 300000;
    updateSaveDefaultTimeout();
  }
});

watch(repeatedTimes, newValue => {
  if (newValue < 1) {
    repeatedTimes.value = 1;
    updateRepeatedTimes();
  } else if (newValue > 100) {
    repeatedTimes.value = 100;
    updateRepeatedTimes();
  }
});

function updateSaveLastScreenshot(): void {
  store.setIsSaveLastScreenshot(saveLastScreenshot.value);
}

function updateSaveEveryScreenshot(): void {
  store.setIsSaveEveryScreenshot(saveEveryScreenshot.value);
}

function updateSaveHeadless(): void {
  store.setIsSaveHeadless(saveHeadless.value);
}

function updateSaveDefaultTimeout(): void {
  store.setDefaultTimeout(saveDefaultTimeout.value);
}

function updateRepeatedTimes(): void {
  store.setRepeat(repeatedTimes.value);
}
</script>

<style scoped></style>
