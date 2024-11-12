import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext'; // Контекст аутентификации
import Layout from '../components/Layout';
import Notification from '../components/Notification';
import Input from '../components/Input';
import Button from '../components/Button';

const MyCompany = () => {
    const { user, loading } = useAuth(); // Получаем информацию о пользователе
    const [company, setCompany] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [binOrIin, setBinOrIin] = useState('');
    const [region, setRegion] = useState('');
    const [contacts, setContacts] = useState('');
    const [director, setDirector] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Состояние для прелоадера
    const router = useRouter();

    useEffect(() => {
        if (loading) {
            return;
        }

        if (!user) {
            router.push('/login');
            return;
        }

        fetchUserCompany(); // Функция для получения информации о компании
    }, [user, loading]);

    const fetchUserCompany = async () => {
        setIsLoading(true);
        try {
            if (!user.companyId) {
                setCompany(null);
                setEmployees([]); // Если у пользователя нет компании, очищаем сотрудников
                return; // Если у пользователя нет companyId, не делаем запрос
            }

            const response = await fetch(`/api/companies/${user.companyId}`); // Используем companyId
            if (response.ok) {
                const data = await response.json();
                setCompany(data.company); // Загружаем данные о компании
                fetchEmployees(data.company.id); // Загружаем сотрудников компании
            } else {
                setCompany(null); // Компания не найдена
                setEmployees([]); // Очищаем список сотрудников
            }
        } catch (error) {
            console.error('Ошибка при получении данных о компании:', error);
            setCompany(null);
            setEmployees([]); // Очищаем список сотрудников при ошибке
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEmployees = async (companyId) => {
        if (!companyId) {
            return; // Если companyId нет, не делаем запрос
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/companies/${companyId}/employees`);
            if (response.ok) {
                const employeesData = await response.json();
                setEmployees(employeesData); // Загружаем сотрудников
            } else {
                setEmployees([]); // Если нет сотрудников
            }
        } catch (error) {
            console.error('Ошибка при получении сотрудников:', error);
            setEmployees([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompanySubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
  
      try {
          const response = await fetch('/api/companies', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  name: companyName,
                  binOrIin: binOrIin,
                  region: region,
                  contacts: contacts,
                  director, // Устанавливаем выбранного директора
                  ownerId: user.id, // Используем user.id как ownerId
              }),
          });
  
          const responseData = await response.json();
          console.log('Full Response:', responseData);  // Логируем полный ответ
  
          if (response.ok) {
              // Проверяем наличие объекта компании в ответе
              if (responseData && responseData.company) {
                  const newCompany = responseData.company;  // Получаем данные новой компании
                  setMessage('Компания успешно создана!');
                  setMessageType('success');
                  setCompany(newCompany);  // Обновляем данные компании
                  setEmployees([]);  // Обнуляем список сотрудников
                  fetchEmployees(newCompany.id);  // Перезапрашиваем сотрудников
              } else {
                  setMessage('Ошибка: Сервер не вернул корректные данные о компании.');
                  setMessageType('error');
              }
          } else {
              // Ошибка на сервере, выводим подробности
              setMessage(`Ошибка: ${responseData.error || 'Неизвестная ошибка'}`);
              setMessageType('error');
          }
      } catch (error) {
          console.error('Ошибка при создании компании:', error);  // Логируем ошибку
          setMessage('Произошла ошибка при создании компании.');
          setMessageType('error');
      } finally {
          setIsLoading(false);
      }
  };
  

    const resetForm = () => {
        setCompanyName('');
        setBinOrIin('');
        setRegion('');
        setContacts('');
        setDirector(''); // Очистить поле директора
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-bars loading-lg"></span>
            </div>
        );
    }

    return (
      <Layout>
      {message && <Notification message={message} type={messageType} />}
      <div className=" mx-auto py-6  rounded-lg shadow-md">
        {!company ? (
          <form className="space-y-6 p-5 rounded-lg bg-base-100" onSubmit={handleCompanySubmit}>
            <h2 className="text-2xl font-semibold text-center text-primary">Создание компании</h2>
            <div className="space-y-4">
              <Input
                label="Название компании"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="w-full p-3 border border-neutral rounded-lg"
              />
              <Input
                label="BIN/IIN"
                value={binOrIin}
                onChange={(e) => setBinOrIin(e.target.value)}
                required
                className="w-full p-3 border border-neutral rounded-lg"
              />
              <Input
                label="Регион"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                required
                className="w-full p-3 border border-neutral rounded-lg"
              />
              <Input
                label="Контакты"
                value={contacts}
                onChange={(e) => setContacts(e.target.value)}
                className="w-full p-3 border border-neutral rounded-lg"
              />
              <Input
                label="Директор"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                required
                className="w-full p-3 border border-neutral rounded-lg"
              />
            </div>
            <Button type="submit" className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-focus">
              Создать компанию
            </Button>
          </form>
        ) : (
          <div className="space-y-6 ">
            <h2 className="text-xl font-semibold">Моя компания</h2>

            <div className="overflow-x-auto bg-base-100 ">
              <table className="table w-full table-compact">
                <thead>
                  <tr>
                    <th className="text-center">Название</th>
                    <th className="text-center">BIN/IIN</th>
                    <th className="text-center">Регион</th>
                    <th className="text-center">Контакты</th>
                    <th className="text-center">Директор</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover">
                    <td className="text-center">{company.name}</td>
                    <td className="text-center">{company.binOrIin}</td>
                    <td className="text-center">{company.region}</td>
                    <td className="text-center">{company.contacts}</td>
                    <td className="text-center">{company.director}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mt-6">Сотрудники компании</h3>
            <div className="overflow-x-auto bg-base-100">
              <table className="table w-full table-compact">
                <thead>
                  <tr>
                    <th className="text-center">Имя</th>
                    <th className="text-center">Должность</th>
                    <th className="text-center">Электронная почта</th>
                    <th className="text-center">дата добавления</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length > 0 ? (
                    employees.map((employee) => (
                      <tr key={employee.id} className="hover">
                        <td className="text-center">{employee.user.name}</td>
                        <td className="text-center">{employee.role}</td>
                        <td className="text-center">{employee.user.email}</td>
                        <td className="text-center">{employee.user.joinedAt}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">Нет сотрудников в компании.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Button
              onClick={() => router.push('/create-employee')}
              className="w-full py-3 bg-accent text-white rounded-lg hover:bg-accent-focus mt-6"
            >
              Перейти к добавлению сотрудников
            </Button>
          </div>
        )}
      </div>
    </Layout>
    );
};

export default MyCompany;
