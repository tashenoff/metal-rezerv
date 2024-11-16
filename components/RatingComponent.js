import React, { useState } from 'react';

const RatingComponent = ({ onSubmitRating, initialRating = 0 }) => {
    const [rating, setRating] = useState(initialRating);
    const [comment, setComment] = useState('');

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleSubmit = () => {
        if (rating > 0) {
            onSubmitRating(rating, comment);
        } else {
            alert('Пожалуйста, выберите рейтинг');
        }
    };

    return (
        <div className="p-4 border rounded-md shadow-sm">
            <h3 className="mb-2 text-lg font-bold">Оставить оценку</h3>
            <div className="flex space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((num) => (
                    <button
                        key={num}
                        onClick={() => handleRatingChange(num)}
                        className={`px-2 py-1 ${num <= rating ? 'bg-yellow-400' : 'bg-gray-300'} rounded`}
                    >
                        {num} ★
                    </button>
                ))}
            </div>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Добавьте комментарий (необязательно)"
                className="w-full p-2 border rounded mb-4"
            />
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Отправить оценку
            </button>
        </div>
    );
};

export default RatingComponent;
