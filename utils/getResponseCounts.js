// utils/getResponseCounts.js

export const getResponseCounts = async (listings) => {
    const counts = {};
    for (const listing of listings) {
        const response = await fetch(`/api/responses/getResponsesCountByStatus?listingId=${listing.id}`);
        if (response.ok) {
            const data = await response.json();
            counts[listing.id] = data; // Сохраняем и общий счетчик, и распределение по статусам
        }
    }
    return counts;
};
