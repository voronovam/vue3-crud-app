<template lang="pug">
button.ui-button(
  :type="$props.type ? $props.type : 'button' "
  :disabled="$props.disabled"
  :class="$props.look ? `_${$props.look}` : ''"
)
  slot
</template>

<script setup lang="ts">
defineProps<{
  type?: string
  disabled?: boolean
  look?: string
}>()

</script>

<style lang="scss">
.ui-button {
  color: var(--text-color);
  border: 1px solid var(--border-color);
  padding: 4px 8px;
  border-radius: var(--border-radius);
  transition: color .2s ease;

  &._edit {
    color: var(--warning-color);
    border-color: var(--warning-color);

    &:hover, &:focus-visible {
      color: var(--white-color);
      background-color: var(--warning-color);
    }
  }

  &._info {
    color: var(--success-color);
    border-color: var(--success-color);

    &:hover, &:focus-visible {
      color: var(--white-color);
      background-color: var(--success-color);
    }
  }

  &._delete {
    color: var(--error-color);
    border-color: var(--error-color);

    &:hover, &:focus-visible {
      color: var(--white-color);
      background-color: var(--error-color);
    }
  }

  &._inline {
    border-color: transparent;

    &:hover, &:focus-visible {
      text-decoration: underline;
    }
  }
}
</style>