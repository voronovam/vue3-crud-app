<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

import TheHeader from '@/components/TheHeader.vue'
import TheAside from '@/components/TheAside.vue'
import TheFooter from '@/components/TheFooter.vue'

const isDarkMode = ref(false);

const updateTheme = (event: MediaQueryListEvent) => {
  isDarkMode.value = event.matches;
  document.body.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light');
};

onMounted(() => {
  const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
  isDarkMode.value = darkThemeMq.matches;
  document.body.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light');

  darkThemeMq.addEventListener('change', updateTheme);
});

onUnmounted(() => {
  const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
  darkThemeMq.removeEventListener('change', updateTheme);
});
</script>

<template lang="pug">
.page
  TheHeader.page__header
  main.page__main
    TheAside.page__aside
    .page__content
      router-view
  TheFooter.page__footer

</template>

<style lang="scss">
.page {
  max-width: 900px;
  margin-right: auto;
  margin-left: auto;
  min-height: 100vh;
  display: grid;
  grid-template-rows: max-content 1fr max-content;
  grid-template-columns: 100%;
  border-right: 1px solid var(--border-color);
  border-left: 1px solid var(--border-color);

  &__main {
    @include tablet {
      display: grid;
      grid-template-columns:  200px minmax(0, 1fr);
    }
  }
}
</style>