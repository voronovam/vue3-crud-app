<script setup lang="ts">
import { ref,onMounted } from 'vue';
import { areasEndpoint } from '@/constants';
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
const isLoading = ref(true);
const isEditDisabled = ref(false);
const isDeleteDisabled = ref(false);
const isShowForm = ref(false);
const isEditing = ref(false);
const areaToEdit = ref<Area | null>(null);

const maxId = ref(0);

async function fetchAreas(url: string) {
  try {
    isLoading.value = true;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    areas.value = data;

    maxId.value = Math.max(...data.map((area: Area) => Number(area.id)));

  } catch(error) {
    console.error('Error fetching areas: ', error)
  } finally {
    isLoading.value = false;
  }
}
onMounted(() => fetchAreas(areasEndpoint));

const addNewArea = async (newArea: Area) => {
  try {
    const response = await fetch(areasEndpoint, {
      method: 'POST',
      body: JSON.stringify(newArea),
    });

    if (!response.ok) {
      throw new Error('Error adding new area');
    }

    const addedArea = await response.json();
    areas.value.push(addedArea);
  } catch (error) {
    console.error('Error adding new area:', error);
  }
};

const handleEditArea = (area: Area) => {
  isEditing.value = true;
  areaToEdit.value = { ...area };
};

const updateArea = async (updatedArea: Area) => {
  try {
    isEditDisabled.value = true;
    const response = await fetch(`${areasEndpoint}/${updatedArea.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedArea),
    });

    if (!response.ok) {
      throw new Error('Error updating area');
    }

    const index = areas.value.findIndex(area => area.id === updatedArea.id);
    if (index !== -1) {
      areas.value[index] = updatedArea;
    }

    isEditing.value = false;
    areaToEdit.value = null;
  } catch (error) {
    console.error('Error updating area:', error);
  } finally {
    isEditDisabled.value = false;
  }
};

const handleCancelEdit = () => {
  isEditing.value = false;
  areaToEdit.value = null;
};

const handleDeleteArea = async (id: string) => {
  const isConfirmed = window.confirm('Delete this area?');

  if (!isConfirmed) {
    return;
  }

  try {
    isDeleteDisabled.value = true;
    const response = await fetch(`${areasEndpoint}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error deleting area');
    }

    areas.value = areas.value.filter(area => area.id !== id);
  } catch (error) {
    console.error('Error deleting area:', error);
  } finally {
    isDeleteDisabled.value = false;
  }
};

</script>

<template lang="pug">
.areas-view
  Spinner(v-if="isLoading")

  template(v-else)
    .areas-view__header
      h1 Areas

      UiButton.areas-view__show-form-btn(
        @click="isShowForm = !isShowForm"
      ) Add New Area

    AddAreaForm(
      v-show="isShowForm"
      :max-id="maxId"
      @area-added="addNewArea"
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
            :disabled="isEditDisabled"
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
            @area-updated="updateArea"
            @cancelEdit="handleCancelEdit"
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