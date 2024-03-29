<template>
  <div class="box">
    <div class="is-size-4 has-text-weight-bold mb-2">
      <span class="mr-2"><FontAwesomeIcon :icon="faComputerMouse" /></span>
      <span>Ações</span>
    </div>
    <button class="button is-info" :disabled="disabled" @click="openModal">
      <span class="icon">
        <FontAwesomeIcon :icon="faPlus" />
      </span>
      <span>Selecione ação</span>
    </button>
    <div class="py-4">
      <VueDraggableNext :list="store.runTest.actions" @change="handleChangeAction">
        <transition-group type="transition" name="flip-list">
          <div class="card is-fullwidth" v-for="action in store.runTest.actions" :key="action.id">
            <header
              class="card-header card-toggle is-clickable"
              v-if="action.action === 'wait-click'"
              @click="toggleCard(action.id)"
            >
              <p class="card-header-title">Esperar e Clicar</p>
              <a class="card-header-icon">
                <FontAwesomeIcon :icon="faAngleDown" />
              </a>
            </header>
            <div class="card-content" :class="{ 'is-hidden': !isCardVisible(action.id) }">
              <div class="content break-words">{{ `${action.elementType}${action.element}` }}</div>
              <footer class="buttons">
                <button
                  class="button card-footer-item is-primary"
                  @click="updateWaitClickAction(action)"
                >
                  Editar
                </button>
                <button class="button card-footer-item is-danger" @click="deleteAction(action.id)">
                  Excluir
                </button>
              </footer>
            </div>
          </div>
        </transition-group>
      </VueDraggableNext>
    </div>
  </div>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <section class="modal-card-body">
        <article class="panel is-primary">
          <p class="panel-heading">Escolha ações</p>
          <p class="panel-tabs">
            <a :class="{ 'is-active': currentCategory === 'all' }" @click="currentCategory = 'all'"
              >Todas</a
            >
            <a
              :class="{ 'is-active': currentCategory === 'click' }"
              @click="currentCategory = 'click'"
              >Clicar</a
            >
            <a
              :class="{ 'is-active': currentCategory === 'fill' }"
              @click="currentCategory = 'fill'"
              >Preencher</a
            >
          </p>
          <div class="panel-block">
            <p class="control has-icons-left">
              <input
                class="input is-primary"
                type="text"
                placeholder="Pesquisar"
                v-model.trim="searchTerm"
              />
              <span class="icon is-left">
                <FontAwesomeIcon :icon="faSearch" />
              </span>
            </p>
          </div>
          <a
            class="panel-block"
            v-for="action in filteredActions"
            :key="action.label"
            :class="{ 'is-active': activeAction === action.label }"
            @mouseover="activeAction = action.label"
            @mouseleave="activeAction = ''"
            @click="handleActionClick(action)"
          >
            <span class="panel-icon" v-for="icon in action.icons">
              <FontAwesomeIcon :icon="icon" />
            </span>
            <span class="buttons">
              <span> {{ action.label }}</span>
              <span v-if="action.tooltip" v-tooltip="action.tooltip">
                <FontAwesomeIcon :icon="faCircleInfo" class="is-size-7" />
              </span>
            </span>
          </a>
        </article>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button" @click="closeModal">Cancelar</button>
        </div>
      </footer>
    </div>
  </div>
  <ModalWaitClickComponent
    :action="waitClickMode"
    @close-modal="handleWaitClickCloseModal"
    @save-action="handleWaitClickSaveAction"
    v-if="waitClickIsActive"
  />
  <ModalConfirmComponent
    v-if="isConfirmModalActive"
    @confirm-modal="confirmDeleteAction"
    @close-modal="closeConfirmModal"
  />
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faComputerMouse,
  faPlus,
  faSearch,
  faClock,
  faFill,
  faCircleInfo,
  faKeyboard,
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons';
import { computed, ref } from 'vue';
import IBoxAction from '@/interface/IBoxAction';
import { ActionCategoryType } from '@/types/ActionCategoryType';
import ModalWaitClickComponent from '@/components/ModalWaitClickComponent.vue';
import { runTestStore as useRunTestStore } from '@/store/runTestStore';
import { IAction } from '@/electron/interface/IAction';
import { VueDraggableNext } from 'vue-draggable-next';
import ModalConfirmComponent from '@/components/ModalConfirmComponent.vue';

defineProps({
  disabled: {
    type: Boolean,
    required: true,
  },
});

const isActive = ref(false);
const activeAction = ref('');
const currentCategory = ref<ActionCategoryType>('all');
const searchTerm = ref('');
const waitClickMode = ref<IAction | undefined>(undefined);
const waitClickIsActive = ref(false);
const store = useRunTestStore();
const openCards = ref<string[]>([]);
const isConfirmModalActive = ref(false);
const actionIdToDelete = ref<string>('');

const actions: IBoxAction[] = [
  {
    label: 'Esperar e Clicar',
    icons: [faClock, faComputerMouse],
    category: 'click',
    type: 'wait-click',
  },
  { label: 'Clicar', icons: [faComputerMouse], category: 'click', type: 'click' },
  {
    label: 'Preencher',
    icons: [faFill],
    category: 'fill',
    type: 'fill',
    tooltip: 'Preenche o valor do campo ao invés de digitar',
  },
  { label: 'Digitar', icons: [faKeyboard], category: 'fill', type: 'type' },
];

function openModal(): void {
  waitClickMode.value = undefined;
  isActive.value = true;
}

function closeModal(): void {
  isActive.value = false;
  searchTerm.value = '';
  currentCategory.value = 'all';
}

const filteredActions = computed(() => {
  return actions.filter(action => {
    if (currentCategory.value !== 'all' && action.category !== currentCategory.value) {
      return false;
    }
    if (searchTerm.value && !action.label.toLowerCase().includes(searchTerm.value.toLowerCase())) {
      return false;
    }
    return true;
  });
});

function handleActionClick(action: IBoxAction): void {
  switch (action.type) {
    case 'wait-click':
      waitClickIsActive.value = true;
      break;
    default:
      break;
  }
}

function handleWaitClickCloseModal(): void {
  waitClickIsActive.value = false;
}

function handleWaitClickSaveAction(): void {
  waitClickIsActive.value = false;
  isActive.value = false;
}

function updateWaitClickAction(action: IAction): void {
  waitClickMode.value = action;
  waitClickIsActive.value = true;
}

function toggleCard(actionId: string): void {
  if (openCards.value.includes(actionId)) {
    openCards.value = openCards.value.filter(id => id !== actionId);
  } else {
    openCards.value.push(actionId);
  }
}

function isCardVisible(actionId: string): boolean {
  return openCards.value.includes(actionId);
}

function handleChangeAction(event: { newIndex: number; oldIndex: number }): void {
  const { newIndex, oldIndex } = event;
  const updatedActions = [...store.runTest.actions];
  const movedAction = updatedActions.splice(oldIndex, 1)[0];
  updatedActions.splice(newIndex, 0, movedAction);
  store.setActions(updatedActions);
}

function deleteAction(actionId: string): void {
  actionIdToDelete.value = actionId;
  isConfirmModalActive.value = true;
}

function confirmDeleteAction(): void {
  isConfirmModalActive.value = false;
  store.removeAction(actionIdToDelete.value);
}

function closeConfirmModal(): void {
  isConfirmModalActive.value = false;
}
</script>

<style scoped>
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.card {
  cursor: move;
}
</style>
