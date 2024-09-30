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
  border-bottom: 1px solid var(--border-color);
  padding: 24px;

  @include tablet {
    border-bottom: unset;
    border-right: 1px solid var(--border-color);
  }

  &__list {
    display: flex;
    grid-gap: 16px;
    list-style: none;
    margin: 0;
    padding: 0;

    @include tablet {
      flex-direction: column;
    }
  }

  &__link {
    text-decoration: none;

    &.router-link-exact-active {
      color: var(--info-color);
    }
  }
}
</style>