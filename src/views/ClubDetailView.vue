<template lang="pug">
.club-detail-view
  h1.club-detail-view__title {{ club.title }}
  p ID: {{ club.id }}
  p Schedules ID: {{ club.schedules_id }}

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { clubsEndpoint } from '@/constants';

const route = useRoute();
const club = ref({ id: '', title: '', schedules_id: 0 });

onMounted(async () => {
  const response = await fetch(`${clubsEndpoint}/${route.params.id}`);
  club.value = await response.json();
});
</script>

<style lang="scss">
.club-detail-view {
  padding: 24px;

  &__title {
    margin-bottom: 24px;
  }
}
</style>