// components/InviteEmployeeForm.js
import { useState } from 'react';

const InviteEmployeeForm = ({ companyId, onInvite }) => {
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !role) {
      setError('Пожалуйста, укажите пользователя и роль.');
      return;
    }

    try {
      // Отправка запроса на добавление сотрудника
      const res = await fetch(`/api/companies/employees?companyId=${companyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage('Пользователь успешно приглашен!');
        onInvite(); // Обновление списка сотрудников
      } else {
        setError(data.error || 'Произошла ошибка при приглашении пользователя.');
      }
    } catch (error) {
      setError('Произошла ошибка. Попробуйте снова.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Пригласить сотрудника</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="userId" className="block text-sm font-semibold text-gray-700">ID пользователя</label>
          <input
            id="userId"
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="block text-sm font-semibold text-gray-700">Роль</label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Пригласить
        </button>
      </form>
    </div>
  );
};

export default InviteEmployeeForm;
