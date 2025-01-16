import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../../contexts/AuthContext'; // Импортируем контекст аутентификации
import Layout from '../../../../components/Layout';
import Table from '../../../../components/Table'; // Импортируем компонент таблицы
import { fetchPublisherListings } from '../../../../services/api'; // Импортируем функцию для получения данных

const PublisherListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, loading: authLoading } = useAuth(); // Получаем информацию о пользователе
  const router = useRouter();
  const { publisherId } = router.query; // Получаем параметр publisherId из URL

  useEffect(() => {
    // Если данные аутентификации еще загружаются или пользователя нет, прекращаем выполнение
    if (authLoading || !user) return;

    if (publisherId) {
      fetchListings(publisherId);
    }
  }, [publisherId, authLoading, user]);

  const fetchListings = async (publisherId) => {
    try {
      const data = await fetchPublisherListings(publisherId); // Получаем данные с API
      setListings(data);
    } catch (error) {
      setError('Ошибка при загрузке объявлений.');
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Layout>
      <h1>Объявления публишера</h1>
      <Table data={listings} /> {/* Отображаем данные в таблице */}
    </Layout>
  );
};

export default PublisherListings;
