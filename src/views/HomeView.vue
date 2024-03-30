<template>
  <NavBarComponent />
  <div class="container">
    <div class="columns">
      <div class="column is-two-thirds mx-5">
        <div class="box">
          <div class="level">
            <div class="level-left">
              <button class="button is-responsive">Importar um teste já configurado</button>
            </div>
            <div class="level-right">
              <button class="button is-ghost">Limpar testes</button>
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
        <BoxNavigateComponent @input-filled="handleInputFilled" />
        <BoxActionsComponent :disabled="!isInputFilled" />
        <nav class="level">
          <div class="level-left">
            <p class="level-item">
              <button class="button is-link" :disabled="!isInputFilled" @click="executeRunTest">
                Executar
              </button>
            </p>
          </div>
          <div class="level-right">
            <p class="level-item">
              <button class="button is-success" :disabled="!isInputFilled">Salvar teste</button>
            </p>
          </div>
        </nav>
      </div>
      <SettingsComponent />
      <Loading
        v-model:active="isLoading"
        :is-full-page="true"
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
import { ref } from 'vue';
import { runTestStore as useRunTestStore } from '@/store/runTestStore';
import Loading from 'vue-loading-overlay';

const notificationErrorMessage = ref('error');
const isInputFilled = ref(false);
const store = useRunTestStore();
const isLoading = ref(false);
const isNotificationSuccess = ref(false);
const isNotificationError = ref(false);

function handleInputFilled(value: boolean): void {
  isInputFilled.value = value;
}

function executeRunTest(): void {
  listenResult();
  isNotificationSuccess.value = false;
  isNotificationError.value = false;
  isLoading.value = true;
  window.electronAPI?.runTest(JSON.stringify(store.runTest));
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
      isNotificationSuccess.value = true;
    })
    .catch((error: Error) => {
      console.error('Erro:', error.message);
      notificationErrorMessage.value = error.message;
      isNotificationError.value = true;
    })
    .finally(() => {
      isLoading.value = false;
    });
}
</script>

<style scoped></style>
