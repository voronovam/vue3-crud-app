<template lang="pug">
RouterLink.ui-link(:to="$props.to")
  slot

</template>

<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router"

defineProps<{
  to: RouteLocationRaw
}>()

</script>

<style lang="scss">
.ui-link {
  color: var(--text-color);
  transition: color .1s ease-in;

  &:hover,
  &:focus-visible {
    color: var(--accent-color);
  }
}
</style>