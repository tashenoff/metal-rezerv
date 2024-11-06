import { useEffect, useState } from 'react';
import Link from 'next/link';  // Импортируем Link для создания ссылок

export default function PointsAddedTable() {
    const [pointsAdded, setPointsAdded] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [pricePerPoint, setPricePerPoint] = useState(null);

    // Функция для загрузки данных
    const fetchPointsAdded = async () => {
        setLoading(true);  // Начинаем загрузку
        setError('');  // Очищаем старые ошибки

        try {
            // Загружаем список добавленных баллов
            const response = await fetch('/api/pointsAdded');
            const data = await response.json();
            if (response.ok) {
                setPointsAdded(data);  // Обновляем данные
            } else {
                setError(data.message || 'Ошибка при загрузке данных');
            }
        } catch (err) {
            setError('Ошибка при загрузке данных');
        } finally {
            setLoading(false);  // Завершаем процесс загрузки
        }
    };

    // Эффект для загрузки данных при монтировании компонента
    useEffect(() => {
        fetchPointsAdded();  // Загружаем добавленные баллы
    }, []);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-end mb-4">
                <button
                    onClick={fetchPointsAdded}  // Вызываем функцию для обновления данных
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Обновить данные
                </button>
            </div>

            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя пользователя</th>
                        <th>Количество баллов</th>
                        <th>Итоговая стоимость</th>
                        <th>Дата пополнения</th>
                        <th>Добавил администратор</th>
                        <th>Комментарий</th>
                    </tr>
                </thead>
                <tbody>
                    {pointsAdded.map((record) => {
                        // Используем priceAtAdded для расчета стоимости
                        const totalPrice = record.priceAtAdded 
                            ? record.points * record.priceAtAdded 
                            : 0;

                        return (
                            <tr key={record.id}>
                                <td>{record.id}</td>
                                <td>
                                    {/* Добавляем ссылку на страницу респондера */}
                                    <Link href={`/points-spent/${record.userId}`} className="text-blue-500 hover:underline">
                                        {record.user?.name || 'Без имени'}
                                    </Link>
                                </td>
                                <td>{record.points}</td>
                                <td>{totalPrice.toFixed(2)} тенге.</td> {/* Отображаем итоговую стоимость с двумя знаками после запятой */}
                                <td>{new Date(record.addedAt).toLocaleDateString()}</td>
                                <td>{record.addedBy || 'Не указано'}</td>
                                <td>{record.reason || 'Нет комментария'}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
