<template>
  <div class="modal is-active modal-full-screen modal-fx-fadeInScale">
    <div class="modal-content modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Resultados dos testes</p>
        <button class="modal-button-close delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <div class="timeline">
          <header class="timeline-header">
            <span class="tag is-medium is-primary">Início</span>
          </header>
          <div v-for="(result, index) in store.navigationResult" :key="index">
            <div class="timeline-item">
              <div class="timeline-marker is-primary is-icon">
                <FontAwesomeIcon :icon="getIcon(result.action)" />
              </div>
              <div class="timeline-content">
                <p class="heading">{{ result.title }}</p>
                <p>{{ result.message }}</p>
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
            <span class="tag is-medium is-primary">Fim</span>
          </header>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="modal-button-close button" @click="closeModal">Fechar</button>
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
} from '@fortawesome/free-solid-svg-icons';
import { navigationResultStore as useNavigationResultStore } from '@/store/navigationResultStore';
import { computed, onMounted, ref } from 'vue';
import { ActionType } from '@/electron/types/ActionType';
import ModalImageComponent from '@/components/ModalImageComponent.vue';

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
    case 'end':
      return faHourglassEnd;
    default:
      return faRoute;
  }
}
</script>

<style scoped></style>