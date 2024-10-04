<script setup lang="ts">
import { ref,onMounted } from 'vue';
import { useFetchData } from '@/composables/useFetchData';
import { useDeleteItem } from '@/composables/useDeleteItem';
import { clubsEndpoint } from '@/constants';
import UiButton from '@/components/ui/Button.vue'
import UiLink from '@/components/ui/Link.vue'
import Spinner from '@/components/Spinner.vue';
import AddClubForm from '@/components/AddClubForm.vue';
import EditClubForm from '@/components/EditClubForm.vue';
import UiModal from "@/components/ui/Modal.vue";

interface Club {
  id: string;
  title: string;
  schedules_id: number;
}

const clubs = ref<Club[]>([]);
const isEditDisabled = ref(false);
const isShowForm = ref(false);
const isEditing = ref(false);
const clubToEdit = ref<Club | null>(null);

//TODO show fetch error message
const {
  data: clubsData, error: errorFetchData, isLoading: isClubsLoading, maxId, maxSchedulesId, fetchData
} = useFetchData<Club>(clubsEndpoint);

onMounted(async () => {
  await fetchData();

  if (clubsData.value) {
    clubs.value = clubsData.value;
  }
});

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

//TODO show delete error message
const { deleteItem: deleteClub, isDeleteDisabled, error: errorDeleteItem } = useDeleteItem<Club>(clubsEndpoint, clubs);

const handleDeleteClub = async (id: string) => {
  await deleteClub(id);
};

</script>

<template lang="pug">
.clubs-view
  Spinner(v-if="isClubsLoading")

  template(v-else)
    .clubs-view__header
      h1 Clubs

      UiButton.clubs-view__show-form-btn(
        @click="isShowForm = !isShowForm"
      ) Add New Club

    AddClubForm(
      v-show="isShowForm"
      :max-id="maxId"
      :maxSchedulesId="maxSchedulesId"
      @clubAdded="addNewClub"
    )

    .clubs-view__list
      .clubs-view__list-item(
        v-for="club in clubs"
        :key="club.id"
      )
        .clubs-view__name {{ club.id }}. {{ club.title }}

        .clubs-view__actions
          UiLink.clubs-view__actions-view(title="View Club" :to="{ name: 'club-detail', params: { id: club.id } }") View
          UiButton(
            :disabled="isEditDisabled"
            title="Edit Club"
            look="edit"
            popovertarget="popover"
            popovertargetaction="toggle"
            @click="handleEditClub(club)"
          ) Edit
          UiButton(:disabled="isDeleteDisabled" title="Delete Club" look="delete" @click="handleDeleteClub(club.id)") Delete

        UiModal#popover(
          v-if="clubToEdit && clubToEdit.id === club.id"
          popover
        )
          h2.clubs-view__modal-title Editing: {{club.title}}

          EditClubForm(
            :club="clubToEdit"
            @clubUpdated="updateClub"
            @cancelEdit="handleCancelEdit"
          )

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
    flex-direction: column;
    padding: 16px 8px;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);

    @include mobile-landscape {
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
    }
  }

  &__actions {
    display: flex;
    grid-gap: 8px;
    margin-top: 16px;
    justify-content: flex-end;

    @include mobile-landscape {
      margin-top: unset;
      justify-content: unset;
    }
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
      color: var(--white-color);
      background-color: var(--success-color);
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
    margin-bottom: 16px;
  }
}
</style>
