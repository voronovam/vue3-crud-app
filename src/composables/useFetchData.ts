import { ref } from 'vue';

export function useFetchData<T extends { id: string | number }>(url: string) {
    const data = ref<T[]>([]);
    const error = ref<string | null>(null);
    const isLoading = ref(false);
    const maxId = ref<number | null>(0);
    const maxSchedulesId = ref<number | null>(0);

    const fetchData = async () => {
        isLoading.value = true;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching data from ${url}`);
            }

            data.value = await response.json();

            maxId.value = Math.max(...data.value.map(item => Number(item.id)), 0);

            if (data.value.some((item: any) => 'schedules_id' in item)) {
                maxSchedulesId.value = Math.max(
                    ...data.value.map((item: any) => (item.schedules_id ?? 0)), 0 );
            } else {
                maxSchedulesId.value = 0;
            }

        } catch (err) {
            error.value = (err as Error).message;
        } finally {
            isLoading.value = false;
        }
    };

    return { data, error, isLoading, maxId, maxSchedulesId, fetchData };
}
