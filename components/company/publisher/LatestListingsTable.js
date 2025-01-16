import { useRouter } from 'next/router';
import Table from '../../ui/Table'; // Импортируем компонент Table

const LatestListingsTable = ({ listings, userId }) => {
  const router = useRouter();

  const headers = ['Название', 'Дата', 'Действия']; // Заголовки таблицы

  // Рендерим строку с данными
  const renderRow = (listing) => (
    <tr key={listing.id}>
      <td>{listing.title}</td>
      <td>{listing.date}</td>
      <td>
        <button
          onClick={() =>
            router.push(`/company/publisher/${userId}/listings/${listing.id}`) // Переход к детальной странице объявления
          }
          className="underline text-blue-500"
        >
          Смотреть
        </button>
      </td>
    </tr>
  );

  return (
    <div className="bg-base-100 p-5 rounded-lg">
      <h3 className="text-xl font-semibold">Последние объявления</h3>
      <Table
        headers={headers}
        data={listings}
        renderRow={renderRow}
        rowLimit={15} // Ограничиваем количество строк, если нужно
        emptyMessage="Нет объявлений для отображения"
      />

      <div className="text-center mt-4">
        <button
          onClick={() => router.push(`/company/publisher/${userId}/listings`)} // Переход к списку всех объявлений
          className="underline text-blue-500"
        >
          Смотреть все объявления
        </button>
      </div>
    </div>
  );
};

export default LatestListingsTable;
