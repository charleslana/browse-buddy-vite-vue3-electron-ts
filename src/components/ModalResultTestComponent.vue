<template>
  <div class="modal is-active modal-full-screen modal-fx-fadeInScale">
    <div class="modal-content modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ $t('resultTestTitle') }}</p>
        <div class="is-flex is-align-items-center">
          <button class="button is-dark mr-5" @click="exportReport">
            {{ $t('exportReportButton') }}
          </button>
          <button class="modal-button-close delete" aria-label="close" @click="closeModal"></button>
        </div>
      </header>
      <section class="modal-card-body">
        <div class="timeline">
          <header class="timeline-header">
            <span class="tag is-medium is-link is-light">{{ $t('startReportResult') }}</span>
          </header>
          <div v-for="(result, index) in store.navigationResult" :key="index">
            <div class="timeline-item">
              <div class="timeline-marker is-link is-icon">
                <FontAwesomeIcon :icon="getIcon(result.action)" />
              </div>
              <div class="timeline-content">
                <p
                  class="heading"
                  :class="{
                    'has-text-danger': result.error,
                    'has-text-success': !result.error,
                  }"
                >
                  {{ result.title }}
                  <span
                    ><FontAwesomeIcon
                      :icon="faXmark"
                      class="has-text-danger ml-2"
                      v-if="result.error"
                    />
                    <FontAwesomeIcon :icon="faCheck" class="has-text-success ml-2" v-else />
                  </span>
                </p>
                <p
                  v-html="
                    formatBreakLines(
                      result.error ? `${result.message}\n${result.error}` : result.message
                    )
                  "
                  :class="{
                    'has-text-danger': result.error,
                    'has-text-success': !result.error,
                  }"
                ></p>
              </div>
              <div class="timeline-content" v-if="result.screenshot">
                <figure class="image is-128x128">
                  <img
                    :src="`data:image/png;base64,${result.screenshot}`"
                    alt="Screenshot"
                    class="is-clickable"
                    @click="changeScreenshot(result.screenshot)"
                  />
                </figure>
              </div>
            </div>
            <header class="timeline-header" v-if="result.duration">
              <span class="tag is-info">{{ result.duration }}s</span>
            </header>
          </div>
          <header class="timeline-header">
            <span class="tag is-warning">{{ totalDuration.toFixed(2) }}s</span>
          </header>
          <header class="timeline-header">
            <span class="tag is-medium is-link is-light">{{ $t('endReportResult') }}</span>
          </header>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="modal-button-close button" @click="closeModal">
          {{ $t('closeButton') }}
        </button>
      </footer>
    </div>
  </div>
  <ModalImageComponent :screenshot="screenshot" v-if="isCloseModalImage" @close="closeModalImage" />
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faRoute,
  faComputerMouse,
  faHourglassEnd,
  IconDefinition,
  faCheck,
  faXmark,
  faFill,
  faKeyboard,
  faEraser,
  faEye,
  faEyeSlash,
  faReply,
} from '@fortawesome/free-solid-svg-icons';
import { navigationResultStore as useNavigationResultStore } from '@/store/navigationResultStore';
import { computed, onMounted, ref } from 'vue';
import { ActionType } from '@/electron/types/ActionType';
import ModalImageComponent from '@/components/ModalImageComponent.vue';
import { formatBreakLines } from '@/utils/utils';

onMounted(() => {
  window.scrollTo(0, 0);
});

const emit = defineEmits(['close']);
const store = useNavigationResultStore();
const isCloseModalImage = ref(false);
const screenshot = ref('');

const totalDuration = computed(() => {
  return store.navigationResult.reduce((total, result) => total + (result.duration || 0), 0);
});

function closeModal(): void {
  emit('close');
}

function closeModalImage(): void {
  isCloseModalImage.value = false;
}

function changeScreenshot(newScreenshot: string): void {
  screenshot.value = newScreenshot;
  isCloseModalImage.value = true;
}

function getIcon(action: ActionType): IconDefinition {
  switch (action) {
    case 'navigate':
      return faRoute;
    case 'wait-click':
      return faComputerMouse;
    case 'click':
      return faComputerMouse;
    case 'fill':
      return faFill;
    case 'type':
      return faKeyboard;
    case 'clear':
      return faEraser;
    case 'wait-visible':
      return faEye;
    case 'wait-hidden':
      return faEyeSlash;
    case 'click-wait-response':
      return faReply;
    case 'end':
      return faHourglassEnd;
    default:
      return faRoute;
  }
}

async function exportReport(): Promise<void> {
  await window.electronAPI?.saveReport(JSON.stringify(store.navigationResult));
}
</script>

<style scoped></style>
