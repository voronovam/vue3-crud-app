<script setup lang="ts">
import { ref,onMounted } from 'vue';

import { clubsEndpoint } from '@/constants';
import { useFetchData } from '@/composables/useFetchData';
import { useCreateItem } from '@/composables/useCreateItem';
import { useUpdateItem } from '@/composables/useUpdateItem';
import { useDeleteItem } from '@/composables/useDeleteItem';

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

const isShowAddItemForm = ref(false);

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

const { isLoading: isCreateItemLoading, createItem: addNewClub } = useCreateItem<Club>(clubsEndpoint);

const handleAddClub = async (newClub: Club) => {
  await addNewClub(newClub, (addedClub: Club) => {
    clubs.value.push(addedClub);
  });
};

const { updateItem } = useUpdateItem<Club>(clubsEndpoint, clubs, isEditing, clubToEdit);

const handleUpdateClub = async (updatedClub: Club) => {
  await updateItem(updatedClub);
};

const handleEditClub = (club: Club) => {
  clubToEdit.value = { ...club };
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
        @click="isShowAddItemForm = !isShowAddItemForm"
      ) Add New Club

    AddClubForm(
      v-show="isShowAddItemForm"
      :max-id="maxId"
      :maxSchedulesId="maxSchedulesId"
      @clubAdded="handleAddClub"
    )

    .clubs-view__list
      .clubs-view__list-item(
        v-for="club in clubs"
        :key="club.id"
      )
        .clubs-view__name {{ club.id }}. {{ club.title }}

        .clubs-view__actions
          UiLink.clubs-view__actions-view(
            title="View Club"
            :to="{ name: 'club-detail', params: { id: club.id } }"
          ) View

          UiButton(
            :disabled="isEditing && clubToEdit === club.id"
            title="Edit Club"
            look="edit"
            popovertarget="popover"
            popovertargetaction="toggle"
            @click="handleEditClub(club)"
          ) Edit

          UiButton(
            :disabled="isDeleteDisabled"
            title="Delete Club"
            look="delete"
            @click="handleDeleteClub(club.id)"
          ) Delete

        UiModal#popover(
          v-if="clubToEdit && clubToEdit.id === club.id"
          popover
        )
          h2.clubs-view__modal-title Editing: {{club.title}}

          EditClubForm(
            :club="clubToEdit"
            @club-updated="handleUpdateClub"
            @cancel-edit="handleCancelEdit"
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
