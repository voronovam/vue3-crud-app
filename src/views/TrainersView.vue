<script setup lang="ts">
import { ref,onMounted } from 'vue';
import { trainersEndpoint } from '@/constants';
import { useFetchData } from '@/composables/useFetchData';
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
const isEditDisabled = ref(false);

const isShowForm = ref(false);
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


const addNewTrainer = async (newTrainer: Trainer) => {
  try {
    const response = await fetch(trainersEndpoint, {
      method: 'POST',
      body: JSON.stringify(newTrainer),
    });

    if (!response.ok) {
      throw new Error('Error adding new trainer');
    }

    const addedTrainer = await response.json();
    trainers.value.push(addedTrainer);
  } catch (error) {
    console.error('Error adding new trainer:', error);
  }
};

const handleEditTrainer = (trainer: Trainer) => {
  isEditing.value = true;
  trainerToEdit.value = { ...trainer };
};

const updateTrainer = async (updated: Trainer) => {
  try {
    isEditDisabled.value = true;
    const response = await fetch(`${trainersEndpoint}/${updated.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updated),
    });

    if (!response.ok) {
      throw new Error('Error updating trainer');
    }

    const index = trainers.value.findIndex((trainer: Trainer) => trainer.id === updated.id);
    if (index !== -1) {
      trainers.value[index] = updated;
    }

    isEditing.value = false;
    trainerToEdit.value = null;
  } catch (error) {
    console.error('Error updating trainer:', error);
  } finally {
    isEditDisabled.value = false;
  }
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
        @click="isShowForm = !isShowForm"
      ) Add New Trainer

    AddTrainerForm(
      v-show="isShowForm"
      :max-id="maxId"
      @trainer-added="addNewTrainer"
    )

    .trainers-view__list
      .trainers-view__list-item(
        v-for="trainer in trainers"
        :key="trainer.id"
      )
        .trainers-view__name {{ trainer.id }}. {{ trainer.title }}

        .trainers-view__actions
          UiLink.trainers-view__actions-view(title="View Trainer" :to="{ name: 'trainer-detail', params: { id: trainer.id } }") View
          UiButton(
            :disabled="isEditDisabled"
            title="Edit Trainer"
            look="edit"
            popovertarget="popover"
            popovertargetaction="toggle"
            @click="handleEditTrainer(trainer)"
          ) Edit
          UiButton(:disabled="isDeleteDisabled" title="Delete Trainer" look="delete" @click="handleDeleteTrainer(trainer.id)") Delete

        UiModal#popover(
          v-if="trainerToEdit && trainerToEdit.id === trainer.id"
          popover
        )
          h2.clubs-view__modal-title Editing: {{trainer.title}}

          EditTrainerForm(
            :trainer="trainerToEdit"
            @trainer-updated="updateTrainer"
            @cancelEdit="handleCancelEdit"
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
}
</style>
