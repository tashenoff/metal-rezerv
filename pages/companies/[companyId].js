// pages/companies/[companyId].js
import { useState, useEffect } from 'react';
import InviteEmployeeForm from '../../components/InviteEmployeeForm';

const CompanyEmployeesPage = ({ companyId }) => {
  const [employees, setEmployees] = useState([]);
  
  // Функция для получения сотрудников
  const fetchEmployees = async () => {
    const res = await fetch(`/api/companies/employees?companyId=${companyId}`);
    const data = await res.json();

    if (res.ok) {
      setEmployees(data);
    } else {
      console.error(data.error || 'Ошибка при получении сотрудников');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [companyId]);

  // Обновление списка сотрудников после приглашения
  const handleInvite = () => {
    fetchEmployees();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Сотрудники компании</h1>

      <InviteEmployeeForm companyId={companyId} onInvite={handleInvite} />

      <h2 className="text-2xl font-semibold mt-8 mb-4">Список сотрудников</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id} className="flex justify-between items-center py-2 border-b">
            <span>{employee.user.name} ({employee.role})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const { companyId } = params;
  return {
    props: {
      companyId,
    },
  };
}

export default CompanyEmployeesPage;
