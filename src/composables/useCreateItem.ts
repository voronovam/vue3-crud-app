import { ref } from 'vue';

export function useCreateItem<T>(url: string) {
    const data = ref<T[]>([]);
    const error = ref<string | null>(null);
    const isLoading = ref(false);

    const createItem = async (newItem: T, updateData: (item: T) => void) => {
        isLoading.value = true;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });

            if (!response.ok) {
                throw new Error(`Error adding new item from ${url}`);
            }

            const addedItem = await response.json();
            data.value.push(addedItem);
            updateData(addedItem);

        } catch (err) {
            error.value = (err as Error).message;
        } finally {
            isLoading.value = false;
        }
    };

    return { error, isLoading, createItem };
}
