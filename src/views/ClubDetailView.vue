<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { clubsEndpoint, schedulesEndpoint, areasEndpoint, trainersEndpoint, daysOfWeek } from '@/constants'
import UiLink from '@/components/ui/Link.vue'
import UiButton from '@/components/ui/Button.vue'
import UiModal from '@/components/ui/Modal.vue'
import AddScheduleForm from '@/components/AddScheduleForm.vue'

const route = useRoute();
const club = ref({ id: '', title: '', schedules_id: 0 });
const schedules = ref([]);
const areas = ref([]);
const trainers = ref([]);
const isShowForm = ref(false);
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
  schedules.value.sort((a, b) => a.time_start.localeCompare(b.time_start));
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

const addNewSchedule = async (newSchedule) => {
  try {
    newSchedule.club_id = Number(club.value.id);

    const maxId = Math.max(...schedules.value.map(schedule => Number(schedule.id)), 0);
    newSchedule.id = (maxId + 1).toString();

    const response = await fetch(schedulesEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSchedule),
    });

    if (!response.ok) {
      throw new Error('Error added schedule');
    }

    const addedSchedule = await response.json();

    addedSchedule.club_id = Number(addedSchedule.club_id);
    addedSchedule.week = Number(addedSchedule.week);
    addedSchedule.area_id = Number(addedSchedule.area_id);
    addedSchedule.trainer_id = Number(addedSchedule.trainer_id);

    schedules.value.push(addedSchedule);
    isShowForm.value = false;

    schedules.value.sort((a, b) => a.time_start.localeCompare(b.time_start));
    uniqueTimes.value = [...new Set(schedules.value.map(schedule => schedule.time_start))];
  } catch (error) {
    console.error('Error added schedule:', error);
  }
};

</script>

<template lang="pug">
.club-detail-view
  UiLink.club-detail-view__back-btn(to="/") ←

  .club-detail-view__head
    h1 {{ club.title }}

    UiButton.club-detail-view__show-form-btn(
      popovertarget="popover"
      popovertargetaction="toggle"
      @click="isShowForm = !isShowForm"
    ) Add Schedule

    UiModal#popover(
      v-show="isShowForm"
      popover
    )
      h2.club-detail-view__modal-title Add Schedule

      AddScheduleForm(
        :areas="areas"
        :trainers="trainers"
        :schedules="schedules"
        @scheduleAdded="addNewSchedule"
      )

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

  &__back-btn {
    display: inline-block;
    text-decoration: none;
    margin-bottom: 16px;
  }

  &__head {
    display: flex;
    justify-content: space-between;
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

  &__show-form-btn {
    color: var(--info-color);
    border-color: var(--info-color);
    padding: 12px 18px;
    border-radius: var(--border-radius);
    transition: background-color .1s ease;

    &:hover, &:focus-visible {
      background-color: var(--info-color-hover);
      color: var(--white-color);
    }
  }

  &__modal-title {
    color: var(--text-color);
    margin-bottom: 24px;
  }
}
</style>