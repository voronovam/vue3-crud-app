<template lang="pug">
.add-club-form
  form(@submit.prevent="submitForm")
    input.add-club-form__input(type="text" v-model="newClub.title" placeholder="Club name" required)
    input(type="hidden" v-model="newClub.id")
    input(type="hidden" v-model="newClub.schedules_id")
    UiButton.add-club-form__btn(type="submit") Add

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import UiButton from '@/components/ui/Button.vue'

const props = defineProps<{
  maxId: number,
  maxSchedulesId: number,
}>()

const emit = defineEmits(['clubAdded']);

const newClub = ref<{ title: string; id: string; schedules_id: number }>({
  title: '',
  id: (props.maxId + 1).toString(),
  schedules_id: props.maxSchedulesId + 1,
});

watch(() => props.maxId, (newValue) => {
  newClub.value.id = (newValue + 1).toString();
});

watch(() => props.maxSchedulesId, (newValue) => {
  newClub.value.schedules_id = newValue + 1;
});

const submitForm = () => {
  if (newClub.value.title) {
    emit('clubAdded', newClub.value);
    newClub.value.title = '';
  } else {
    alert('Fill the field');
  }
};
</script>

<style lang="scss">
.add-club-form {
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