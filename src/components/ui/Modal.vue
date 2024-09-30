<template lang="pug">
.ui-modal
  slot
</template>

<script setup lang="ts">

</script>

<style lang="scss">
.ui-modal {
  margin: 0;
  min-width: 300px;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  padding: 24px;
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: rgba(0, 0, 0, 0.16) 0 10px 36px 0, rgba(0, 0, 0, 0.06) 0 0 0 1px;
}
</style>