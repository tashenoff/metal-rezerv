import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SpentPointsPage() {
    const [pointsSpent, setPointsSpent] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const { userId } = router.query; // Получаем userId из query параметров

    useEffect(() => {
        if (!userId) return;  // Если userId не передан, не выполняем запрос

        const fetchPointsSpent = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await fetch(`/api/pointsSpent?userId=${userId}`);
                const data = await response.json();

                if (response.ok) {
                    setPointsSpent(data);  // Устанавливаем данные о потраченных баллах
                } else {
                    setError(data.message || 'Ошибка при загрузке данных');
                }
            } catch (err) {
                setError('Ошибка при загрузке данных');
            } finally {
                setLoading(false);
            }
        };

        fetchPointsSpent();
    }, [userId]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">История потраченных баллов</h1>
            
            {pointsSpent.length === 0 ? (
                <p>Нет данных о потраченных баллах для этого респондера.</p>
            ) : (
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Лот</th>
                            <th>Количество баллов</th>
                            <th>Комментарий</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pointsSpent.map((record) => (
                            <tr key={record.id}>
                                <td>{new Date(record.spentAt).toLocaleDateString()}</td>
                                <td>{record.listing?.title || 'Без названия'}</td>
                                <td>{record.points}</td>
                                <td>{record.reason || 'Нет комментария'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
