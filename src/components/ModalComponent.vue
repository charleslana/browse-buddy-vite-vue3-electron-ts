<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <span class="mr-4" v-for="(modalIcon, index) in modalIcons" :key="index">
            <FontAwesomeIcon :icon="modalIcon" />
          </span>
          <span>{{ modalTitle }}</span>
        </p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <VTooltip class="is-block is-size-5 has-text-centered" v-if="waitIcon">
          <FontAwesomeIcon :icon="faClock" />
          <template #popper>
            <span class="is-block">Este ícone indica:</span>
            <span>Aguardar automaticamente a ação</span>
          </template>
        </VTooltip>
        <div class="field" v-for="(input, index) in action.inputs" :key="index">
          <div class="field" v-if="input.select">
            <label class="label">Selecione o Tipo</label>
            <div class="select">
              <select v-model="selectedType[index]" @change="handleSelectChange(input, $event)">
                <option v-for="(option, index) in selectOptions" :key="index" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>
          </div>
          <div class="field">
            <label class="label">{{ input.label }}</label>
            <input
              class="input is-medium"
              type="text"
              :placeholder="input.placeholder"
              v-model.trim="input.value"
            />
          </div>
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
import { computed, ref, onMounted } from 'vue';
import { runTestStore as useRunTestStore } from '@/store/runTestStore';
import { IAction } from '@/electron/interface/IAction';
import { generateUUID } from '@/electron/utils/utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { IconDefinition, faClock } from '@fortawesome/free-solid-svg-icons';
import { SelectOptionType } from '@/electron/types/SelectOptionType';
import { IInput } from '@/electron/interface/IInput';

onMounted(() => {
  props.action.inputs.forEach((input, index) => {
    selectedType.value[index] = input.select ?? '#';
  });
});

const props = defineProps({
  modalIcons: {
    type: Object as () => IconDefinition[],
    required: true,
  },
  modalTitle: {
    type: String,
    required: true,
  },
  waitIcon: {
    type: Boolean,
  },
  action: {
    type: Object as () => IAction,
    required: true,
  },
});

const emit = defineEmits(['close-modal', 'save-action']);

const selectedType = ref<SelectOptionType[]>([]);
const store = useRunTestStore();

const selectOptions: { value: SelectOptionType; text: string }[] = [
  { value: '#', text: 'Tipo #id' },
  { value: '.', text: 'Tipo .classe' },
  { value: 'xpath/', text: 'Tipo //xPath' },
];

const isSaveButtonDisabled = computed(() => {
  return props.action.inputs.some(input => input.value === undefined || input.value === '');
});

function handleSelectChange(input: IInput, event: Event): void {
  const target = event.target as HTMLSelectElement;
  input.select = target.value as SelectOptionType;
}

function closeModal(): void {
  emit('close-modal');
}

function saveAction(): void {
  emit('save-action');
  if (props.action.id) {
    store.updateAction({
      ...props.action,
      inputs: props.action.inputs,
    });
    return;
  }
  store.addAction({
    id: generateUUID(),
    type: props.action.type,
    inputs: props.action.inputs,
    title: props.modalTitle,
    icons: props.modalIcons,
  });
}
</script>

<style scoped></style>
