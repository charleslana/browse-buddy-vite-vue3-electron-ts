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
        <NotificationSuccessComponent
          @close="handleNotificationSuccess"
          v-if="isNotificationSuccess"
        />
        <NotificationErrorComponent
          :message="notificationErrorMessage"
          @close="handleNotificationError"
          v-if="isNotificationError"
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
      <SettingsComponent />
      <ModalConfirmComponent
        v-if="isConfirmModalActive"
        @confirm-modal="confirmAction"
        @close-modal="closeConfirmModal"
      />
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
import NotificationSuccessComponent from '@/components/NotificationSuccessComponent.vue';
import NotificationErrorComponent from '@/components/NotificationErrorComponent.vue';
import BoxNavigateComponent from '@/components/BoxNavigateComponent.vue';
import BoxActionsComponent from '@/components/BoxActionsComponent.vue';
import { onMounted, ref, watch } from 'vue';
import { runTestStore as useRunTestStore } from '@/store/runTestStore';
import Loading from 'vue-loading-overlay';
import { navigationResultStore as useNavigationResultStore } from '@/store/navigationResultStore';
import { IRunTest } from '@/electron/interface/IRunTest';
import ModalConfirmComponent from '@/components/ModalConfirmComponent.vue';
import i18n from '@/i18n/i18n';

const notificationErrorMessage = ref('error');
const isInputFilled = ref(false);
const runTestStore = useRunTestStore();
const navigationResultStore = useNavigationResultStore();
const isLoading = ref(false);
const isNotificationSuccess = ref(false);
const isNotificationError = ref(false);
const name = ref('Teste de Exemplo');
const isConfirmModalActive = ref(false);
const isSkeleton = ref(true);
const t = i18n.global.t;
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
  isNotificationSuccess.value = false;
  isNotificationError.value = false;
  isLoading.value = true;
  window.electronAPI?.runTest(JSON.stringify(runTestStore.filterEnabledActions()));
}

function handleNotificationSuccess(): void {
  isNotificationSuccess.value = false;
}

function handleNotificationError(): void {
  isNotificationError.value = false;
}

function listenResult(): void {
  window.electronAPI
    ?.listenForResult()
    .then(result => {
      console.log('Resultado:', result);
      navigationResultStore.save(result);
      isNotificationSuccess.value = true;
    })
    .catch((error: Error) => {
      console.error('Erro:', error.message);
      notificationErrorMessage.value = error.message;
      isNotificationError.value = true;
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
    closeNotifications();
  }
}

async function saveFile(): Promise<void> {
  await window.electronAPI?.saveFile(JSON.stringify(runTestStore.runTest, null, 2));
}

async function confirmAction(): Promise<void> {
  closeNotifications();
  isConfirmModalActive.value = false;
  runTestStore.saveRunTest({
    name: t('inputTestName'),
    url: '',
    isSaveLastScreenshot: true,
    isSaveEveryScreenshot: true,
    isHeadless: true,
    actions: [],
  });
  await window.electronAPI?.deleteSession();
}

function closeConfirmModal(): void {
  isConfirmModalActive.value = false;
}

function closeNotifications(): void {
  isNotificationSuccess.value = false;
  isNotificationError.value = false;
}
</script>

<style scoped></style>
