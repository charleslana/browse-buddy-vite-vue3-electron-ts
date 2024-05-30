<template>
  <nav class="navbar is-fixed-top mb-5" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <span class="navbar-item is-align-items-end">
        <img :src="images.logo" alt="logo image" />
        <p class="logo is-size-4 ml-2">Browse Buddy</p>
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
      <div class="navbar-end">
        <div class="navbar-item is-hoverable">
          <div class="navbar-item has-dropdown">
            <a class="navbar-link">{{ $t('themes') }}</a>
            <div class="navbar-dropdown">
              <a class="navbar-item" @click="changeTheme('dark')">{{ $t('darkTheme') }}</a>
              <a class="navbar-item" @click="changeTheme('light')">{{ $t('lightTheme') }}</a>
              <a class="navbar-item" @click="changeTheme('system')">{{ $t('systemTheme') }}</a>
            </div>
          </div>
        </div>
        <div class="navbar-item is-hoverable">
          <div class="navbar-item has-dropdown">
            <a class="navbar-link">{{ $t('languages') }}</a>
            <div class="navbar-dropdown">
              <a class="navbar-item" @click="changeLanguage('en')">{{ $t('langEnglish') }}</a>
              <a class="navbar-item" @click="changeLanguage('es')">{{ $t('langSpanish') }}</a>
              <a class="navbar-item" @click="changeLanguage('pt')">{{ $t('langPortuguese') }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import images from '@/data/imageData';
import { ThemeModeType } from '@/electron/types/ThemeModeType';
import { onMounted, ref } from 'vue';
import i18n from '@/i18n/i18n';
import { SupportedLanguagesType } from '@/electron/types/SupportedLanguagesType';

onMounted(async () => {
  const lang = await window.electronAPI?.getLang();
  if (lang) {
    i18n.global.locale = lang;
  }
});

const isMenuOpen = ref(false);

function toggleMenu(): void {
  isMenuOpen.value = !isMenuOpen.value;
}

function changeTheme(theme: ThemeModeType): void {
  window.electronAPI?.changeTheme(theme);
}

async function changeLanguage(lang: SupportedLanguagesType): Promise<void> {
  i18n.global.locale = lang;
  await window.electronAPI?.setLang(lang);
}
</script>

<style scoped>
.logo {
  line-height: 0.6;
}
</style>
