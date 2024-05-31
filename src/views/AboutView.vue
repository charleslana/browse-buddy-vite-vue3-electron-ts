<template>
  <p class="is-size-5 has-text-weight-bold has-text-centered logo">Browse Buddy</p>
  <p class="is-size-7 has-text-weight-bold has-text-centered">{{ queryD }} Charles Lana</p>
  <p class="is-size-7 has-text-weight-bold has-text-centered">{{ queryV }} {{ projectVersion }}</p>
  <div class="has-text-centered mt-4">
    <figure class="image is-128x128 is-inline-block">
      <img :src="images.logo" alt="logo image" />
    </figure>
  </div>
</template>

<script setup lang="ts">
import images from '@/data/imageData';
import packageJson from '../../package.json';
import { useRoute } from 'vue-router';

const projectVersion = packageJson.version;
const route = useRoute();
const queryD = route.query.d;
const queryV = route.query.v;
</script>

<style scoped></style>
