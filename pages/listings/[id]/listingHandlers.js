// listingHandlers.js
import { unpublishListing } from '../../../utils/unpublishListing';
import publishListing from '../../../utils/publishListing';


export const onUnpublish = async (listingId, setListing, setError) => {
    try {
        const updatedListing = await unpublishListing(listingId);
        setListing(updatedListing);
    } catch (err) {
        setError(err.message); // обработка ошибки с setError
    }
};

export const onPublish = async (listingId, setListing, setError) => {
    try {
        const updatedListing = await publishListing(listingId);
        setListing(updatedListing);
    } catch (err) {
        setError(err.message); // обработка ошибки с setError
    }
};




export const handleResponseSubmit = async (message, user, setModalContent, setIsModalOpen, setResponses) => {
    if (!user) {
        setModalContent({
            type: 'error',
            message: 'Вы должны быть авторизованы для отправки отклика.',
        });
        setIsModalOpen(true);
        return;
    }

    setLoadingModal(true); // Начинаем загрузку в модальном окне
    try {
        const response = await fetch('/api/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                listingId: id,
                message: message,
            }),
        });

        if (response.ok) {
            const newResponse = await response.json();
            setResponses((prevResponses) => [...prevResponses, newResponse]);
            setModalContent({
                type: 'success',
                message: 'Отклик успешно отправлен!',
            });
        } else {
            const errorData = await response.json();
            setModalContent({
                type: 'error',
                message: errorData.message,
            });
        }
    } catch (error) {
        setModalContent({
            type: 'error',
            message: `Ошибка сети: ${error.message}`,
        });
    } finally {
        setLoadingModal(false); // Завершаем загрузку в модальном окне
        setIsModalOpen(true);
    }
};



export const handleOpenResponseForm = (user, setModalContent, setIsModalOpen) => {
    if (!user) {
        setModalContent({
            type: 'error',
            message: 'Отклики доступны только для авторизованных пользователей.',
        });
    } else if (!user.company && !user.companyId) {
        // Проверяем наличие компании по companyId, если объект company равен null
        setModalContent({
            type: 'error',
            message: 'Вы не можете откликаться, так как у вас нет привязанной компании.',
        });
    } else if (user.points <= 0) {
        setModalContent({
            type: 'error',
            message: 'У вас недостаточно баллов для отправки отклика.',
        });
    } else {
        setModalContent({
            type: 'form',
            message: 'Заполните форму для отклика:',
        });
    }
    setIsModalOpen(true);
};






export const handleReviewSubmit = async (reviewData) => {
    if (!user) {
        setModalContent({
            type: 'error',
            message: 'Вы должны быть авторизованы для отправки отзыва.',
        });
        setIsModalOpen(true);
        return;
    }

    // Проверяем, был ли уже отправлен отзыв
    if (hasSubmittedReview) {
        setModalContent({
            type: 'error',
            message: 'Вы уже отправили отзыв для этого объявления.',
        });
        setIsModalOpen(true);
        return;
    }

    setLoadingModal(true);
    try {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                companyId: listing.author?.company?.id,
                rating: reviewData.rating,
                comment: reviewData.comment,
            }),
        });

        if (response.ok) {
            const newReview = await response.json();
            setReviews((prevReviews) => [...prevReviews, newReview]);
            setHasSubmittedReview(true); // Устанавливаем, что отзыв отправлен
            setModalContent({
                type: 'success',
                message: 'Отзыв успешно отправлен! Как только мы его проверим, он обязательно появится.',
            });
        } else {
            const errorData = await response.json();
            setModalContent({
                type: 'error',
                message: errorData.message,
            });
        }
    } catch (error) {
        setModalContent({
            type: 'error',
            message: `Ошибка сети: ${error.message}`,
        });
    } finally {
        setLoadingModal(false);
        setIsModalOpen(true);
    }
};


