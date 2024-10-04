import { ref } from 'vue';
import type { Ref } from 'vue';

interface HasId {
    id: string;
}

export function useUpdateItem<T extends HasId>(
    url: string, items: Ref<T[]>, isEditing: Ref<boolean>, itemToEdit: Ref<T | null>
) {
    const isEditDisabled = ref(false);
    const error = ref<string | null>(null);

    const updateItem = async (updatedItem: T) => {
        try {
            isEditDisabled.value = true;

            const response = await fetch(`${url}/${updatedItem.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem),
            });

            if (!response.ok) {
                throw new Error(`Error updating item from ${url}`);
            }

            const index = items.value.findIndex(item => item.id === updatedItem.id);
            if (index !== -1) {
                items.value[index] = updatedItem;
            }

            isEditing.value = false;
            itemToEdit.value = null;

        } catch (err) {
            error.value = (err as Error).message;
        } finally {
            isEditDisabled.value = false;
        }
    };

    return { updateItem, isEditDisabled, error };
}
