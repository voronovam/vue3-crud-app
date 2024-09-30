<template lang="pug">
.trainer-detail-view
  h1.trainer-detail-view__title {{ trainer.title }}
  p ID: {{ trainer.id }}
  p {{ trainer.text }}

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { trainersEndpoint } from '@/constants';

const route = useRoute();
const trainer = ref({ id: '', title: '', text: '' });

onMounted(async () => {
  const response = await fetch(`${trainersEndpoint}/${route.params.id}`);
  trainer.value = await response.json();
});
</script>

<style lang="scss">
.trainer-detail-view {
  padding: 24px;

  &__title {
    margin-bottom: 24px;
  }
}
</style>