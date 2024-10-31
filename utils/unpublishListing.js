export const unpublishListing = async (listingId) => {
    try {
        const response = await fetch('/api/publisher/unpublishListing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ listingId }),
        });

        if (response.ok) {
            const updatedListing = await response.json();
            return updatedListing; // Возвращаем обновленное объявление
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при снятии объявления с публикации.'); // Генерируем ошибку, если ответ не успешен
        }
    } catch (err) {
        throw new Error('Ошибка при снятии объявления с публикации: ' + err.message); // Обрабатываем ошибку
    }
};
