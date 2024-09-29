<template lang="pug">
.edit-club-form
  form(@submit.prevent="submitForm")
    input(type="text" v-model="editableClub.title" placeholder="Club name" required)
    UiButton(type="submit") Save
    UiButton(@click="cancelEdit") Cancel

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

</style>