<template lang="pug">
.add-area-form
  form(@submit.prevent="submitForm")
    input.add-area-form__input(type="text" v-model="newArea.title" placeholder="Area name" required)
    input(type="hidden" v-model="newArea.id")
    UiButton.add-area-form__btn(type="submit") Add

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import UiButton from '@/components/ui/Button.vue'

const props = defineProps<{
  maxId: number,
}>()

const emit = defineEmits(['areaAdded']);

const newArea = ref<{ title: string; id: string }>({
  title: '',
  id: (props.maxId + 1).toString(),
});

watch(() => props.maxId, (newValue) => {
  newArea.value.id = (newValue + 1).toString();
});

const submitForm = () => {
  if (newArea.value.title) {
    emit('areaAdded', newArea.value);
    newArea.value.title = '';
    newArea.value.id = (Number(newArea.value.id) + 1).toString();
  } else {
    alert('Fill the field');
  }
};
</script>

<style lang="scss">
.add-area-form {
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
    background-color: var(--accent-color);
    color: var(--light-color);

    &:hover, &:focus-visible {
      background-color: var(--accent-color-hover);
    }
  }
}
</style>