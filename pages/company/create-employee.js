import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import Notification from '../../components/Notification';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useRouter } from 'next/router';
import { addEmployee } from '../../services/api'; // Импортируем функцию

const AddEmployee = () => {
  const { user, loading } = useAuth();
  const [userId, setUserId] = useState('');
  const [roleId, setRoleId] = useState('');
  const [roles, setRoles] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
    }

    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/companies/roles');
        if (response.ok) {
          const data = await response.json();
          setRoles(data);
        } else {
          setMessage('Не удалось загрузить роли');
          setMessageType('error');
        }
      } catch (error) {
        console.error('Ошибка загрузки ролей:', error);
        setMessage('Ошибка при загрузке ролей');
        setMessageType('error');
      }
    };

    fetchRoles();
  }, [user, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    const userIdInt = parseInt(userId, 10);
    const companyIdInt = user?.companyId;
  
    if (isNaN(userIdInt)) {
      setMessage('Ошибка: ID пользователя должен быть числом');
      setMessageType('error');
      setIsLoading(false);
      return;
    }
  
    if (!userIdInt || !roleId || !companyIdInt) {
      setMessage('Ошибка: Все поля обязательны для заполнения');
      setMessageType('error');
      setIsLoading(false);
      return;
    }
  
    try {
      // Передаем roleId вместо role
      await addEmployee({
        userId: userIdInt,
        companyId: companyIdInt,
        roleId: parseInt(roleId, 10),  // Передаем roleId
      });
      setMessage('Сотрудник успешно добавлен!');
      setMessageType('success');
      setUserId('');
      setRoleId('');
    } catch (error) {
      setMessage(error.message || 'Произошла ошибка при добавлении сотрудника.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };
  
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
          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            required
            className="select select-bordered mb-5 w-full"
          >
            <option value="">Выберите роль</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name} {role.description ? `(${role.description})` : ''}
              </option>
            ))}
          </select>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Загрузка...' : 'Добавить сотрудника'}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default AddEmployee;
