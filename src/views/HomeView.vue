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
        <TestNavigateComponent @input-filled="handleInputFilled" />
        <TestActionsComponent :disabled="isInputFilled" />
        <nav class="level">
          <div class="level-left">
            <p class="level-item">
              <button class="button is-link" disabled>Executar</button>
            </p>
          </div>
          <div class="level-right">
            <p class="level-item">
              <button class="button is-success" disabled>Salvar teste</button>
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
import TestNavigateComponent from '@/components/TestNavigateComponent.vue';
import TestActionsComponent from '@/components/TestActionsComponent.vue';
import { ref } from 'vue';

const notificationErrorMessage = ref('error');
const isInputFilled = ref(true);

function handleInputFilled(value: boolean) {
  isInputFilled.value = value;
}
</script>

<style scoped></style>
