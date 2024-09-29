<template lang="pug">
aside.aside
  ul.aside__list
    li
      UiLink.aside__link(to="/") Clubs
    li
      UiLink.aside__link(to="/trainers") Trainers
    li
      UiLink.aside__link(to="/areas") Areas

</template>

<script setup lang="ts">
import UiLink from '@/components/ui/Link.vue'
</script>

<style lang="scss">
.aside {
  border-right: 1px solid var(--border-color);
  padding: 24px;

  &__list {
    display: flex;
    flex-direction: column;
    grid-gap: 16px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__link {
    text-decoration: none;
  }
}
</style>