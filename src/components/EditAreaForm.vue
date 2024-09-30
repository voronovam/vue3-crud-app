<template lang="pug">
.edit-area-form
  form(@submit.prevent="submitForm")
    .edit-area-form__fields
      div
        label.edit-area-form__label Name
        input.edit-area-form__field(type="text" v-model="editableArea.title" placeholder="Area name" required)
      div
        label.edit-area-form__label Description
        textarea.edit-area-form__field(v-model="editableArea.text")

    .edit-area-form__actions
      UiButton(type="submit" look="info") Save
      UiButton(@click="cancelEdit" look="inline") Cancel

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import UiButton from '@/components/ui/Button.vue';

const props = defineProps<{
  area: { id: string; title: string; text: string }
}>();

const defaultArea = {
  id: '',
  title: '',
  text: '',
};

const emit = defineEmits(['areaUpdated', 'cancelEdit']);

const editableArea = ref({ ...props.area || defaultArea });

watch(() => props.area, (newArea) => {
  editableArea.value = { ...newArea };
});

const submitForm = () => {
  emit('areaUpdated', editableArea.value);
};

const cancelEdit = () => {
  emit('cancelEdit');
};
</script>

<style lang="scss">
.edit-area-form {
  &__fields {
    display: flex;
    flex-direction: column;
    grid-gap: 24px;
  }

  &__label {
    display: inline-block;
    margin-bottom: 8px;
    color: var(--text-color);
  }

  &__field {
    width: 100%;
    padding: 8px 4px;
  }

  &__actions {
    display: flex;
    grid-gap: 12px;
    margin-top: 16px;
    justify-content: flex-end;
  }
}
</style>