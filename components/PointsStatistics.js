import { useEffect, useState } from 'react';

const PointsStatistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/points-statistics');
        if (!response.ok) {
          throw new Error('Ошибка при получении данных статистики');
        }
        const data = await response.json();
        setStatistics(data);
      } catch (error) {
        setError('Ошибка при загрузке статистики');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Общее количество начисленных баллов</th>
            <th>Общее количество потраченных баллов</th>
          </tr>
        </thead>
        <tbody>
          {statistics.map((stat) => (
            <tr key={stat.id}>
              <td>{new Date(stat.statisticsDate).toLocaleString()}</td>
              <td>{stat.totalPointsAdded}</td>
              <td>{stat.totalPointsSpent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PointsStatistics;
