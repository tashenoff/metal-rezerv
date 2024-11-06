import { useState, useEffect } from 'react';

export default function AddPointsForm() {
    const [userId, setUserId] = useState('');
    const [points, setPoints] = useState('');
    const [addedBy, setAddedBy] = useState('');
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');
    const [pricePerPoint, setPricePerPoint] = useState(0);  // Стоимость одного балла
    const [totalCost, setTotalCost] = useState(0);  // Общая стоимость за баллы

    // Функция для получения актуальной цены баллов
    const fetchPricePerPoint = async () => {
        try {
            const response = await fetch('/api/points-price');
            const data = await response.json();
            if (response.ok) {
                setPricePerPoint(data.price);  // Устанавливаем цену за балл из API
            } else {
                setMessage('Не удалось получить цену баллов');
            }
        } catch (error) {
            setMessage(`Ошибка при получении цены: ${error.message}`);
        }
    };

    // Получаем цену баллов при монтировании компонента
    useEffect(() => {
        fetchPricePerPoint();
    }, []);

    // Функция для расчета общей стоимости
    const calculateTotalCost = (points) => {
        if (!pricePerPoint || isNaN(points)) return;
        setTotalCost(points * pricePerPoint);
    };

    // Отправка формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('/api/addPoints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: parseInt(userId),
                    points: parseInt(points),
                    addedBy,
                    reason,
                    totalCost,  // Добавляем расчетную стоимость в запрос
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Баланс успешно пополнен.');
            } else {
                setMessage(`Ошибка: ${data.message}`);
            }
        } catch (error) {
            setMessage(`Ошибка: ${error.message}`);
        }
    };

    // Обработчик изменений количества баллов
    const handlePointsChange = (e) => {
        setPoints(e.target.value);
        calculateTotalCost(e.target.value);
    };

    return (
        <div className="max-w-md mx-auto bg-base-100 p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Добавить баллы пользователю</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">ID пользователя</label>
                    <input
                        type="number"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Количество баллов</label>
                    <input
                        type="number"
                        value={points}
                        onChange={handlePointsChange}
                        className="w-full p-2 border rounded mt-1"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Администратор</label>
                    <input
                        type="text"
                        value={addedBy}
                        onChange={(e) => setAddedBy(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Причина пополнения</label>
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                    />
                </div>
                
                {/* Отображаем стоимость баллов */}
                {pricePerPoint > 0 && points && (
                    <div className="mb-4 text-sm text-gray-700">
                        <p>Стоимость {points} баллов: {totalCost} тенге</p>
                    </div>
                )}

                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
                    Пополнить баланс
                </button>
                {message && <p className="mt-4 text-center text-red-500">{message}</p>}
            </form>
        </div>
    );
}
