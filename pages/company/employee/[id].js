import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../contexts/AuthContext';
import Layout from '../../../components/Layout';
import {
    getEmployeeById,
    getPointsSpentByEmployee,
    getPointsAddedByEmployee,
} from '../../../services/api';

const EmployeePage = () => {
    const { user, loading } = useAuth();
    const [employee, setEmployee] = useState(null);
    const [pointsSpent, setPointsSpent] = useState([]);
    const [pointsAdded, setPointsAdded] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('expenses');
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (!loading && user?.isLoggedIn && id) {
            const fetchData = async () => {
                try {
                    const employeeData = await getEmployeeById(id);
                    setEmployee(employeeData);

                    const pointsSpentData = await getPointsSpentByEmployee(id);
                    setPointsSpent(pointsSpentData);

                    const pointsAddedData = await getPointsAddedByEmployee(id);
                    setPointsAdded(pointsAddedData.additions || []);
                } catch (err) {
                    setError(err.message || 'Ошибка при загрузке данных');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
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
                                <p><strong>Имя:</strong> {employee?.name || 'Имя не указано'}</p>
                                <p><strong>Email:</strong> {employee?.user?.email || 'Email не указан'}</p>
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
