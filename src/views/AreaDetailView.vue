<template lang="pug">
.area-detail-view
  h1.area-detail-view__title {{ area.title }}
  p ID: {{ area.id }}
  p {{ area.text }}

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { areasEndpoint } from '@/constants';

const route = useRoute();
const area = ref({ id: '', title: '', text: '' });

onMounted(async () => {
  const response = await fetch(`${areasEndpoint}/${route.params.id}`);
  area.value = await response.json();
});
</script>

<style lang="scss">
.area-detail-view {
  padding: 24px;

  &__title {
    margin-bottom: 24px;
  }
}
</style>