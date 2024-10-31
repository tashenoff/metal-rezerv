import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Notification from '../components/Notification';
import Input from '../components/Input';
import FormSelect from '../components/FormSelect';
import Textarea from '../components/Textarea';

const CreateListing = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [publicationPeriod, setPublicationPeriod] = useState('1d');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
    setIsClient(true);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке категорий');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Ошибка при получении категорий:', error);
    }
  };

  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const stripHtmlTags = (html) => {
    return html.replace(/<[^>]*>/g, ''); // Удаляет все HTML-теги
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const expirationDate = calculateExpirationDate(publicationPeriod);

    // Создаем объект данных для отправки
    const listingData = {
        title: escapeHtml(title),
        content: escapeHtml(stripHtmlTags(content)), // Очистка содержимого
        deliveryDate,
        purchaseDate,
        expirationDate,
        categoryId: selectedCategoryId,
    };

    // Логируем данные, которые будут отправлены на сервер
    console.log('Отправка данных на сервер:', listingData);

    try {
        const response = await fetch('/api/listings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(listingData),
        });

        if (response.ok) {
            setMessage('Объявление успешно добавлено!');
            setMessageType('success');
            setTitle('');
            setContent('');
            setDeliveryDate('');
            setPurchaseDate('');
            setPublicationPeriod('1d');
            setSelectedCategoryId('');
        } else {
            const errorData = await response.json();
            // Логируем ошибку, если она есть
            console.error('Ошибка при добавлении объявления:', errorData);
            setMessage(`Ошибка: ${errorData.error}` || 'Ошибка при добавлении объявления.');
            setMessageType('error');
        }
    } catch (error) {
        console.error('Произошла ошибка при добавлении объявления:', error);
        setMessage('Произошла ошибка при добавлении объявления.');
        setMessageType('error');
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
    return expirationDate.toISOString();
  };

  return (
    <Layout>
      {message && <Notification message={message} type={messageType} />}
      <div>
        <form className='grid grid-cols-12 gap-4' onSubmit={handleSubmit}>
          <div className='col-span-8 card bg-base-200 p-5'>
            <Input label="Заголовок" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Textarea
              id="content"
              placeholder="Содержимое:"
              value={content}
              onChange={setContent}
              required
            />
          </div>
          <div className='col-span-4 card bg-base-200 p-5'>
            <Input label="Дата доставки" type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} required />
            <Input label="Дата закупа" type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} required />
            <FormSelect
              label="Категория"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              options={[{ value: '', label: 'Выберите категорию' }, ...categories.map(category => ({ value: category.id, label: category.name }))]}
              required
            />
            <FormSelect
              label="Период публикации"
              value={publicationPeriod}
              onChange={(e) => setPublicationPeriod(e.target.value)}
              options={[
                { value: '5m', label: '5 минут' },
                { value: '1d', label: '1 день' },
                { value: '2d', label: '2 дня' },
                { value: '3d', label: '3 дня' },
              ]}
            />
            <button type="submit" className="btn btn-primary">
              Добавить объявление
            </button>
          </div>
        </form>
        <div className="output mt-5">
          <h2>Результат:</h2>
          <div>{stripHtmlTags(content)}</div> {/* Отображение чистого текста без тегов */}
        </div>
      </div>
    </Layout>
  );
};

export default CreateListing;
