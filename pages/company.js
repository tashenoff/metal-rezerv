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

            if (response.ok) {
                const newCompany = await response.json();  // Получаем данные новой компании
                setMessage('Компания успешно создана!');
                setMessageType('success');
                // Обновляем состояние компании и ее ID
                setCompany(newCompany.company);  // Обновляем данные компании
                setEmployees([]);  // Обнуляем список сотрудников, так как они будут обновлены
                fetchEmployees(newCompany.company.id);  // Перезапрашиваем сотрудников по ID новой компании
            } else {
                const errorData = await response.json();
                setMessage(`Ошибка: ${errorData.error}`);
                setMessageType('error');
            }
        } catch (error) {
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
            <div className="form-container">
                {!company ? (
                    <form className="company-form" onSubmit={handleCompanySubmit}>
                        <h2>Создание компании</h2>
                        <Input label="Название компании" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                        <Input label="BIN/IIN" value={binOrIin} onChange={(e) => setBinOrIin(e.target.value)} required />
                        <Input label="Регион" value={region} onChange={(e) => setRegion(e.target.value)} required />
                        <Input label="Контакты" value={contacts} onChange={(e) => setContacts(e.target.value)} />
                        <Input label="Директор" value={director} onChange={(e) => setDirector(e.target.value)} required />
                        <Button type="submit">Создать компанию</Button>
                    </form>
                ) : (
                    <div>
                        <h2>Моя компания</h2>
                        <p><strong>Название:</strong> {company.name}</p>
                        <p><strong>BIN/IIN:</strong> {company.binOrIin}</p>
                        <p><strong>Регион:</strong> {company.region}</p>
                        <p><strong>Контакты:</strong> {company.contacts}</p>
                        <p><strong>Директор:</strong> {company.director}</p>

                        <h3>Сотрудники компании</h3>
                        <ul>
                            {employees.length > 0 ? (
                                employees.map((employee) => (
                                    <li key={employee.id}>
                                        <p><strong>Имя:</strong> {employee.user.name}</p>
                                        <p><strong>Должность:</strong> {employee.role}</p>
                                        <p><strong>Электронная почта:</strong> {employee.user.email}</p>
                                    </li>
                                ))
                            ) : (
                                <p>Нет сотрудников в компании.</p>
                            )}
                        </ul>

                        <Button onClick={() => router.push('/create-employee')}>Перейти к добавлению сотрудников</Button>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default MyCompany;
