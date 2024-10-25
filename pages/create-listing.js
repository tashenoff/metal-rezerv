import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Headlines from '../components/headlines';
import Layout from '../components/Layout';
import Card from '../components/Card';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const CreateListing = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [publicationPeriod, setPublicationPeriod] = useState('1d'); // Состояние для периода публикации
  const [message, setMessage] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
    setIsClient(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Вычисляем дату окончания публикации
    const expirationDate = calculateExpirationDate(publicationPeriod);

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, deliveryDate, purchaseDate, expirationDate }), // Передаем дату окончания публикации
      });

      if (response.ok) {
        setMessage('Объявление успешно добавлено!');
        setTitle('');
        setContent('');
        setDeliveryDate('');
        setPurchaseDate('');
        setPublicationPeriod('1d'); // Сбрасываем поле периода публикации
      } else {
        const errorData = await response.json();
        setMessage(`Ошибка: ${errorData.error}` || 'Ошибка при добавлении объявления.');
      }
    } catch (error) {
      setMessage('Произошла ошибка при добавлении объявления.');
    }
  };

  const calculateExpirationDate = (period) => {
    const now = new Date();
    let expirationDate = new Date(now);

    switch (period) {
      case '5m':
        expirationDate.setMinutes(expirationDate.getMinutes() + 5);
        break;
      case '1d':
        expirationDate.setDate(expirationDate.getDate() + 1);
        break;
      case '2d':
        expirationDate.setDate(expirationDate.getDate() + 2);
        break;
      case '3d':
        expirationDate.setDate(expirationDate.getDate() + 3);
        break;
      default:
        break;
    }

    return expirationDate.toISOString(); // Возвращаем дату в формате ISO
  };

  return (
    <Layout>
      <div className="min-h-screen ">
        <div className="container mx-auto p-8">
          <Headlines title='Создание объявления' />

          {message && <p className="mt-4 text-red-500">{message}</p>}
         
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="title">
                  Заголовок:
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3  focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="content">
                  Содержимое:
                </label>
                {isClient && (
                  <ReactQuill
                    value={content}
                    onChange={setContent}
                    required
                    className="shadow appearance-none border rounded w-full"
                  />
                )}
              </div>
              <div className="mb-4">
                <label className="block  text-sm font-bold mb-2" htmlFor="deliveryDate">
                  Дата доставки:
                </label>
                <input
                  type="date"
                  id="deliveryDate"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3  focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="purchaseDate">
                  Дата закупа:
                </label>
                <input
                  type="date"
                  id="purchaseDate"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block  text-sm font-bold mb-2" htmlFor="publicationPeriod">
                  Период публикации:
                </label>
                <select
                  id="publicationPeriod"
                  value={publicationPeriod}
                  onChange={(e) => setPublicationPeriod(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 focus:outline-none focus:ring focus:ring-blue-500"
                >
                  <option value="5m">5 минут</option>
                  <option value="1d">1 день</option>
                  <option value="2d">2 дня</option>
                  <option value="3d">3 дня</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300"
              >
                Добавить объявление
              </button>
            </form>
         
        </div>
      </div>
    </Layout>
  );
};

export default CreateListing;
