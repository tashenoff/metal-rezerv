import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import CompanyADDForm from '../../components/company/CompanyADDForm';
import CompanyDetails from '../../components/company/CompanyDetails';
import EmployeesTable from '../../components/company/EmployeesTable';
import Notification from '../../components/Notification';


const MyCompany = () => {
  const { user, loading } = useAuth();
  const [company, setCompany] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [binOrIin, setBinOrIin] = useState('');
  const [region, setRegion] = useState('');
  const [contacts, setContacts] = useState('');
  const [director, setDirector] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
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
    console.log('Fetching user company...');
    setIsLoading(true);
    try {
      if (!user.companyId) {
        console.log('User does not have a company ID');
        setCompany(null);
        setEmployees([]);
        return;
      }

      const response = await fetch(`/api/companies/${user.companyId}`);
      console.log('Company fetch response:', response);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched company data:', data);
        setCompany(data.company);
        fetchEmployees(data.company.id);
      } else {
        console.error('Error fetching company:', response);
        setCompany(null);
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
      setCompany(null);
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async (companyId) => {
    console.log('Fetching employees for company:', companyId);
    if (!companyId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/companies/${companyId}/employees`);
      console.log('Employees fetch response:', response);
      if (response.ok) {
        const employeesData = await response.json();
        console.log('Fetched employees data:', employeesData);
        setEmployees(employeesData);
      } else {
        console.error('Error fetching employees:', response);
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees data:', error);
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmployee = async (userId) => {
    console.log('Attempting to delete employee:', userId);
    const confirmDelete = window.confirm('Вы уверены, что хотите удалить этого сотрудника?');
    if (confirmDelete) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/companies/${company.id}/remove-employee`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, companyId: company.id }),
        });

        const responseData = await response.json();
        console.log('Delete employee response:', responseData);
        if (response.ok) {
          setMessage('Сотрудник успешно удален!');
          setMessageType('success');
          fetchEmployees(company.id);
        } else {
          setMessage(`Ошибка: ${responseData.error || 'Неизвестная ошибка'}`);
          setMessageType('error');
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        setMessage('Произошла ошибка при удалении сотрудника.');
        setMessageType('error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    console.log('Попытка создать компанию...');
    
    // Валидация обязательных полей
    if (!companyName || !binOrIin || !region || !contacts || !director) {
      console.error('Ошибка: Все поля должны быть заполнены');
      setMessage('Все поля должны быть заполнены');
      setMessageType('error');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Логируем отправку данных
      console.log('Данные для создания компании:', {
        name: companyName,
        binOrIin,
        region,
        contacts,
        director,
        ownerId: user.id,
      });
  
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: companyName, binOrIin, region, contacts, director, ownerId: user.id }),
      });
  
      // Логируем ответ от сервера на создание компании
      console.log('Ответ от сервера на создание компании:', response);
  
      const responseData = await response.json();
  
      if (response.ok) {
        // Логируем успешное создание компании
        console.log('Компания успешно создана:', responseData);
        setMessage('Компания успешно создана!');
        setMessageType('success');
        
        // Обновляем информацию о компании и сотрудниках
        fetchUserCompany();
      } else {
        // Логируем ошибку, если ответ не успешный
        console.error('Ошибка при создании компании:', responseData);
        setMessage('Ошибка при создании компании!');
        setMessageType('error');
      }
    } catch (error) {
      // Логируем ошибку запроса
      console.error('Ошибка при запросе на создание компании:', error);
      setMessage('Произошла ошибка при создании компании!');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  
  return (
    <Layout>
      {message && <Notification message={message} type={messageType} />}
      
      {isLoading ? (
        <p>Загрузка...</p>
      ) : company ? (
        <>
          <CompanyDetails company={company} />
          <EmployeesTable employees={employees} handleDeleteEmployee={handleDeleteEmployee} />
       
        </>
      ) : (
        <CompanyADDForm
          companyName={companyName}
          setCompanyName={setCompanyName}
          binOrIin={binOrIin}
          setBinOrIin={setBinOrIin}
          region={region}
          setRegion={setRegion}
          contacts={contacts}
          setContacts={setContacts}
          director={director}
          setDirector={setDirector}
          handleCompanySubmit={handleCompanySubmit}
        />
        
      )}


    </Layout>
  );
};

export default MyCompany;
