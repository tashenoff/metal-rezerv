import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../contexts/AuthContext';
import Layout from '../../../components/Layout';

const EmployeePage = () => {
    const { user, loading } = useAuth();  // Получаем данные пользователя из контекста
    const [employee, setEmployee] = useState(null);
    const [pointsSpent, setPointsSpent] = useState([]); // Массив потраченных баллов
    const [isLoading, setIsLoading] = useState(true);  // Состояние для отслеживания загрузки данных
    const [error, setError] = useState(null);  // Состояние для ошибок
    const router = useRouter();
    const { id } = router.query;  // Получаем id из URL

    useEffect(() => {
        if (!loading && user?.isLoggedIn && id) {
            const fetchEmployee = async () => {
                try {
                    console.log('Fetching employee data for ID:', id);  // Логируем, какой ID запрашиваем
                    const res = await fetch(`/api/employees/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Токен из localStorage
                        },
                    });
                    const data = await res.json();
                    console.log('Employee data response:', data);  // Логируем ответ от сервера

                    if (res.status === 200) {
                        setEmployee(data.employee);  // Сохраняем данные сотрудника
                    } else {
                        setError(data.message || 'Неизвестная ошибка');
                    }
                } catch (error) {
                    console.error('Ошибка при получении данных сотрудника:', error);
                    setError(error.message || 'Ошибка при получении данных');
                } finally {
                    setIsLoading(false);  // Завершаем загрузку
                }
            };

            const fetchPointsSpent = async () => {
                try {
                    // Используем ваш существующий API для получения потраченных баллов
                    const res = await fetch(`/api/pointsSpent?userId=${id}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    const data = await res.json();
                    console.log('Points spent data:', data);

                    if (res.status === 200) {
                        setPointsSpent(data);  // Сохраняем потраченные баллы
                    } else {
                        setError(data.message || 'Неизвестная ошибка');
                    }
                } catch (error) {
                    console.error('Ошибка при получении данных о потраченных баллах:', error);
                    setError(error.message || 'Ошибка при получении данных');
                }
            };

            fetchEmployee();  // Загружаем данные сотрудника при рендере
            fetchPointsSpent();  // Загружаем данные о потраченных баллах
        }
    }, [user, id, loading]);

    if (isLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="loader">Загрузка...</div> {/* Прелоадер */}
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
                    <div className='col-span-4'>
                        {/* Карточка с данными сотрудника */}
                        <div className="card bg-base-100 shadow-md">
                        <h3 className="card-title">Информация о сотруднике</h3>
                            <div className="card-body">
                                <p><strong>ID:</strong> {employee.id || 'ID не указан'}</p>
                                <p><strong>Имя:</strong> {employee.name || 'Имя не указано'}</p>
                                <p><strong>email:</strong> {employee.email || 'Имя не указано'}</p>
                                <p><strong>Роль:</strong> {employee.role || 'Роль не указана'}</p>
                                <p><strong>Дата присоединения:</strong> {employee.joinedAt || 'Дата не указана'}</p>
                            </div>
                        </div>

                        {/* Информация о компании */}
                        {employee.company && (
                            <div className="card bg-base-100 shadow-md">
                                <div className="card-body">
                                    <h3 className="card-title">Компания</h3>
                                    <p><strong>Название компании:</strong> {employee.company.name || 'Не указано'}</p>
                                    <p><strong>Адрес компании:</strong> {employee.company.address || 'Не указан'}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='col-span-8'>
                        {/* Вывод откликов и потраченных баллов */}
                        {pointsSpent.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold">Отклики и потраченные баллы</h3>
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
