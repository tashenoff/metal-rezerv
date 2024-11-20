import React from 'react';

const ReviewsList = ({ companyId, reviews }) => {
    if (!reviews || reviews.length === 0) {
        return <div className='card p-4 rounded-lg bg-base-100 my-5'>
            <div className='card-title'>
                Нет отзывов для этой компании.
            </div>
        </div>
    }

    // Сортируем отзывы по дате (последние отзывы идут первыми)
    const sortedReviews = [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Оставляем только первые 5 отзывов
    const latestReviews = sortedReviews.slice(0, 5);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`text-xl ${i <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="card p-4 rounded-lg bg-base-100 my-5">
            <h3 className='card-title mb-3'>Отзывы о компании:</h3>
            <ul>
                {latestReviews.map((review) => (
                    <li key={review.id} className="review-item my-2">
                        <div className="review-header">
                            {/* Проверяем, существует ли reviewer и его name */}
                            {review.reviewer ? (
                                <div className="reviewer-name">{review.reviewer.name}</div>
                            ) : (
                                <div className="reviewer-name">Неизвестный автор</div>
                            )}
                            <div className="review-rating">
                                {renderStars(review.rating)}
                            </div>
                        </div>
                        <div className="review-comment">{review.comment}</div>
                        <div className="review-date">
                            Дата отзыва: {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReviewsList;
