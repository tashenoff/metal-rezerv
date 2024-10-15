import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'; // Импортируем dynamic из next/dynamic
import Header from '../components/Header';
import Headlines from '../components/headlines';

// Импортируем react-quill динамически, чтобы избежать проблем с SSR
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // Импортируем стили для react-quill

const CreateListing = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(''); // Состояние для даты доставки
  const [purchaseDate, setPurchaseDate] = useState(''); // Новое состояние для даты заявки
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

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, deliveryDate, purchaseDate }), // Передаем дату закупа
      });

      if (response.ok) {
        setMessage('Объявление успешно добавлено!');
        setTitle('');
        setContent('');
        setDeliveryDate(''); // Сбрасываем поле даты доставки
        setPurchaseDate(''); // Сбрасываем поле даты заявки
      } else {
        const errorData = await response.json();
        setMessage(`Ошибка: ${errorData.error}` || 'Ошибка при добавлении объявления.');
      }
    } catch (error) {
      setMessage('Произошла ошибка при добавлении объявления.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-8">

      <Headlines title='Создание объявления' /> 

      {message && <p className="mt-4 text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Заголовок:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deliveryDate">
            Дата доставки:
          </label>
          <input
            type="date"
            id="deliveryDate"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)} // Обновляем состояние
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="purchaseDate">
            Дата заявки:
          </label>
          <input
            type="date"
            id="purchaseDate"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)} // Обновляем состояние
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
          />
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
  );
};

export default CreateListing;
