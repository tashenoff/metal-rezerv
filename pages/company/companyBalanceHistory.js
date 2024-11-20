import { useAuth } from '../../contexts/AuthContext'; // Ваш контекст аутентификации
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout'; // Используйте свой компонент Layout
import Notification from '../../components/Notification'; // Ваш компонент для уведомлений

const CompanyBalanceHistory = () => {
  const { user } = useAuth(); // Получаем информацию о пользователе из контекста
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!user || !user.companyId) {
      setNotification({ type: 'error', message: 'Вы должны быть авторизованы для просмотра истории переводов баллов.' });
      return;
    }

    const fetchTransfers = async () => {
      setLoading(true);
      try {
        // Запрос на получение истории переводов баллов
        const response = await fetch(`/api/balance/balance-history?companyId=${user.companyId}`);
        const data = await response.json();

        if (response.ok) {
          setTransfers(data.transfers);
        } else {
          setNotification({ type: 'error', message: data.message });
        }
      } catch (error) {
        setNotification({ type: 'error', message: 'Ошибка при загрузке истории переводов баллов.' });
      } finally {
        setLoading(false);
      }
    };

    fetchTransfers();
  }, [user]);

  return (
    <Layout>
      <h1 className="text-xl font-semibold mb-4">История пополнений</h1>

      {notification && <Notification type={notification.type} message={notification.message} />}

      {loading ? (
        <div className="text-center">Загрузка...</div>
      ) : (
        <div className="overflow-x-auto">
          {transfers.length === 0 ? (
            <div className="text-center">История пуста.</div>
          ) : (
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Баллы</th>
                  <th>Описание</th>
                  <th>Пользователь</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((transfer) => (
                  <tr key={transfer.id}>
                    <td>{new Date(transfer.transferDate).toLocaleString()}</td>
                    <td>{transfer.points}</td>
                    <td>{transfer.description || 'Не указано'}</td>
                    <td>{transfer.user?.name || 'Неизвестно'}</td>
                  
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </Layout>
  );
};

export default CompanyBalanceHistory;
