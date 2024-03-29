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
        <NotificationSuccessComponent />
        <NotificationErrorComponent :message="notificationErrorMessage" />
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
import { onMounted, ref } from 'vue';
import { runTestStore as useRunTestStore } from '@/store/runTestStore';

onMounted(() => {
  listenResult();
});

const notificationErrorMessage = ref('error');
const isInputFilled = ref(false);
const store = useRunTestStore();

function handleInputFilled(value: boolean): void {
  isInputFilled.value = value;
}

function executeRunTest(): void {
  window.electronAPI.runTest(JSON.stringify(store.runTest));
}

function listenResult(): void {
  window.electronAPI.listenForResult((result: string) => {
    console.log(result);
  });
}
</script>

<style scoped></style>
