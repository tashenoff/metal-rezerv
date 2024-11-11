import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Импортируем useAuth из контекста
import Layout from '../components/Layout';
import Notification from '../components/Notification';
import Input from '../components/Input';
import Button from '../components/Button';
import { useRouter } from 'next/router';

const AddEmployee = () => {
  const { user, loading } = useAuth(); // Получаем user из контекста
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Проверка, если пользователь не авторизован, перенаправляем на страницу логина
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
    }
  }, [user, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    // Логируем данные перед отправкой
    console.log('Отправка данных:', { userId, role, companyId: user?.companyId });
  
    // Преобразуем userId и companyId в числа, если это необходимо
    const userIdInt = parseInt(userId, 10);
    const companyIdInt = user?.companyId;
  
    if (!userIdInt || !role || !companyIdInt) {
      setMessage('Ошибка: Все поля обязательны для заполнения');
      setMessageType('error');
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch('/api/companies/add-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userIdInt, companyId: companyIdInt, role }), // Передаем как числа
      });
  
      if (response.ok) {
        setMessage('Сотрудник успешно добавлен!');
        setMessageType('success');
      } else {
        const errorData = await response.json();
        setMessage(`Ошибка: ${errorData.error}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Произошла ошибка при добавлении сотрудника.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };
  

  // Логируем текущий user
  console.log('Текущий пользователь:', user);

  return (
    <Layout>
      {message && <Notification message={message} type={messageType} />}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2>Добавить сотрудника</h2>
          <Input
            label="ID пользователя"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
          <Input
            label="Роль"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Загрузка...' : 'Добавить сотрудника'}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default AddEmployee;
