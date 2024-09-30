<template lang="pug">
.edit-club-form
  form(@submit.prevent="submitForm")
    label.edit-club-form__label Name
    input.edit-club-form__field(type="text" v-model="editableClub.title" placeholder="Club name" required)

    .edit-club-form__actions
      UiButton(type="submit" look="info") Save
      UiButton(@click="cancelEdit" look="inline") Cancel

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import UiButton from '@/components/ui/Button.vue';

const props = defineProps<{
  club: { id: string; title: string; schedules_id: number }
}>();

const defaultClub = {
  id: '',
  title: '',
  schedules_id: 0,
};

const emit = defineEmits(['clubUpdated', 'cancelEdit']);

const editableClub = ref({ ...props.club || defaultClub });

watch(() => props.club, (newClub) => {
  editableClub.value = { ...newClub };
});

const submitForm = () => {
  emit('clubUpdated', editableClub.value);
};

const cancelEdit = () => {
  emit('cancelEdit');
};
</script>

<style lang="scss">
.edit-club-form {
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