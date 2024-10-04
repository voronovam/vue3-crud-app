<script setup lang="ts">
import { ref,onMounted } from 'vue';

import { areasEndpoint } from '@/constants';
import { useFetchData } from '@/composables/useFetchData';
import { useCreateItem } from '@/composables/useCreateItem';
import { useUpdateItem } from '@/composables/useUpdateItem';
import { useDeleteItem } from '@/composables/useDeleteItem';

import UiButton from '@/components/ui/Button.vue'
import UiLink from '@/components/ui/Link.vue'
import Spinner from '@/components/Spinner.vue';
import AddAreaForm from '@/components/AddAreaForm.vue';
import EditAreaForm from '@/components/EditAreaForm.vue';
import UiModal from "@/components/ui/Modal.vue";

export interface Area {
  id: string;
  title: string;
  text: string;
}

const areas = ref<Area[]>([]);

const isShowAddItemForm = ref(false);

const isEditing = ref(false);
const areaToEdit = ref<Area | null>(null);

const {
  data: areasData, error, isLoading: isAreasLoading, maxId, fetchData
} = useFetchData<Area>(areasEndpoint);

onMounted(async () => {
  await fetchData();

  if (areasData.value) {
    areas.value = areasData.value;
  }
});

const { isLoading: isCreateItemLoading, createItem: addNewArea } = useCreateItem<Area>(areasEndpoint);

const handleAddArea = async (newItem: Area) => {
  await addNewArea(newItem, (addedItem: Area) => {
    areas.value.push(addedItem);
  });
};

const { updateItem } = useUpdateItem<Area>(areasEndpoint, areas, isEditing, areaToEdit);

const handleUpdateArea = async (updatedArea: Area) => {
  await updateItem(updatedArea);
};

const handleEditArea = (area: Area) => {
  areaToEdit.value = { ...area };
};

const handleCancelEdit = () => {
  isEditing.value = false;
  areaToEdit.value = null;
};

const {
  deleteItem: deleteArea, isDeleteDisabled, error: errorDeleteItem
} = useDeleteItem<Area>(areasEndpoint, areas);

const handleDeleteArea = async (id: string) => {
  await deleteArea(id);
};

</script>

<template lang="pug">
.areas-view
  Spinner(v-if="isAreasLoading")

  template(v-else)
    .areas-view__header
      h1 Areas

      UiButton.areas-view__show-form-btn(
        @click="isShowAddItemForm = !isShowAddItemForm"
      ) Add New Area

    AddAreaForm(
      v-show="isShowAddItemForm"
      :max-id="maxId"
      @area-added="handleAddArea"
    )

    .areas-view__list
      .areas-view__list-item(
        v-for="area in areas"
        :key="area.id"
      )
        .areas-view__name {{ area.id }}. {{ area.title }}

        .areas-view__actions
          UiLink.areas-view__actions-view(
            title="View Area"
            :to="{ name: 'area-detail', params: { id: area.id } }"
          ) View

          UiButton(
            :disabled="isEditing && areaToEdit === area.id"
            title="Edit Area"
            look="edit"
            popovertarget="popover"
            popovertargetaction="toggle"
            @click="handleEditArea(area)"
          ) Edit

          UiButton(
            :disabled="isDeleteDisabled"
            title="Delete Area"
            look="delete"
            @click="handleDeleteArea(area.id)"
          ) Delete

        UiModal#popover(
          v-if="areaToEdit && areaToEdit.id === area.id"
          popover
        )
          h2.areas-view__modal-title Editing: {{area.title}}

          EditAreaForm(
            :area="areaToEdit"
            @area-updated="handleUpdateArea"
            @cancel-edit="handleCancelEdit"
          )

</template>

<style lang="scss">
.areas-view {
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