import Table from './Table';

const BalanceTable = ({ transfers = [], rowLimit }) => {
  const headers = ["Дата", "Баллы", "Описание", "Пользователь"];

  const renderRow = (transfer, index) => (
    <tr key={transfer.id || index}>
      <td>{new Date(transfer.transferDate).toLocaleString()}</td>
      <td>{transfer.points}</td>
      <td>{transfer.description || "Не указано"}</td>
      <td>{transfer.user?.name || "Неизвестно"}</td>
    </tr>
  );

  return <Table headers={headers} data={transfers} renderRow={renderRow} rowLimit={rowLimit} />;
};

export default BalanceTable;
