import { useState, useEffect } from 'react';
import { getBalanceHistory } from '../services/api'; // Импортируем функцию из api.js

const useBalanceHistory = (companyId) => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) {
      setError('Компания не указана.');
      return;
    }

    const fetchTransfers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBalanceHistory(companyId); // Используем функцию из api.js
        setTransfers(data.transfers); // Получаем данные и сохраняем их в state
      } catch (err) {
        setError(err.message || 'Ошибка при загрузке данных.'); // Обрабатываем ошибку
      } finally {
        setLoading(false); // Завершаем загрузку
      }
    };

    fetchTransfers();
  }, [companyId]);

  return { transfers, loading, error };
};

export default useBalanceHistory;
