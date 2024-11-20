import { useState } from 'react';
import Button from '../components/Button'; // Импортируем компонент Button

const ReviewForm = ({companyId, onSubmit }) => {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!comment.trim() || rating < 1 || rating > 5) {
      setError('Пожалуйста, заполните все поля корректно.');
      return;
    }

    // Передаем данные в родительский компонент для отправки на сервер
    onSubmit({ rating, companyId, comment });
  };

  return (
    <div className="p-6 card bg-base-100 rounded-lg my-5">
      <h2 className="card-title my-4">Оставить отзыв</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="rating" className="block text-sm font-medium">Рейтинг</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={`text-2xl ${value <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium">Комментарий</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Напишите ваш отзыв..."
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        <Button type="submit" className="w-full mt-4">Отправить отзыв</Button>
      </form>
    </div>
  );
};

export default ReviewForm;
