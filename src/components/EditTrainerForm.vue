<template lang="pug">
.edit-trainer-form
  form(@submit.prevent="submitForm")
    .edit-trainer-form__fields
      div
        label.edit-trainer-form__label Name
        input.edit-trainer-form__field(type="text" v-model="editableTrainer.title" placeholder="Trainer name" required)
      div
        label.edit-trainer-form__label Description
        textarea.edit-trainer-form__field(v-model="editableTrainer.text")

    .edit-trainer-form__actions
      UiButton(type="submit" look="info") Save
      UiButton(@click="cancelEdit" look="inline") Cancel

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import UiButton from '@/components/ui/Button.vue';

const props = defineProps<{
  trainer: { id: string; title: string; text: string }
}>();

const mockTrainer = {
  id: '',
  title: '',
  text: '',
};

const emit = defineEmits(['trainerUpdated', 'cancelEdit']);

const editableTrainer = ref({ ...props.trainer || mockTrainer });

watch(() => props.trainer, (newTrainer) => {
  editableTrainer.value = { ...newTrainer };
});

const submitForm = () => {
  emit('trainerUpdated', editableTrainer.value);
};

const cancelEdit = () => {
  emit('cancelEdit');
};
</script>

<style lang="scss">
.edit-trainer-form {
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