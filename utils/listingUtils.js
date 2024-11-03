// utils/listingUtils.js

export const unpublishListing = async (listingId, token) => {
    try {
        const response = await fetch(`/api/listings/${listingId}/unpublish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при снятии с публикации.');
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка:', error);
        throw error;
    }
};

export const publishListing = async (listingId, token) => {
    try {
        const response = await fetch(`/api/listings/${listingId}/publish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при публикации.');
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка:', error);
        throw error;
    }
};
