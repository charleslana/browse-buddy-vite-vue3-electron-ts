<template>
  <div class="box">
    <div class="is-size-4 has-text-weight-bold mb-2">
      <span class="mr-2"><FontAwesomeIcon :icon="faRoute" /></span>
      <span>Navegar para</span>
    </div>
    <div class="is-flex is-align-items-center is-justify-content-space-between is-flex-wrap-wrap">
      <button class="button is-info mb-4" :class="{ 'is-skeleton': isSkeleton }" @click="openModal">
        Selecione a url
      </button>
      <div class="break-words" :class="{ 'is-skeleton': isSkeleton }">
        {{ inputUrl || 'vazio' }}
      </div>
    </div>
  </div>
  <div class="modal" :class="{ 'is-active': isModalNavigateActive }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Digite a url desejada</p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <div class="is-pulled-right">
          <button
            class="button is-small mb-5"
            @click="
              isModalUrlActive = true;
              urlChecked = '';
            "
          >
            Usar url's cadastradas
          </button>
        </div>
        <div class="field">
          <div class="control">
            <input
              v-model.trim="inputUrl"
              class="input is-medium"
              :class="{ 'is-danger': !isValidUrl(inputUrl) }"
              type="text"
              placeholder="https://example.com"
            />
          </div>
          <p class="help is-danger" v-if="!isValidUrl(inputUrl)">Informe uma url válida</p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-success" :disabled="!isValidUrl(inputUrl)" @click="saveURL">
            Salvar
          </button>
          <button class="button" @click="closeModal">Cancelar</button>
        </div>
      </footer>
    </div>
  </div>
  <div class="modal" :class="{ 'is-active': isModalUrlActive }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Url's cadastradas</p>
        <button class="delete" aria-label="close" @click="closeModalUrl"></button>
      </header>
      <section class="modal-card-body">
        <button class="button mb-5" @click="toggleUrlRegister">Novo</button>
        <div class="control mb-5" v-if="urlRegister">
          <div class="field">
            <input class="input is-small" type="text" placeholder="Url" v-model.trim="newUrl" />
          </div>
          <div class="field">
            <button class="button is-small" @click="registerUrl">Cadastrar</button>
          </div>
        </div>
        <div
          class="card is-clickable"
          v-for="(url, index) in urls"
          :key="index"
          @click="selectUrl(url)"
        >
          <div class="card-content">
            <div class="content level">
              <div class="control level-left">
                <label class="radio">
                  <input type="radio" :value="url" v-model="urlChecked" />
                  {{ url }}
                </label>
              </div>
              <div class="level-right">
                <a class="mr-2"
                  ><FontAwesomeIcon
                    :icon="faTrashCan"
                    class="has-text-danger"
                    @click.stop="deleteUrl(url)"
                /></a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button" @click="closeModalUrl">Fechar</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faRoute, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { onMounted, ref, watch } from 'vue';
import { runTestStore as useRunTestStore } from '@/store/runTestStore';

defineProps({
  isSkeleton: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['input-filled']);

const isModalNavigateActive = ref(false);
const isModalUrlActive = ref(false);
const inputUrl = ref('');
const store = useRunTestStore();
const urlRegister = ref(false);
const urlChecked = ref('');
const newUrl = ref('');
const urls = ref<string[]>([]);

onMounted(fetchUrls);

watch(
  () => store.runTest.url,
  newValue => {
    if (newValue && newValue !== '') {
      inputUrl.value = newValue;
      emit('input-filled', true);
      return;
    }
    inputUrl.value = '';
    emit('input-filled', false);
  }
);

function openModal(): void {
  isModalNavigateActive.value = true;
}

function saveURL(): void {
  isModalNavigateActive.value = false;
  checkInput();
  store.saveUrl(inputUrl.value);
}

function closeModal(): void {
  if (!isValidUrl(inputUrl.value)) {
    inputUrl.value = '';
    store.saveUrl('');
  }
  checkInput();
  isModalNavigateActive.value = false;
}

function isValidUrl(url: string): boolean {
  const pattern = new RegExp('^(https?://)?([\\w-]+\\.)+[\\w-]+(/[\\w- ./?%&=]*)?$');
  return pattern.test(url);
}

function checkInput(): void {
  if (inputUrl.value.trim() !== '') {
    emit('input-filled', true);
    return;
  }
  emit('input-filled', false);
}

function toggleUrlRegister(): void {
  urlRegister.value = !urlRegister.value;
}

function closeModalUrl(): void {
  isModalUrlActive.value = false;
  urlRegister.value = false;
  urlChecked.value = '';
}

function selectUrl(url: string): void {
  inputUrl.value = url;
  urlChecked.value = '';
  isModalUrlActive.value = false;
}

async function registerUrl(): Promise<void> {
  if (newUrl.value) {
    await window.electronAPI?.addUrl(newUrl.value);
    await fetchUrls();
    urlRegister.value = false;
    newUrl.value = '';
  }
}

async function fetchUrls(): Promise<void> {
  urls.value = await window.electronAPI?.getUrls()!;
}

async function deleteUrl(url: string): Promise<void> {
  await window.electronAPI?.deleteUrl(url);
  fetchUrls();
}
</script>

<style scoped></style>
