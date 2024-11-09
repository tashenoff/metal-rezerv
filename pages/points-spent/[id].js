import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function SpentPointsPage() {
    const router = useRouter();
    const { id } = router.query;  // Получаем id из URL
    const [pointsSpent, setPointsSpent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;  // Если id еще не загружен, ничего не делаем

        const fetchPointsSpent = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`/api/pointsSpent?userId=${id}`);
                const data = await res.json();

                if (res.ok) {
                    setPointsSpent(data);
                } else {
                    setError(data.message || 'Что-то пошло не так');
                }
            } catch (err) {
                setError('Ошибка при загрузке данных');
            } finally {
                setLoading(false);
            }
        };

        fetchPointsSpent();
    }, [id]);

    if (loading) return <p>Загрузка...</p>;

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <Layout>

            <h1 className="text-2xl font-semibold mb-4">Потраченные баллы респондера {id}</h1>

            {pointsSpent.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="table w-full table-zebra">
                        <thead>
                            <tr>
                                <th className="text-center">ID</th>
                                <th className="text-center">Дата</th>
                                <th className="text-center">Потраченные баллы</th>
                                <th className="text-center">На что потрачены</th>

                            </tr>
                        </thead>
                        <tbody>
                            {pointsSpent.map((record) => (
                                <tr key={record.id}>
                                    <td className="text-center">{record.id}</td>
                                    <td className="text-center">{new Date(record.spentAt).toLocaleDateString()}</td>
                                    <td className="text-center">{record.pointsUsed}</td> {/* Выводим потраченные баллы */}
                                    <td className="text-center">{record.listing ? record.listing.title : 'Не указано'}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Респондент не потратил баллы.</p>
            )}

        </Layout>
    );
}
