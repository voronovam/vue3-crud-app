<template lang="pug">
.add-trainer-form
  form(@submit.prevent="submitForm")
    input.add-trainer-form__input(type="text" v-model="newTrainer.title" placeholder="Trainer name" required)
    input(type="hidden" v-model="newTrainer.id")
    UiButton.add-trainer-form__btn(type="submit") Add

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import UiButton from '@/components/ui/Button.vue'

const props = defineProps<{
  maxId: number,
}>()

const emit = defineEmits(['trainerAdded']);

const newTrainer = ref<{ title: string; id: string }>({
  title: '',
  id: (props.maxId + 1).toString()
});

watch(() => props.maxId, (newValue) => {
  newTrainer.value.id = (newValue + 1).toString();
});

const submitForm = () => {
  if (newTrainer.value.title) {
    emit('trainerAdded', newTrainer.value);
    newTrainer.value.title = '';
  } else {
    alert('Fill the field');
  }
};
</script>

<style lang="scss">
.add-trainer-form {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;

  &__input {
    padding: 8px;
    border-radius: var(--border-radius);
    min-width: 300px;
  }

  &__btn {
    padding: 8px;
    border-radius: var(--border-radius);
    background-color: var(--info-color);
    border-color: var(--info-color);
    color: var(--light-color);

    &:hover, &:focus-visible {
      background-color: var(--info-color-hover);
    }
  }
}
</style>