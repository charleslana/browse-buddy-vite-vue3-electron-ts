<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <span class="mr-4"><FontAwesomeIcon :icon="faReply" /></span>
          <span>Esperar resposta com clique</span>
        </p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <VTooltip class="is-block is-size-5 has-text-centered">
          <FontAwesomeIcon :icon="faClock" />
          <template #popper>
            <span class="is-block">Este ícone indica:</span>
            <span>Aguardar automaticamente a ação</span>
          </template>
        </VTooltip>
        <div class="field">
          <label class="label">Selecione o Tipo</label>
          <div class="select">
            <select v-model="selectedType">
              <option v-for="(option, index) in selectOptions" :key="index" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
        </div>
        <div class="field">
          <label class="label">O texto do seletor do elemento do clique</label>
          <input
            class="input is-medium"
            type="text"
            placeholder="elemento"
            v-model.trim="elementText"
          />
        </div>
        <div class="field">
          <label class="label">URL (pode usar expressão regular exemplo: **/api/**/filter)</label>
          <input class="input is-medium" type="text" placeholder="url" v-model.trim="url" />
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-success" @click="saveAction" :disabled="isSaveButtonDisabled">
            Salvar
          </button>
          <button class="button" @click="closeModal">Voltar</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { runTestStore as useRunTestStore } from '@/store/runTestStore';
import { IAction } from '@/electron/interface/IAction';
import { generateUUID } from '@/electron/utils/utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faClock, faReply } from '@fortawesome/free-solid-svg-icons';
import { SelectOptionType } from '@/electron/types/SelectOptionType';

onMounted(() => {
  if (props.action) {
    selectedType.value = props.action.elementType;
    elementText.value = props.action.element;
    url.value = props.action.text!;
  }
});

const props = defineProps({
  action: {
    type: Object as () => IAction,
  },
});

const emit = defineEmits(['close-modal', 'save-action']);

const selectedType = ref<SelectOptionType | undefined>('#');
const elementText = ref<string | undefined>('');
const url = ref<string>('');
const store = useRunTestStore();

const selectOptions: { value: SelectOptionType; text: string }[] = [
  { value: '#', text: 'Tipo #id' },
  { value: '.', text: 'Tipo .classe' },
  { value: 'xpath/', text: 'Tipo //xPath' },
];

const isSaveButtonDisabled = computed(() => {
  return url.value === '';
});

function closeModal(): void {
  emit('close-modal');
}

function saveAction(): void {
  emit('save-action');
  if (props.action) {
    store.updateAction({
      id: props.action.id,
      action: props.action.action,
      elementType: selectedType.value,
      element: elementText.value,
      text: url.value,
    });
    return;
  }
  store.addAction({
    id: generateUUID(),
    action: 'click-wait-response',
    elementType: selectedType.value,
    element: elementText.value,
    text: url.value,
  });
}
</script>

<style scoped></style>
