<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <span class="mr-4"><FontAwesomeIcon :icon="faComputerMouse" /></span>
          <span>Clicar</span>
        </p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Selecione o Tipo</label>
          <div class="select">
            <select v-model="selectedType">
              <option value="#">Tipo #id</option>
              <option value=".">Tipo .classe</option>
              <option value="xpath/">Tipo //xPath</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label class="label">O texto do seletor do elemento</label>
          <input class="input is-medium" type="text" placeholder="elemento" v-model="elementText" />
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-success" @click="saveAction">Salvar</button>
          <button class="button" @click="closeModal">Voltar</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { runTestStore as useRunTestStore } from '@/store/runTestStore';
import { IAction } from '@/electron/interface/IAction';
import { SelectOptionType } from '@/electron/types/SelectOptionType';
import { generateUUID } from '@/electron/utils/utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faComputerMouse } from '@fortawesome/free-solid-svg-icons';

onMounted(() => {
  if (props.action) {
    selectedType.value = props.action.elementType;
    elementText.value = props.action.element;
  }
});

const props = defineProps({
  action: {
    type: Object as () => IAction,
  },
});

const emit = defineEmits(['close-modal', 'save-action']);

const selectedType = ref<SelectOptionType>('#');
const elementText = ref<string>('');
const store = useRunTestStore();

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
    });
    return;
  }
  store.addAction({
    id: generateUUID(),
    action: 'click',
    elementType: selectedType.value,
    element: elementText.value,
  });
}
</script>

<style scoped></style>
