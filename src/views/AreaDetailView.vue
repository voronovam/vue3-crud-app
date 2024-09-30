<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { areasEndpoint } from '@/constants';
import UiLink from '@/components/ui/Link.vue'

const route = useRoute();
const area = ref({ id: '', title: '', text: '' });

onMounted(async () => {
  const response = await fetch(`${areasEndpoint}/${route.params.id}`);
  area.value = await response.json();
});
</script>

<template lang="pug">
  .area-detail-view
    UiLink.area-detail-view__back-btn(to="/areas") ←

    h1.area-detail-view__title {{ area.title }}

    p ID: {{ area.id }}
    p {{ area.text }}

</template>

<style lang="scss">
.area-detail-view {
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