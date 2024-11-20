import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../contexts/AuthContext';
import Layout from '../../../components/Layout';

const EmployeePage = () => {
    const { user, loading } = useAuth();
    const [employee, setEmployee] = useState(null);
    const [pointsSpent, setPointsSpent] = useState([]); // История расходов
    const [pointsAdded, setPointsAdded] = useState([]); // История пополнений
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('expenses'); // Текущая вкладка
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (!loading && user?.isLoggedIn && id) {
            const fetchEmployee = async () => {
                try {
                    const res = await fetch(`/api/employees/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    const data = await res.json();

                    if (res.status === 200) {
                        setEmployee(data.employee);
                    } else {
                        setError(data.message || 'Неизвестная ошибка');
                    }
                } catch (error) {
                    setError(error.message || 'Ошибка при получении данных');
                } finally {
                    setIsLoading(false);
                }
            };

            const fetchPointsData = async () => {
                try {
                    // Получение расходов
                    const resSpent = await fetch(`/api/pointsSpent?userId=${id}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    const dataSpent = await resSpent.json();
                    if (resSpent.status === 200) {
                        setPointsSpent(dataSpent);
                    }

                    // Получение пополнений
                    const resAdded = await fetch(`/api/balance/balanceAddhistory?userId=${id}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    const dataAdded = await resAdded.json();
                    console.log('Ответ от API для пополнений:', dataAdded); // Логирование ответа

                    if (resAdded.status === 200) {
                        setPointsAdded(dataAdded.additions); // Извлекаем ключ additions
                    }
                } catch (error) {
                    setError(error.message || 'Ошибка при загрузке данных о баллах');
                }
            };

            fetchEmployee();
            fetchPointsData();
        }
    }, [user, id, loading]);

    if (isLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="loader">Загрузка...</div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen">
                    <p className="text-red-500">{error}</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <h1 className="text-3xl font-bold text-center text-gray-800">Информация о сотруднике</h1>
            {employee ? (
                <div className="space-y-4 grid grid-cols-12 gap-4">
                    <div className="col-span-4">
                        {/* Карточка сотрудника */}
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <p><strong>ID:</strong> {employee.id || 'ID не указан'}</p>
                                <p><strong>Имя:</strong> {employee.name || 'Имя не указано'}</p>
                                <p><strong>Email:</strong> {employee.email || 'Email не указан'}</p>
                                <p><strong>Роль:</strong> {employee.role || 'Роль не указана'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-8">
                        {/* Вкладки */}
                        <div className="tabs">
                            <a
                                className={`tab tab-bordered ${activeTab === 'expenses' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('expenses')}
                            >
                                История расходов
                            </a>
                            <a
                                className={`tab tab-bordered ${activeTab === 'additions' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('additions')}
                            >
                                История пополнений
                            </a>
                        </div>

                        {/* Содержимое вкладок */}
                        {activeTab === 'expenses' && pointsSpent.length > 0 ? (
                            <div className="mt-6 bg-base-100 p-5">
                                <h3 className="text-xl font-semibold">История расходов</h3>
                                <div className="mt-4 overflow-x-auto">
                                    <table className="table table-zebra w-full">
                                        <thead>
                                            <tr>
                                                <th>Объявление</th>
                                                <th>Потраченные баллы</th>
                                                <th>Дата расхода</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pointsSpent.map((spent) => (
                                                <tr key={spent.id}>
                                                    <td>{spent.listing.title}</td>
                                                    <td>{spent.pointsUsed}</td>
                                                    <td>{new Date(spent.spentAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <p className="mt-4 text-center text-gray-500">Нет данных о расходах</p>
                        )}

                        {activeTab === 'additions' && pointsAdded.length > 0 ? (
                            <div className="mt-6 bg-base-100 p-5">
                                <h3 className="text-xl font-semibold">История пополнений</h3>
                                <div className="mt-4 overflow-x-auto">
                                    <table className="table table-zebra w-full">
                                        <thead>
                                            <tr>
                                                <th>Компания</th>
                                                <th>Добавленные баллы</th>
                                                <th>Дата пополнения</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pointsAdded.map((added) => (
                                                <tr key={added.id}>
                                                    <td>{added.company.name}</td>
                                                    <td>{added.points}</td>
                                                    <td>{new Date(added.transferDate).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <p className="mt-4 text-center text-gray-500">Нет данных о пополнениях</p>
                        )}
                    </div>
                </div>
            ) : (
                <p className="mt-4 text-center text-red-500">Данные сотрудника не найдены.</p>
            )}
        </Layout>
    );
};

export default EmployeePage;
