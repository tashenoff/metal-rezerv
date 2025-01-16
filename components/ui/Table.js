const Table = ({ headers = [], data = [], renderRow, rowLimit = Infinity, emptyMessage = "Нет данных для отображения" }) => {
    if (data.length === 0) {
      return <div className="text-center">{emptyMessage}</div>;
    }
  
    // Ограничиваем количество строк
    const limitedData = data.slice(0, rowLimit);
  
    return (
      <div className="overflow-x-auto bg-base-100">
        <table className="table w-full table-compact table-zebra">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="text-center">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {limitedData.map((item, index) => renderRow(item, index))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default Table;
  