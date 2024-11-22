import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import CompanyDetails from '../../components/company/CompanyDetails';
import EmployeesTable from '../../components/company/EmployeesTable';
import ApplicationsChart from '../../components/ApplicationsChart';
import ResponseStatsChart from '../../components/ResponseStatsChart'; // Новый компонент
import BalanceTable from '../../components/company/BalanceTable'; // Универсальная таблица
import useBalanceHistory from '../../hooks/useBalanceHistory';

const MyCompany = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [company, setCompany] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [applicationsData, setApplicationsData] = useState([]);
  const [responseStatsData, setResponseStatsData] = useState({}); // Статистика откликов

  const companyId = user?.companyId || company?.id; // Используем ID компании из user или state
  const { transfers, loading: transfersLoading, error: transfersError } = useBalanceHistory(companyId);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchUserCompany();
    fetchApplicationsData(user.companyId);
    fetchResponseStats(user.companyId);
  }, [user]);

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

  const fetchApplicationsData = async (companyId) => {
    try {
      const response = await fetch(`/api/companies/${companyId}/applications-stats`);
      if (response.ok) {
        const data = await response.json();
        setApplicationsData(data.stats);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных графика:', error);
    }
  };

  const fetchResponseStats = async (companyId) => {
    try {
      const response = await fetch(`/api/companies/${companyId}/response-stats`);
      if (response.ok) {
        const data = await response.json();
        setResponseStatsData(data.stats);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных статистики откликов:', error);
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

          <div className='bg-base-100 p-2 flex items-center justify-between rounded-lg'>
            <span>Баланс компании: {company.balance}</span>
            <button className="btn btn-accent">Пополнить</button>
          </div>


          <CompanyDetails user={user} company={company} />

          <div className="my-5">
            {user?.role !== 'PUBLISHER' && (
              <>
                <div className="grid grid-cols-12 gap-4">
                  <div className="bg-base-100 col-span-10 rounded-lg p-5">
                    <ApplicationsChart data={applicationsData} />
                  </div>

                  <div className="bg-base-100 col-span-2 rounded-lg p-5">
                    <ResponseStatsChart data={responseStatsData} />
                  </div>
                </div>


                <div className="bg-base-200 overflow-hidden rounded-lg my-5">
                  <div className="w-full p-5 flex items-center justify-between bg-base-100">
                    <h3 class="text-xl font-semibold my-6">Истрия пополнений</h3>

                    <div>

                      <button className="btn btn-primary btn-outline" onClick={() => router.push('/company/balance-add')}>
                        Пополнить баланс сотрудника
                      </button>
                    </div>
                  </div>
                  {transfersLoading ? (
                    <p className="text-center">Загрузка истории...</p>
                  ) : transfersError ? (
                    <p className="text-center text-red-500">{transfersError}</p>
                  ) : (
                    <BalanceTable rowLimit={5} transfers={transfers} />
                  )}

                  <div className="flex items-center justify-center space-x-5 p-5">


                    <button className="underline" onClick={() => router.push('/company/companyBalanceHistory')}>
                      посмотреть все
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* <div className="mt-10">
            <div className="overflow-x-auto bg-base-100 col-span-8">
              <table className="table w-full table-compact">
                <thead>
                  <tr>
                    <th className="text-center">BIN/IIN</th>
                    <th className="text-center">Регион</th>
                    <th className="text-center">Контакты</th>
                    <th className="text-center">Директор</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover">
                    <td className="text-center">{company.binOrIin}</td>
                    <td className="text-center">{company.region}</td>
                    <td className="text-center">{company.contacts}</td>
                    <td className="text-center">{company.director}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div> */}

          <EmployeesTable employees={employees} handleDeleteEmployee={handleDeleteEmployee} />
        </>
      ) : (
        <button onClick={() => router.push('/company/create-company')}>Создать компанию</button>
      )}
    </Layout>
  );
};

export default MyCompany;
