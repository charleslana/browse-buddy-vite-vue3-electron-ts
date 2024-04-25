<template>
  <div class="box">
    <div class="is-size-4 has-text-weight-bold mb-2">
      <span class="mr-2">
        <FontAwesomeIcon :icon="faComputerMouse" />
      </span>
      <span>{{ $t('actions') }}</span>
    </div>
    <button class="button is-info" :disabled="disabled" @click="openModal">
      <span class="icon">
        <FontAwesomeIcon :icon="faPlus" />
      </span>
      <span>{{ $t('addActionsButton') }}</span>
    </button>
    <div class="py-4">
      <div :class="{ 'skeleton-block': isSkeleton }"></div>
      <VueDraggableNext :list="store.runTest.actions" @change="handleChangeAction">
        <transition-group type="transition" name="flip-list">
          <div
            class="card is-fullwidth"
            v-for="action in store.runTest.actions"
            :key="action.id"
            :class="{ 'disabled-card': action.disabled }"
          >
            <header class="card-header card-toggle is-clickable" @click="toggleCard(action.id)">
              <p class="card-header-title">
                <span class="mr-2">
                  <FontAwesomeIcon :icon="faFlag" />
                </span>
                {{ getTitleBoxAction(action.action) }}
              </p>
              <div class="is-flex">
                <a
                  class="card-header-icon"
                  @click.stop="toggleActionStatus(action.id)"
                  v-tooltip="action.disabled ? 'Ativar' : 'Desativar'"
                >
                  <FontAwesomeIcon :icon="action.disabled ? faEyeSlash : faEye" />
                </a>
                <a class="card-header-icon">
                  <FontAwesomeIcon
                    :icon="isCardVisible(action.isVisible) ? faAngleUp : faAngleDown"
                  />
                </a>
              </div>
            </header>
            <div class="card-content" :class="{ 'is-hidden': !isCardVisible(action.isVisible) }">
              <div class="content break-words" v-if="action.elementType && action.element">
                {{ `${action.elementType}${action.element}` }}
              </div>
              <div class="content break-words" v-if="action.text">
                {{ `${action.text}` }}
              </div>
              <footer class="buttons">
                <button
                  class="button card-footer-item is-primary"
                  @click="handleActionUpdate(action)"
                >
                  Editar
                </button>
                <button class="button card-footer-item is-danger" @click="deleteAction(action.id)">
                  Excluir
                </button>
                <button class="button card-footer-item" @click="duplicateAction(action)">
                  <span class="icon is-left">
                    <FontAwesomeIcon :icon="faCopy" />
                  </span>
                  <span>Duplicar</span>
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
          <p class="panel-heading">{{ $t('chooseActions') }}</p>
          <p class="panel-tabs">
            <a
              :class="{ 'is-active': currentCategory === 'all' }"
              @click="currentCategory = 'all'"
              >{{ $t('filterAll') }}</a
            >
            <a
              :class="{ 'is-active': currentCategory === 'click' }"
              @click="currentCategory = 'click'"
              >{{ $t('actionClick') }}</a
            >
            <a
              :class="{ 'is-active': currentCategory === 'fill' }"
              @click="currentCategory = 'fill'"
              >{{ $t('actionFill') }}</a
            >
            <a
              :class="{ 'is-active': currentCategory === 'wait' }"
              @click="currentCategory = 'wait'"
              >Esperar</a
            >
          </p>
          <div class="panel-block">
            <p class="control has-icons-left">
              <input
                class="input is-primary"
                type="text"
                :placeholder="t('inputSearch')"
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
            <span class="panel-icon" v-for="(icon, index) in action.icons" :key="index">
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
          <button class="button" @click="closeModal">{{ $t('cancelButton') }}</button>
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
  <ModalClickComponent
    :action="clickMode"
    @close-modal="handleClickCloseModal"
    @save-action="handleClickSaveAction"
    v-if="clickIsActive"
  />
  <ModalFillComponent
    :action="fillMode"
    @close-modal="handleFillCloseModal"
    @save-action="handleFillSaveAction"
    v-if="fillIsActive"
  />
  <ModalTypeComponent
    :action="typeMode"
    @close-modal="handleTypeCloseModal"
    @save-action="handleTypeSaveAction"
    v-if="typeIsActive"
  />
  <ModalClearComponent
    :action="clearMode"
    @close-modal="handleClearCloseModal"
    @save-action="handleClearSaveAction"
    v-if="clearIsActive"
  />
  <ModalWaitVisibleComponent
    :action="waitVisibleMode"
    @close-modal="handleWaitVisibleCloseModal"
    @save-action="handleWaitVisibleSaveAction"
    v-if="waitVisibleIsActive"
  />
  <ModalWaitHiddenComponent
    :action="waitHiddenMode"
    @close-modal="handleWaitHiddenCloseModal"
    @save-action="handleWaitHiddenSaveAction"
    v-if="waitHiddenIsActive"
  />
  <ModalClickWaitResponseComponent
    :action="clickWaitResponseMode"
    @close-modal="handleClickWaitResponseCloseModal"
    @save-action="handleClickWaitResponseSaveAction"
    v-if="clickWaitResponseIsActive"
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
  faAngleUp,
  faFlag,
  faEraser,
  faCopy,
  faEye,
  faEyeSlash,
  faReply,
} from '@fortawesome/free-solid-svg-icons';
import { computed, ref } from 'vue';
import IBoxAction from '@/interface/IBoxAction';
import { ActionCategoryType } from '@/types/ActionCategoryType';
import ModalWaitClickComponent from '@/components/ModalWaitClickComponent.vue';
import { runTestStore as useRunTestStore } from '@/store/runTestStore';
import { IAction } from '@/electron/interface/IAction';
import { VueDraggableNext } from 'vue-draggable-next';
import ModalConfirmComponent from '@/components/ModalConfirmComponent.vue';
import ModalClickComponent from '@/components/ModalClickComponent.vue';
import { ActionBoxType } from '@/electron/types/ActionBoxType';
import ModalFillComponent from '@/components/ModalFillComponent.vue';
import ModalTypeComponent from '@/components/ModalTypeComponent.vue';
import ModalClearComponent from '@/components/ModalClearComponent.vue';
import { generateUUID } from '@/electron/utils/utils';
import i18n from '@/i18n/i18n';
import ModalWaitVisibleComponent from '@/components/ModalWaitVisibleComponent.vue';
import ModalWaitHiddenComponent from '@/components/ModalWaitHiddenComponent.vue';
import ModalClickWaitResponseComponent from '@/components/ModalClickWaitResponseComponent.vue';

defineProps({
  disabled: {
    type: Boolean,
    required: true,
  },
  isSkeleton: {
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
const clickIsActive = ref(false);
const fillIsActive = ref(false);
const typeIsActive = ref(false);
const clearIsActive = ref(false);
const waitVisibleIsActive = ref(false);
const waitHiddenIsActive = ref(false);
const clickWaitResponseIsActive = ref(false);
const clickMode = ref<IAction | undefined>(undefined);
const fillMode = ref<IAction | undefined>(undefined);
const typeMode = ref<IAction | undefined>(undefined);
const clearMode = ref<IAction | undefined>(undefined);
const waitVisibleMode = ref<IAction | undefined>(undefined);
const waitHiddenMode = ref<IAction | undefined>(undefined);
const clickWaitResponseMode = ref<IAction | undefined>(undefined);
const store = useRunTestStore();
const isConfirmModalActive = ref(false);
const actionIdToDelete = ref<string>('');
const t = i18n.global.t;

const actions = computed<IBoxAction[]>(() => {
  const translatedActions: IBoxAction[] = [
    {
      label: t('actionWaitClick'),
      icons: [faClock, faComputerMouse],
      category: 'click',
      type: 'wait-click',
    },
    { label: t('actionClick'), icons: [faComputerMouse], category: 'click', type: 'click' },
    {
      label: t('actionFill'),
      icons: [faFill],
      category: 'fill',
      type: 'fill',
      tooltip: t('fillTooltip'),
    },
    { label: t('actionType'), icons: [faKeyboard], category: 'fill', type: 'type' },
    { label: t('actionClear'), icons: [faEraser], category: 'fill', type: 'clear' },
    { label: 'Esperar visibilidade', icons: [faEye], category: 'wait', type: 'wait-visible' },
    {
      label: 'Esperar ocultar',
      icons: [faEyeSlash],
      category: 'wait',
      type: 'wait-hidden',
      tooltip:
        'Aguarde até que o elemento não esteja presente no DOM (documento) ou com display none',
    },
    {
      label: 'Esperar resposta por clique',
      icons: [faReply],
      category: 'wait',
      type: 'click-wait-response',
    },
  ];
  return translatedActions;
});

function openModal(): void {
  waitClickMode.value = undefined;
  clickMode.value = undefined;
  fillMode.value = undefined;
  typeMode.value = undefined;
  clearMode.value = undefined;
  waitVisibleMode.value = undefined;
  waitHiddenMode.value = undefined;
  clickWaitResponseMode.value = undefined;
  isActive.value = true;
}

function closeModal(): void {
  isActive.value = false;
  searchTerm.value = '';
  currentCategory.value = 'all';
}

const filteredActions = computed(() => {
  return actions.value.filter(action => {
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
    case 'click':
      clickIsActive.value = true;
      break;
    case 'fill':
      fillIsActive.value = true;
      break;
    case 'type':
      typeIsActive.value = true;
      break;
    case 'clear':
      clearIsActive.value = true;
      break;
    case 'wait-visible':
      waitVisibleIsActive.value = true;
      break;
    case 'wait-hidden':
      waitHiddenIsActive.value = true;
      break;
    case 'click-wait-response':
      clickWaitResponseIsActive.value = true;
      break;
    default:
      break;
  }
}

function getTitleBoxAction(action: ActionBoxType): string {
  switch (action) {
    case 'wait-click':
      return 'Esperar e Clicar';
    case 'click':
      return 'Clicar';
    case 'fill':
      return 'Preencher';
    case 'type':
      return 'Digitar';
    case 'clear':
      return 'Limpar';
    case 'wait-visible':
      return 'Esperar visibilidade';
    case 'wait-hidden':
      return 'Esperar ocultar';
    case 'click-wait-response':
      return 'Esperar resposta por clique';
    default:
      return '';
  }
}

function handleActionUpdate(action: IAction): void {
  switch (action.action) {
    case 'wait-click':
      updateWaitClickAction(action);
      break;
    case 'click':
      updateClickAction(action);
      break;
    case 'fill':
      updateFillAction(action);
      break;
    case 'type':
      updateTypeAction(action);
      break;
    case 'clear':
      updateClearAction(action);
      break;
    case 'wait-visible':
      updateWaitVisibleAction(action);
      break;
    case 'wait-hidden':
      updateWaitHiddenAction(action);
      break;
    case 'click-wait-response':
      updateClickWaitResponseAction(action);
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

function handleClickCloseModal(): void {
  clickIsActive.value = false;
}

function handleClickSaveAction(): void {
  clickIsActive.value = false;
  isActive.value = false;
}

function updateClickAction(action: IAction): void {
  clickMode.value = action;
  clickIsActive.value = true;
}

function handleFillCloseModal(): void {
  fillIsActive.value = false;
}

function handleFillSaveAction(): void {
  fillIsActive.value = false;
  isActive.value = false;
}

function updateFillAction(action: IAction): void {
  fillMode.value = action;
  fillIsActive.value = true;
}

function handleTypeCloseModal(): void {
  typeIsActive.value = false;
}

function handleTypeSaveAction(): void {
  typeIsActive.value = false;
  isActive.value = false;
}

function updateTypeAction(action: IAction): void {
  typeMode.value = action;
  typeIsActive.value = true;
}

function handleClearCloseModal(): void {
  clearIsActive.value = false;
}

function handleClearSaveAction(): void {
  clearIsActive.value = false;
  isActive.value = false;
}

function updateClearAction(action: IAction): void {
  clearMode.value = action;
  clearIsActive.value = true;
}

function handleWaitVisibleCloseModal(): void {
  waitVisibleIsActive.value = false;
}

function handleWaitVisibleSaveAction(): void {
  waitVisibleIsActive.value = false;
  isActive.value = false;
}

function updateWaitVisibleAction(action: IAction): void {
  waitVisibleMode.value = action;
  waitVisibleIsActive.value = true;
}

function handleWaitHiddenCloseModal(): void {
  waitHiddenIsActive.value = false;
}

function handleWaitHiddenSaveAction(): void {
  waitHiddenIsActive.value = false;
  isActive.value = false;
}

function updateWaitHiddenAction(action: IAction): void {
  waitHiddenMode.value = action;
  waitHiddenIsActive.value = true;
}

function handleClickWaitResponseCloseModal(): void {
  clickWaitResponseIsActive.value = false;
}

function handleClickWaitResponseSaveAction(): void {
  clickWaitResponseIsActive.value = false;
  isActive.value = false;
}

function updateClickWaitResponseAction(action: IAction): void {
  clickWaitResponseMode.value = action;
  clickWaitResponseIsActive.value = true;
}

function toggleCard(actionId: string): void {
  store.toggleActionVisible(actionId);
}

function isCardVisible(isVisible?: boolean): boolean {
  if (isVisible === undefined) {
    return true;
  }
  return isVisible;
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

function duplicateAction(action: IAction): void {
  const index = store.runTest.actions.findIndex(a => a.id === action.id);
  if (index !== -1) {
    const duplicatedAction = { ...action, id: generateUUID() };
    store.runTest.actions.splice(index + 1, 0, duplicatedAction);
  }
}

function toggleActionStatus(id: string): void {
  store.toggleActionStatus(id);
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

.disabled-card {
  opacity: 0.5;
}
</style>
