<template>
  <NavBarComponent />
  <div class="container">
    <div class="columns">
      <div class="column is-two-thirds mx-5">
        <div class="box">
          <div class="level">
            <div class="level-left">
              <button class="button is-responsive" @click="openFile">
                {{ $t('importTest') }}
              </button>
            </div>
            <div class="level-right">
              <button class="button is-ghost" @click="isConfirmModalActive = true">
                {{ $t('clearTests') }}
              </button>
            </div>
          </div>
        </div>
        <NotificationComponent
          :type="isNotificationType"
          :message="isNotificationMessage"
          @close="handleNotification"
          v-if="isNotification"
        />
        <div class="box">
          <div class="field">
            <div class="control has-floating-label">
              <input
                class="input is-medium with-floating-label"
                :class="{ 'is-skeleton': isSkeleton }"
                id="name"
                placeholder=""
                type="text"
                v-model.trim="name"
              />
              <label class="label is-floating-label" for="name">{{ $t('testName') }}</label>
            </div>
          </div>
        </div>
        <BoxNavigateComponent :is-skeleton="isSkeleton" @input-filled="handleInputFilled" />
        <BoxActionsComponent :disabled="!isInputFilled" :is-skeleton="isSkeleton" />
        <nav class="level mb-5">
          <div class="level-left">
            <p class="level-item">
              <button
                class="button is-link"
                :disabled="!isInputFilled || name === ''"
                @click="executeRunTest"
              >
                {{ $t('executeButton') }}
              </button>
            </p>
          </div>
          <div class="level-right">
            <p class="level-item">
              <button
                class="button is-success"
                :disabled="!isInputFilled || name === ''"
                @click="saveFile"
              >
                {{ $t('saveTestButton') }}
              </button>
            </p>
          </div>
        </nav>
      </div>
      <SettingsComponent :is-skeleton="isSkeleton" />
      <ModalConfirmComponent
        v-if="isConfirmModalActive"
        @confirm-modal="confirmAction"
        @close-modal="closeConfirmModal"
      />
      <div class="floating-buttons buttons">
        <button @click="goToTop" class="button is-medium">
          <FontAwesomeIcon :icon="faHandPointUp" />
        </button>
        <button @click="goToBottom" class="button is-medium">
          <FontAwesomeIcon :icon="faHandPointDown" />
        </button>
      </div>
      <Loading
        v-model:active="isLoading"
        :is-full-page="true"
        :lock-scroll="true"
        background-color="#000"
        color="#fff"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBarComponent from '@/components/NavBarComponent.vue';
import SettingsComponent from '@/components/SettingsComponent.vue';
import NotificationComponent from '@/components/NotificationComponent.vue';
import BoxNavigateComponent from '@/components/BoxNavigateComponent.vue';
import BoxActionsComponent from '@/components/BoxActionsComponent.vue';
import { onMounted, ref, watch } from 'vue';
import { runTestStore as useRunTestStore } from '@/store/runTestStore';
import Loading from 'vue-loading-overlay';
import { navigationResultStore as useNavigationResultStore } from '@/store/navigationResultStore';
import { IRunTest } from '@/electron/interface/IRunTest';
import ModalConfirmComponent from '@/components/ModalConfirmComponent.vue';
import i18n from '@/i18n/i18n';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHandPointUp, faHandPointDown } from '@fortawesome/free-solid-svg-icons';

const t = i18n.global.t;
const isInputFilled = ref(false);
const runTestStore = useRunTestStore();
const navigationResultStore = useNavigationResultStore();
const isLoading = ref(false);
const isNotification = ref(false);
const isNotificationType = ref<'is-danger' | 'is-success'>('is-success');
const isNotificationMessage = ref(t('testSuccessNotification'));
const name = ref(t('inputTestName'));
const isConfirmModalActive = ref(false);
const isSkeleton = ref(true);
const defaultNameValues = [
  i18n.global.messages.en.inputTestName,
  i18n.global.messages.es.inputTestName,
  i18n.global.messages.pt.inputTestName,
];

onMounted(async () => {
  const session = await window.electronAPI?.getSession();
  if (session) {
    runTestStore.saveRunTest(session);
  }
  isSkeleton.value = false;
});

watch(
  () => i18n.global.t('inputTestName'),
  () => {
    if (defaultNameValues.includes(name.value)) {
      name.value = t('inputTestName');
    }
  }
);

watch(
  () => runTestStore.runTest,
  async newValue => {
    await window.electronAPI?.saveSession(JSON.stringify(newValue));
  },
  { deep: true }
);

watch(
  () => name.value,
  newValue => {
    if (newValue && newValue !== '') {
      runTestStore.runTest.name = newValue;
      return;
    }
    runTestStore.runTest.name = '';
  }
);

watch(
  () => runTestStore.runTest.name,
  async newValue => {
    if (newValue && newValue !== '') {
      name.value = newValue;
    } else {
      name.value = '';
    }
  }
);

function handleInputFilled(value: boolean): void {
  isInputFilled.value = value;
}

function executeRunTest(): void {
  listenResult();
  isNotification.value = false;
  isLoading.value = true;
  window.electronAPI?.runTest(JSON.stringify(runTestStore.filterEnabledActions()));
}

function handleNotification(): void {
  isNotification.value = false;
}

function listenResult(): void {
  window.electronAPI
    ?.listenForResult()
    .then(results => {
      console.log('Resultado:', results);
      navigationResultStore.save(results);
      if (results.some(result => result.error)) {
        isNotificationType.value = 'is-danger';
        isNotificationMessage.value = t('testFailedNotification');
      } else {
        isNotificationType.value = 'is-success';
        isNotificationMessage.value = t('testSuccessNotification');
      }
      isNotification.value = true;
    })
    .finally(() => {
      isLoading.value = false;
      scrollToTop();
    });
}

function scrollToTop(): void {
  window.scrollTo(0, 0);
}

async function openFile(): Promise<void> {
  const file = await window.electronAPI?.openFile();
  if (file) {
    const runTest: IRunTest = JSON.parse(file);
    runTestStore.saveRunTest(runTest);
    closeNotification();
  }
}

async function saveFile(): Promise<void> {
  await window.electronAPI?.saveFile(JSON.stringify(runTestStore.runTest, null, 2));
}

async function confirmAction(): Promise<void> {
  closeNotification();
  isConfirmModalActive.value = false;
  runTestStore.saveRunTest({
    name: t('inputTestName'),
    url: '',
    isSaveLastScreenshot: true,
    isSaveEveryScreenshot: true,
    isHeadless: true,
    defaultTimeout: 15000,
    actions: [],
  });
  await window.electronAPI?.deleteSession();
}

function closeConfirmModal(): void {
  isConfirmModalActive.value = false;
}

function closeNotification(): void {
  isNotification.value = false;
}

function goToTop() {
  window.scrollTo({ top: 0 });
}

function goToBottom() {
  window.scrollTo({ top: document.body.scrollHeight });
}
</script>

<style scoped>
.floating-buttons {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
