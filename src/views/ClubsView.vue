<script setup lang="ts">
import { ref,onMounted } from 'vue';
import { clubsEndpoint } from '@/constants';
import UiButton from '@/components/ui/Button.vue'
import UiLink from '@/components/ui/Link.vue'
import Spinner from '@/components/Spinner.vue';
import AddClubForm from '@/components/AddClubForm.vue';
import EditClubForm from '@/components/EditClubForm.vue';

interface Club {
  id: string;
  title: string;
  schedules_id: number;
}

const clubs = ref<Club[]>([]);
const isLoading = ref(true);
const isEditDisabled = ref(false);
const isDeleteDisabled = ref(false);
const isShowForm = ref(false);
const isEditing = ref(false);
const clubToEdit = ref<Club | null>(null);

const maxId = ref(0);
const maxSchedulesId = ref(0);

async function fetchClubs(url: string) {
  try {
    isLoading.value = true;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    clubs.value = data;

    maxId.value = Math.max(...data.map((club: Club) => Number(club.id)));
    maxSchedulesId.value = Math.max(...data.map((club: Club) => club.schedules_id));

  } catch(error) {
    console.error('Error fetching clubs: ', error)
  } finally {
    isLoading.value = false;
  }
}
onMounted(() => fetchClubs(clubsEndpoint));

const addNewClub = async (newClub: Club) => {
  try {
    const response = await fetch(clubsEndpoint, {
      method: 'POST',
      body: JSON.stringify(newClub),
    });

    if (!response.ok) {
      throw new Error('Error adding new club');
    }

    const addedClub = await response.json();
    clubs.value.push(addedClub);
  } catch (error) {
    console.error('Error adding new club:', error);
  }
};

const handleEditClub = (club: Club) => {
  isEditing.value = true;
  clubToEdit.value = { ...club };
};

const updateClub = async (updatedClub: Club) => {
  try {
    isEditDisabled.value = true;
    const response = await fetch(`${clubsEndpoint}/${updatedClub.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedClub),
    });

    if (!response.ok) {
      throw new Error('Error updating club');
    }

    const index = clubs.value.findIndex(club => club.id === updatedClub.id);
    if (index !== -1) {
      clubs.value[index] = updatedClub;
    }

    isEditing.value = false;
    clubToEdit.value = null;
  } catch (error) {
    console.error('Error updating club:', error);
  } finally {
    isEditDisabled.value = false;
  }
};

const handleCancelEdit = () => {
  isEditing.value = false;
  clubToEdit.value = null;
};

const handleDeleteClub = async (id: string) => {
  const isConfirmed = window.confirm('Delete this club?');

  if (!isConfirmed) {
    return;
  }

  try {
    isDeleteDisabled.value = true;
    const response = await fetch(`${clubsEndpoint}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error deleting club');
    }

    clubs.value = clubs.value.filter(club => club.id !== id);
  } catch (error) {
    console.error('Error deleting club:', error);
  } finally {
    isDeleteDisabled.value = false;
  }
};

</script>

<template lang="pug">
.clubs-view
  Spinner(v-if="isLoading")

  template(v-else)
    .clubs-view__header
      h1 Clubs

      UiButton.clubs-view__show-form-btn(
        @click="isShowForm = !isShowForm"
      ) Add New Club

    AddClubForm(
      v-show="isShowForm"
      :maxId="maxId"
      :maxSchedulesId="maxSchedulesId"
      @clubAdded="addNewClub"
    )

    .clubs-view__list
      .clubs-view__list-item(
        v-for="club in clubs"
        :key="club.id"
      )
        .clubs-view__name {{ club.id }}. {{ club.title }}

        EditClubForm(
          v-if="clubToEdit && clubToEdit.id === club.id"
          :club="clubToEdit"
          @clubUpdated="updateClub"
          @cancelEdit="handleCancelEdit"
        )

        .clubs-view__actions
          UiLink.clubs-view__actions-view(title="View Club" :to="{ name: 'club-detail', params: { id: club.id } }") View
          UiButton(:disabled="isEditDisabled" title="Edit Club" look="edit" @click="handleEditClub(club)") Edit
          UiButton(:disabled="isDeleteDisabled" title="Delete Club" look="delete" @click="handleDeleteClub(club.id)") Delete

  pre {{clubs}}
</template>

<style lang="scss">
.clubs-view {
  padding: 24px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__list {
    display: flex;
    flex-direction: column;
    grid-gap: 8px;
    margin-top: 24px;
  }

  &__name {
    font-size: 22px;
  }

  &__list-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 16px 8px;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
  }

  &__actions {
    display: flex;
    grid-gap: 8px;
  }

  &__actions-view {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    border-radius: var(--border-radius);
    border: 1px solid var(--success-color);
    color: var(--success-color);
    padding: 4px 8px;

    &:hover, &:focus-visible {
      color: var(--success-color);
    }
  }

  &__show-form-btn {
    color: var(--accent-color);
    border-color: var(--accent-color);
    padding: 12px 18px;
    border-radius: var(--border-radius);
    transition: background-color .1s ease;

    &:hover, &:focus-visible {
      background-color: var(--accent-color);
      color: var(--white-color);
    }
  }
}
</style>
