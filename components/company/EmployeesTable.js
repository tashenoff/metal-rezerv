import Table from './Table';
import DateDisplay from "../DateDisplay";
import Button from "../Button";
import { useRouter } from 'next/router';
import Link from 'next/link';

const EmployeesTable = ({ employees, handleDeleteEmployee, rowLimit = Infinity }) => {
  const router = useRouter();

  const headers = ["ID", "Имя", "Должность", "Электронная почта", "Дата добавления", "Действия"];

  const renderRow = (employee) => (
    <tr key={employee.id} className="hover">
      <td className="text-center">{employee.user.id}</td>
      <td className="text-center">
        <Link className="text-blue-600 hover:underline" href={`/company/employee/${employee.user.id}`}>
          {employee.user.name}
        </Link>
      </td>
      <td className="text-center">{employee.role}</td>
      <td className="text-center">{employee.user.email}</td>
      <td className="text-center">
        <DateDisplay date={employee.joinedAt} />
      </td>
      <td className="text-center">
        <button
          onClick={() => handleDeleteEmployee(employee.id)}
          className="btn btn-sm btn-danger"
        >
          Удалить
        </button>
      </td>
    </tr>
  );

  return (
    <div>
      <div className="flex items-center my-5 justify-between">
        <h3 className="text-xl font-semibold my-6">Сотрудники компании</h3>
        <Button
          onClick={() => router.push('/company/create-employee')}
          className="py-3 btn-outline btn"
        >
          Добавить сотрудника
        </Button>
      </div>
      
      {/* Использование универсальной таблицы */}
      <Table 
        headers={headers} 
        data={employees} 
        renderRow={renderRow} 
        rowLimit={rowLimit} 
        emptyMessage="Нет сотрудников в компании."
      />
    </div>
  );
};

export default EmployeesTable;
