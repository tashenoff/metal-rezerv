import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import CompanyDetails from '../../components/company/CompanyDetails';
import ApplicationsChart from '../../components/ApplicationsChart';
import EmployeesTable from '../../components/company/EmployeesTable';
import CompanyActions from '../company/CompanyActions';
import BalanceTable from '../../components/company/BalanceTable';
import useBalanceHistory from '../../hooks/useBalanceHistory';
import LatestListingsTable from '../../components/company/publisher/LatestListingsTable';
import { 
  getCompanyDetails, 
  getApplicationsStats, 
  fetchCompanyListings, 
  getEmployees, 
  deleteEmployee 
} from '../../services/api';
import { BanknotesIcon } from '@heroicons/react/24/solid';

const MyCompany = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Начинаем с состояния загрузки
  const [dataInitialized, setDataInitialized] = useState(false); // Флаг, указывающий, что данные инициализированы
  const [listings, setListings] = useState([]);
  const [companyApplicationsData, setCompanyApplicationsData] = useState([]); // Новое состояние
  const companyId = user?.companyId || company?.id;
  const { transfers, loading: transfersLoading, error: transfersError } = useBalanceHistory(companyId);
  const [employees, setEmployees] = useState([]);

  // Проверяем, есть ли у пользователя компания после загрузки данных авторизации
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchUserCompany(); // Загружаем данные компании
      } else {
        setIsLoading(false); // Если пользователь не авторизован, завершаем загрузку
        setDataInitialized(true); // Отмечаем, что данные инициализированы
      }
    }
  }, [user, authLoading]);

  useEffect(() => {
    // Если пользователь авторизован, компания есть и данные инициализированы
    if (companyId && dataInitialized && user) {
      fetchCompanyListingsData(companyId); // Загружаем объявления компании
      fetchCompanyApplicationsData(companyId); // Загружаем отклики компании
    }
  }, [companyId, dataInitialized, user]);

  const fetchUserCompany = async () => {
    setIsLoading(true);
    try {
      if (!user || !user.companyId) {
        setCompany(null);
        setDataInitialized(true); // Данные инициализированы, даже если нет компании
        return;
      }

      const data = await getCompanyDetails(user.companyId);
      setCompany(data.company);
      setDataInitialized(true); // Данные инициализированы
      fetchEmployees(data.company.id); // Загружаем сотрудников
    } catch (error) {
      console.error('Ошибка загрузки данных компании:', error.message);
      setCompany(null);
      setDataInitialized(true); // Данные инициализированы, даже при ошибке
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async (companyId) => {
    try {
      const data = await getEmployees(companyId);
      setEmployees(data);
    } catch (error) {
      console.error('Ошибка загрузки сотрудников:', error);
    }
  };

  const fetchCompanyListingsData = async (companyId) => {
    try {
      const data = await fetchCompanyListings(companyId);
      setListings(data);
    } catch (error) {
      console.error('Ошибка загрузки объявлений:', error);
    }
  };

  const fetchCompanyApplicationsData = async (companyId) => {
    try {
      const data = await getApplicationsStats(companyId); // API для откликов компании
      setCompanyApplicationsData(data.stats || []); // Обновляем состояние
    } catch (error) {
      console.error('Ошибка загрузки данных откликов компании:', error);
    }
  };

  const MAX_BALANCE = 1000;
  const balancePercentage = company?.balance ? (company.balance / MAX_BALANCE) * 100 : 0;

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await deleteEmployee(employeeId);
      setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== employeeId));
    } catch (error) {
      console.error('Ошибка удаления сотрудника:', error);
    }
  };

  return (
    <Layout>
      {authLoading || isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="flex flex-col items-center">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-4 text-lg">Загрузка данных...</p>
          </div>
        </div>
      ) : company ? (
        <>
          <CompanyDetails user={user} company={company} />

          <div className="my-5">
            <div className="grid lg:grid-cols-12 gap-4">
              <div className="bg-base-100 lg:col-span-12 rounded-lg p-5">
                <h3 className="text-lg font-bold">Отклики компании за последние 7 дней</h3>
                <ApplicationsChart data={companyApplicationsData} /> {/* Используем данные компании */}
              </div>
            </div>

            {user?.role === 'RESPONDER' && (
              <div className="grid lg:grid-cols-12 gap-4 my-10">
                <div className="flex flex-col lg:col-span-4">
                  <div className="bg-base-100 rounded-lg p-2">
                    <span className="flex items-center space-x-3">
                      <span className="bg-base-200 p-2 rounded-full w-10 h-10 flex items-center justify-center mr-2">
                        <BanknotesIcon className="w-5 h-5 rounded-full text-base-50" />
                      </span>
                      <h3 className="text-xl font-semibold my-6">Баланс компании:</h3>
                    </span>

                    <div className="flex w-full items-center space-x-2 my-5">
                      <span className="text-sm text-gray-600">{company.balance}</span>
                      <div className="w-full bg-base-200 rounded-full h-4 mt-2">
                        <div
                          className="bg-green-500 h-4 rounded-full"
                          style={{ width: `${balancePercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{MAX_BALANCE}</span>
                    </div>

                    <button
                      className="btn w-full btn-outline"
                      onClick={() => router.push('/company/balance-add')}
                    >
                      Пополнить баланс
                    </button>
                  </div>
                </div>

                <div className="bg-base-200 overflow-hidden rounded-lg lg:col-span-8">
                  <div className="w-full p-5 flex items-center justify-between bg-base-100">
                    <h3 className="text-xl font-semibold my-6">История пополнений</h3>
                    <div>
                      <button
                        className="btn btn-primary btn-outline"
                        onClick={() => router.push('/company/balance-add')}
                      >
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
                    <button
                      className="underline"
                      onClick={() => router.push('/company/companyBalanceHistory')}
                    >
                      посмотреть все
                    </button>
                  </div>
                </div>
              </div>
            )}

            {user?.role === 'PUBLISHER' && (
              <div className="my-5">
                <h3 className="text-xl font-semibold my-6">Объявления компании</h3>
                <LatestListingsTable listings={listings} />
              </div>
            )}

            <EmployeesTable employees={employees} handleDeleteEmployee={handleDeleteEmployee} />
          </div>
        </>
      ) : (
        <CompanyActions />
      )}
    </Layout>
  );
};

export default MyCompany;
