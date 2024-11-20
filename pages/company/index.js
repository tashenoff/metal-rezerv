import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import CompanyDetails from '../../components/company/CompanyDetails';
import EmployeesTable from '../../components/company/EmployeesTable';

const MyCompany = () => {
  const { user, loading } = useAuth();
  const [company, setCompany] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    fetchUserCompany();
  }, [user, loading]);

  const fetchUserCompany = async () => {
    setIsLoading(true);
    try {
      if (!user.companyId) {
        setCompany(null);
        setEmployees([]);
        return;
      }

      const response = await fetch(`/api/companies/${user.companyId}`);
      if (response.ok) {
        const data = await response.json();
        setCompany(data.company);
        fetchEmployees(data.company.id);
      } else {
        setCompany(null);
        setEmployees([]);
      }
    } catch {
      setCompany(null);
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async (companyId) => {
    if (!companyId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/companies/${companyId}/employees`);
      if (response.ok) {
        const employeesData = await response.json();
        setEmployees(employeesData);
      } else {
        setEmployees([]);
      }
    } catch {
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmployee = async (userId) => {
    const confirmDelete = window.confirm('Вы уверены, что хотите удалить этого сотрудника?');
    if (confirmDelete) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/companies/${company.id}/remove-employee`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, companyId: company.id }),
        });

        if (response.ok) {
          fetchEmployees(company.id);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Layout>
      {isLoading ? (
        <p>Загрузка...</p>
      ) : company ? (
        <>
          <div className='flex space-x-5'>
            <button onClick={() => router.push('/company/balance-add')}>
              добавить балы сотруднику
            </button>

            <button onClick={() => router.push('/company/companyBalanceHistory')}>
              история пополнения
            </button></div>
          <CompanyDetails user={user} company={company} />
          <EmployeesTable employees={employees} handleDeleteEmployee={handleDeleteEmployee} />


        </>
      ) : (
        <button onClick={() => router.push('/company/create-company')}>
          Создать компанию
        </button>
      )}
    </Layout>
  );
};

export default MyCompany;
