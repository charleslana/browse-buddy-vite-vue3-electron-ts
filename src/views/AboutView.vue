<template>
  <p class="is-size-5 has-text-weight-bold has-text-centered">Browse Buddy</p>
  <p class="is-size-7 has-text-weight-bold has-text-centered">Desenvolvido por Charles Lana</p>
  <p class="is-size-7 has-text-weight-bold has-text-centered">Versão {{ projectVersion }}</p>
  <div class="has-text-centered mt-4">
    <figure class="image is-128x128 is-inline-block">
      <img :src="images.logo" alt="logo image" />
    </figure>
  </div>
</template>

<script setup lang="ts">
import images from '@/data/imageData';
import packageJson from '../../package.json';

const projectVersion = packageJson.version;
</script>

<style scoped></style>
