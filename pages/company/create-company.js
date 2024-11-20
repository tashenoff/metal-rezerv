import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import Notification from '../../components/Notification';

const CreateCompany = () => {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [binOrIin, setBinOrIin] = useState('');
  const [region, setRegion] = useState('');
  const [contacts, setContacts] = useState('');
  const [director, setDirector] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      ) : (
        <form onSubmit={handleCompanySubmit}>
          <div>
            <label>Название компании:</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          <div>
            <label>БИН или ИИН:</label>
            <input
              type="text"
              value={binOrIin}
              onChange={(e) => setBinOrIin(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Регион:</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Контакты:</label>
            <input
              type="text"
              value={contacts}
              onChange={(e) => setContacts(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Директор:</label>
            <input
              type="text"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
              required
            />
          </div>

          <button type="submit">Создать компанию</button>
        </form>
      )}
    </Layout>
  );
};

export default CreateCompany;
