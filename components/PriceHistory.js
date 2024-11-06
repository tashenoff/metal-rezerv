import { useEffect, useState } from 'react';

const PriceHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Загружаем историю изменения цены
    const fetchPriceHistory = async () => {
      try {
        const response = await fetch('/api/price-history');
        if (!response.ok) {
          throw new Error('Ошибка при получении данных истории цен');
        }
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching price history:', error);
      }
    };

    fetchPriceHistory();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Дата изменения</th>
            <th>Старая цена</th>
            <th>Новая цена</th>
            <th>Изменил</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <tr key={item.id}>
              <td>{new Date(item.changedAt).toLocaleString()}</td>
              <td>{item.oldPrice}</td>
              <td>{item.newPrice}</td>
              <td>{item.changedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriceHistory;
