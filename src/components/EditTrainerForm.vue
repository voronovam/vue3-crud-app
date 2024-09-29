<template lang="pug">
.edit-trainer-form
  form(@submit.prevent="submitForm")
    input(type="text" v-model="editableTrainer.title" placeholder="Trainer name" required)
    UiButton(type="submit") Save
    UiButton(@click="cancelEdit") Cancel

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