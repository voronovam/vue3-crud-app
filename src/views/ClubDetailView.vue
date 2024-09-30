<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { clubsEndpoint, schedulesEndpoint, areasEndpoint, trainersEndpoint } from '@/constants';

const route = useRoute();
const club = ref({ id: '', title: '', schedules_id: 0 });
const schedules = ref([]);
const areas = ref([]);
const trainers = ref([]);
const daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const weekDayMap = {
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
  sun: 7,
};

const uniqueTimes = ref<string[]>([]);

onMounted(async () => {
  const clubResponse = await fetch(`${clubsEndpoint}/${route.params.id}`);
  club.value = await clubResponse.json();

  const schedulesResponse = await fetch(`${schedulesEndpoint}?club_id=${club.value.id}`);
  schedules.value = await schedulesResponse.json();

  const areasResponse = await fetch(areasEndpoint);
  areas.value = await areasResponse.json();

  const trainersResponse = await fetch(trainersEndpoint);
  trainers.value = await trainersResponse.json();

  uniqueTimes.value = [...new Set(schedules.value.map(schedule => schedule.time_start))];
});

function getAreaTitle(time: string, day: string): string | null {
  const matchingSchedule = schedules.value.find(
      schedule => schedule.time_start === time && schedule.week === weekDayMap[day]
  );
  if (matchingSchedule) {
    const area = areas.value.find(area => area.id === String(matchingSchedule.area_id));
    return area ? area.title : null;
  }
  return null;
}

function getTrainerName(time: string, day: string): string | null {
  const matchingSchedule = schedules.value.find(
      schedule => schedule.time_start === time && schedule.week === weekDayMap[day]
  );
  if (matchingSchedule) {
    const trainer = trainers.value.find(trainer => trainer.id === String(matchingSchedule.trainer_id));
    return trainer ? trainer.title : null;
  }
  return null;
}
</script>

<template lang="pug">
.club-detail-view
  h1.club-detail-view__title {{ club.title }}

  table.club-detail-view__schedule
    thead
      tr
        th time
        th(v-for="day in daysOfWeek" :key="day") {{day}}

    tbody
      tr(v-for="time in uniqueTimes" :key="time")
        td {{ time }}

        td(v-for="day in daysOfWeek" :key="day")
          span(v-if="getAreaTitle(time, day)")
            | {{ getAreaTitle(time, day) }}
            br
            | {{ getTrainerName(time, day) }}

          span(v-else) -

</template>

<style lang="scss">
.club-detail-view {
  padding: 24px;

  &__title {
    margin-bottom: 24px;
  }

  &__schedule {
    width: 100%;
    border-collapse: collapse;

    & th,
    & td {
      border: 1px solid var(--border-color);
      padding: 8px;
      text-align: center;
    }
  }
}
</style>