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
  const [description, setDescription] = useState(''); // Описание компании
  const [website, setWebsite] = useState(''); // Сайт компании
  const [workingHours, setWorkingHours] = useState(''); // График работы
  const [address, setAddress] = useState(''); // Адрес компании
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
      console.log('Данные для создания компании:', {
        name: companyName,
        binOrIin,
        region,
        contacts,
        director,
        description,
        website,
        workingHours,
        address,
        ownerId: user.id,
      });

      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: companyName,
          binOrIin,
          region,
          contacts,
          director,
          description,
          website,
          workingHours,
          address,
          ownerId: user.id,
        }),
      });

      console.log('Ответ от сервера на создание компании:', response);

      const responseData = await response.json();

      if (response.ok) {
        console.log('Компания успешно создана:', responseData);
        setMessage('Компания успешно создана!');
        setMessageType('success');
      } else {
        console.error('Ошибка при создании компании:', responseData);
        setMessage('Ошибка при создании компании!');
        setMessageType('error');
      }
    } catch (error) {
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
        <p className="text-center text-lg">Загрузка...</p>
      ) : (
        <form onSubmit={handleCompanySubmit} className="max-w-2xl mx-auto p-6 space-y-4 bg-white rounded-lg shadow-lg">
          <div className="form-control">
            <label className="label">Название компании:</label>
            <input
              type="text"
              className="input input-bordered"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">БИН или ИИН:</label>
            <input
              type="text"
              className="input input-bordered"
              value={binOrIin}
              onChange={(e) => setBinOrIin(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">Регион:</label>
            <input
              type="text"
              className="input input-bordered"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">Контакты:</label>
            <input
              type="text"
              className="input input-bordered"
              value={contacts}
              onChange={(e) => setContacts(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">Директор:</label>
            <input
              type="text"
              className="input input-bordered"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">Описание компании:</label>
            <textarea
              className="textarea textarea-bordered"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">Сайт компании:</label>
            <input
              type="url"
              className="input input-bordered"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">График работы:</label>
            <input
              type="text"
              className="input input-bordered"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">Адрес компании:</label>
            <input
              type="text"
              className="input input-bordered"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Создать компанию
          </button>
        </form>
      )}
    </Layout>
  );
};

export default CreateCompany;
