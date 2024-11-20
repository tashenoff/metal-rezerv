import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Notification from '../../components/Notification';

const BalanceTopUpPage = () => {
  const [employees, setEmployees] = useState([]);
  const [points, setPoints] = useState(0); // Количество баллов
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [addedBy] = useState('admin'); // Можно передавать ID администратора, если необходимо

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const companyId = 60002; // Пример, нужно получить актуальный ID компании
        const response = await fetch(`/api/companies/${companyId}/employees`);
        const data = await response.json();
        console.log('Полученные сотрудники:', data); // Логирование для проверки данных
        setEmployees(data);
      } catch (error) {
        console.error('Ошибка при получении сотрудников:', error);
      }
    };
  
    fetchEmployees();
  }, []);
  
  // Обработка пополнения баланса
  const handleBalanceTopUp = async () => {
    if (selectedEmployeeId === null || points <= 0) {
      setNotification({ type: 'error', message: 'Пожалуйста, выберите сотрудника и введите количество баллов.' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/balance/top-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedEmployeeId, // ID выбранного сотрудника
          points, // Количество баллов для пополнения
          addedBy, // Кто добавляет (администратор или другой пользователь)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({ type: 'success', message: data.message });
        setPoints(0);
        setSelectedEmployeeId(null);
      } else {
        setNotification({ type: 'error', message: data.message });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Ошибка при пополнении баланса.' });
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
