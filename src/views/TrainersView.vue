<script setup lang="ts">
import { ref,onMounted } from 'vue';

import { trainersEndpoint } from '@/constants';
import { useFetchData } from '@/composables/useFetchData';
import { useCreateItem } from '@/composables/useCreateItem';
import { useUpdateItem } from '@/composables/useUpdateItem';
import { useDeleteItem } from '@/composables/useDeleteItem';

import UiButton from '@/components/ui/Button.vue'
import UiLink from '@/components/ui/Link.vue'
import Spinner from '@/components/Spinner.vue';
import EditTrainerForm from '@/components/EditTrainerForm.vue';
import AddTrainerForm from '@/components/AddTrainerForm.vue';
import UiModal from "@/components/ui/Modal.vue";

interface Trainer {
  id: string;
  title: string;
  text: string;
}

const trainers = ref<Trainer[]>([]);

const isShowAddItemForm = ref(false);

const isEditing = ref(false);
const trainerToEdit = ref<Trainer | null>(null);

const {
  data: trainersData, error, isLoading: isTrainersLoading, maxId, fetchData
} = useFetchData<Trainer>(trainersEndpoint);

onMounted(async () => {
  await fetchData();

  if (trainersData.value) {
    trainers.value = trainersData.value;
  }
});

const { isLoading: isCreateItemLoading, createItem: addNewTrainer } = useCreateItem<Trainer>(trainersEndpoint);

const handleAddTrainer = async (newItem: Trainer) => {
  await addNewTrainer(newItem, (addedItem: Trainer) => {
    trainers.value.push(addedItem);
  });
};

const { updateItem } = useUpdateItem<Trainer>(trainersEndpoint, trainers, isEditing, trainerToEdit);

const handleUpdateTrainer = async (updatedTrainer: Trainer) => {
  await updateItem(updatedTrainer);
};

const handleEditTrainer = (trainer: Trainer) => {
  trainerToEdit.value = { ...trainer };
};

const handleCancelEdit = () => {
  isEditing.value = false;
  trainerToEdit.value = null;
};

const {
  deleteItem: deleteTrainer, isDeleteDisabled, error: errorDeleteItem
} = useDeleteItem<Trainer>(trainersEndpoint, trainers);

const handleDeleteTrainer = async (id: string) => {
  await deleteTrainer(id);
};

</script>

<template lang="pug">
.trainers-view
  Spinner(v-if="isTrainersLoading")

  template(v-else)
    .trainers-view__header
      h1 Trainers

      UiButton.trainers-view__show-form-btn(
        @click="isShowAddItemForm = !isShowAddItemForm"
      ) Add New Trainer

    AddTrainerForm(
      v-show="isShowAddItemForm"
      :max-id="maxId"
      @trainer-added="handleAddTrainer"
    )

    .trainers-view__list
      .trainers-view__list-item(
        v-for="trainer in trainers"
        :key="trainer.id"
      )
        .trainers-view__name {{ trainer.id }}. {{ trainer.title }}

        .trainers-view__actions
          UiLink.trainers-view__actions-view(
            title="View Trainer"
            :to="{ name: 'trainer-detail', params: { id: trainer.id } }"
          ) View

          UiButton(
            :disabled="isEditing && trainerToEdit === trainer.id"
            title="Edit Trainer"
            look="edit"
            popovertarget="popover"
            popovertargetaction="toggle"
            @click="handleEditTrainer(trainer)"
          ) Edit

          UiButton(
            :disabled="isDeleteDisabled"
            title="Delete Trainer"
            look="delete"
            @click="handleDeleteTrainer(trainer.id)"
          ) Delete

        UiModal#popover(
          v-if="trainerToEdit && trainerToEdit.id === trainer.id"
          popover
        )
          h2.trainers-view__modal-title Editing: {{trainer.title}}

          EditTrainerForm(
            :trainer="trainerToEdit"
            @trainer-updated="handleUpdateTrainer"
            @cancel-edit="handleCancelEdit"
          )

</template>

<style lang="scss">
.trainers-view {
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
