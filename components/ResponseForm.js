// components/ResponseForm.js
import { useState } from 'react';
import Form from './Form';
import Textarea from './Textarea'; // Импортируем компонент Textarea

const ResponseForm = ({ onSubmit, feedback }) => {
    const [responseMessage, setResponseMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(responseMessage);
        setResponseMessage(''); // Очищаем поле ввода после отправки
    };

    return (
        <Form onSubmit={handleSubmit} className="mt-5">
            <Textarea
                placeholder="Напишите ваш отклик"
                value={responseMessage}
                onChange={setResponseMessage} // Обновляем состояние при изменении
                required // Убедитесь, что поле не пустое
                
            />
            <button 
                type="submit" 
                className="btn btn-primary w-full mt-5"
            >
                Отправить отклик
            </button>
            {feedback && <p className="text-red-500 mt-2">{feedback}</p>}
        </Form>
    );
};

export default ResponseForm;
