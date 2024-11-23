import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Notification from '../../components/Notification';
import { useAuth } from '../../contexts/AuthContext'; // Импортируем хук для контекста
import { topUpBalance, getEmployees } from '../../services/api'; // Импортируем функцию из API
import { handleApiError } from '../../services/errors'; // Импортируем обработчик ошибок

const BalanceTopUpPage = () => {
  const [employees, setEmployees] = useState([]);
  const [points, setPoints] = useState(0); // Количество баллов
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [addedBy] = useState('admin'); // Можно передавать ID администратора, если необходимо

  // Используем контекст для получения информации о компании
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading || !user) {
      return; // Дожидаемся загрузки данных пользователя
    }

    const fetchEmployees = async () => {
      try {
        const companyId = user.companyId; // Получаем companyId из контекста
        if (!companyId) {
          console.error('Компания не указана');
          return;
        }

        const data = await getEmployees(companyId); // Используем функцию из api
        console.log('Полученные сотрудники:', data); // Логирование для проверки данных
        setEmployees(data);
      } catch (error) {
        const handledError = handleApiError(error); // Обработка ошибки
        setNotification({ type: 'error', message: handledError.message });
      }
    };

    fetchEmployees();
  }, [user, authLoading]); // Запрос только после загрузки пользователя

  // Обработка пополнения баланса
  const handleBalanceTopUp = async () => {
    if (selectedEmployeeId === null || points <= 0) {
      setNotification({ type: 'error', message: 'Пожалуйста, выберите сотрудника и введите количество баллов.' });
      return;
    }

    setLoading(true);
    try {
      const companyId = user.companyId; // Получаем companyId из контекста

      const data = await topUpBalance({
        companyId,
        userId: selectedEmployeeId,
        points,
        addedBy,
      });

      if (data.type === 'success') {
        setNotification({ type: 'success', message: data.message });
        setPoints(0);
        setSelectedEmployeeId(null);
      } else {
        setNotification({ type: 'error', message: data.message });
      }

    } catch (error) {
      const handledError = handleApiError(error); // Обработка ошибки
      setNotification({ type: 'error', message: handledError.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-xl font-semibold">Пополнение баланса сотрудника</h1>

      {notification && <Notification type={notification.type} message={notification.message} />}

      <div className="my-4">
        <label htmlFor="employee" className="block text-sm font-medium text-gray-700">Выберите сотрудника</label>
        <select
          id="employee"
          value={selectedEmployeeId || ''}
          onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Выберите сотрудника</option>
          {Array.isArray(employees) && employees.length > 0 ? (
            employees.map((employee) => (
              <option key={employee.userId} value={employee.userId}>
                {employee.user.name} (Баланс: {employee.user.points || 0})
              </option>
            ))
          ) : (
            <option disabled>Нет сотрудников</option>
          )}
        </select>
      </div>

      <div className="my-4">
        <label htmlFor="points" className="block text-sm font-medium text-gray-700">Количество баллов</label>
        <input
          id="points"
          type="number"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <button
        onClick={handleBalanceTopUp}
        disabled={loading}
        className={`mt-4 px-4 py-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-600'}`}
      >
        {loading ? 'Загружается...' : 'Пополнить баланс'}
      </button>
    </Layout>
  );
};

export default BalanceTopUpPage;
