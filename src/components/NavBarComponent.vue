<template>
  <nav class="navbar mb-5" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <span class="navbar-item">
        <img :src="images.logo" alt="logo image" />
      </span>
      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        @click="toggleMenu"
        :class="{ 'is-active': isMenuOpen }"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" :class="{ 'is-active': isMenuOpen }">
      <div class="navbar-start">
        <div class="navbar-item is-hoverable">
          <button class="button">
            <span class="icon is-small">
              <FontAwesomeIcon :icon="faMoon" />
            </span>
            <span>Temas</span>
          </button>
          <div class="navbar-dropdown">
            <a class="navbar-item theme-button">
              <button class="button" @click="changeTheme('dark')">
                <span class="icon is-small">
                  <FontAwesomeIcon :icon="faMoon" />
                </span>
                <span>Tema escuro</span>
              </button>
            </a>
            <a class="navbar-item theme-button">
              <button class="button" @click="changeTheme('light')">
                <span class="icon is-small">
                  <FontAwesomeIcon :icon="faSun" />
                </span>
                <span>Tema claro</span>
              </button>
            </a>
            <a class="navbar-item theme-button">
              <button class="button" @click="changeTheme('system')">
                <span class="icon is-small">
                  <FontAwesomeIcon :icon="faWindowMaximize" />
                </span>
                <span>Tema do sistema</span>
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import images from '@/data/imageData';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faMoon, faSun, faWindowMaximize } from '@fortawesome/free-solid-svg-icons';
import { ThemeMode } from '@/electron/type/ThemeMode';
import { ref } from 'vue';

const isMenuOpen = ref(false);

function toggleMenu(): void {
  isMenuOpen.value = !isMenuOpen.value;
}

function changeTheme(theme: ThemeMode): void {
  window.electronAPI.changeTheme(theme);
}
</script>

<style scoped></style>
