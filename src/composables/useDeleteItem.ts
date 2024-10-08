import { ref } from 'vue';
import type { Ref } from 'vue';

interface HasId {
    id: string;
}

export function useDeleteItem<T extends HasId>(url: string, items: Ref<T[]>) {
    const isDeleteDisabled = ref(false);
    const error = ref<string | null>(null);

    const deleteItem = async (id: string) => {
        const isConfirmed = window.confirm('Delete this item?');

        if (!isConfirmed) {
            return;
        }

        try {
            isDeleteDisabled.value = true;
            const response = await fetch(`${url}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Error deleting item from ${url}`);
            }

            items.value = items.value.filter(item => item.id !== id);
        } catch (err) {
            error.value = (err as Error).message;
        } finally {
            isDeleteDisabled.value = false;
        }
    };

    return { deleteItem, isDeleteDisabled, error };
}
