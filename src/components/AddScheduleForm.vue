<script setup lang="ts">
import { ref } from 'vue';
import { daysOfWeek } from '@/constants'
import UiButton from '@/components/ui/Button.vue';

const props = defineProps<{
  areas: { id: string, title: string }[],
  trainers: { id: string, title: string }[],
  schedules: { id: string }[],
}>();

const emit = defineEmits(['scheduleAdded']);

export interface Schedule {
  id: string;
  club_id: number;
  week: number;
  time_start: string;
  time_end: string;
  area_id: number;
  trainer_id: number;
}

const newSchedule = ref<Schedule>({
  id: '',
  club_id: 0,
  week: 0,
  time_start: '',
  time_end: '',
  area_id: 0,
  trainer_id: 0,
});

const submitForm = () => {
  if (newSchedule.value.area_id && newSchedule.value.trainer_id && newSchedule.value.week) {
    const maxId = Math.max(...props.schedules.map(schedule => Number(schedule.id)), 0);
    newSchedule.value.id = String(maxId + 1);

    newSchedule.value.club_id = Number(newSchedule.value.club_id);
    newSchedule.value.week = Number(newSchedule.value.week);
    newSchedule.value.area_id = Number(newSchedule.value.area_id);
    newSchedule.value.trainer_id = Number(newSchedule.value.trainer_id);

    emit('scheduleAdded', { ...newSchedule.value });

    newSchedule.value = {
      id: '',
      club_id: 0,
      week: 0,
      time_start: '',
      time_end: '',
      area_id: 0,
      trainer_id: 0,
    };

  } else {
    alert('Fill all fields');
  }
};
</script>

<template lang="pug">
.add-schedule-form
  form(@submit.prevent="submitForm")
    .add-schedule-form__fields
      .add-schedule-form__fields-item
        label.add-schedule-form__label Area
        select(v-model="newSchedule.area_id" required)
          option(value="" disabled) Choose area
          option(v-for="area in areas" :key="area.id" :value="area.id") {{ area.title }}

      .add-schedule-form__fields-item
        label.add-schedule-form__label Trainer
        select(v-model="newSchedule.trainer_id" required)
          option(value="" disabled) Choose trainer
          option(v-for="trainer in trainers" :key="trainer.id" :value="trainer.id") {{ trainer.title }}

      .add-schedule-form__fields-item
        label.add-schedule-form__label Day of week
        select(v-model="newSchedule.week" required)
          option(value="" disabled) Choose day
          option(v-for="(day, index) in daysOfWeek" :key="index" :value="index + 1") {{ day }}

      .add-schedule-form__fields-item
        label.add-schedule-form__label Start time
        input(type="time" v-model="newSchedule.time_start" required)

      .add-schedule-form__fields-item
        label.add-schedule-form__label End time
        input(type="time" v-model="newSchedule.time_end" required)

    UiButton.add-schedule-form__btn(type="submit" look="info" ) save

</template>

<style lang="scss">
.add-schedule-form {
  &__fields {
    display: flex;
    flex-direction: column;
    grid-gap: 16px;
  }

  &__label {
    color: var(--text-color);
  }

  &__fields-item {
    display: flex;
    flex-direction: column;
    grid-gap: 8px;

    & input, & select {
      padding: 8px 4px;
    }
  }

  &__btn {
    margin-top: 24px;
    display: flex;
    margin-left: auto;
  }
}
</style>