<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { trainersEndpoint } from '@/constants';
import UiLink from '@/components/ui/Link.vue'

const route = useRoute();
const trainer = ref({ id: '', title: '', text: '' });

onMounted(async () => {
  const response = await fetch(`${trainersEndpoint}/${route.params.id}`);
  trainer.value = await response.json();
});
</script>

<template lang="pug">
  .trainer-detail-view
    UiLink.trainer-detail-view__back-btn(to="/trainers") ←

    h1.trainer-detail-view__title {{ trainer.title }}

    p ID: {{ trainer.id }}
    p {{ trainer.text }}

</template>

<style lang="scss">
.trainer-detail-view {
  padding: 24px;

  &__back-btn {
    display: inline-block;
    text-decoration: none;
    margin-bottom: 16px;
  }

  &__title {
    margin-bottom: 24px;
  }
}
</style>