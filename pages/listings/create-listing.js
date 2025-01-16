import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext'; // Импортируем контекст аутентификации
import Layout from '../../components/Layout';
import Notification from '../../components/ui/Notification';
import Input from '../../components/ui/Input';
import FormSelect from '../../components/ui/FormSelect';
import Textarea from '../../components/ui/Textarea';
import { fetchCategories, createListing } from '../../services/api'; // Импортируем API функции

const CreateListing = () => {
  const { user, loading } = useAuth(); // Получаем информацию о пользователе
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [publicationPeriod, setPublicationPeriod] = useState('1d');
  const [purchaseMethod, setPurchaseMethod] = useState(''); // Новый state для метода закупки
  const [paymentTerms, setPaymentTerms] = useState(''); // Новый state для условий оплаты
  const [type, setType] = useState('product'); // Новый state для типа объявления (товар или услуга)
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // Тип сообщения (успех или ошибка)
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Если пользователь не аутентифицирован и загрузка завершена, перенаправляем на страницу входа
    if (!loading && !user) {
      router.push('/login');
    }

    // Проверяем, есть ли у пользователя компания
    if (user && !user.companyId) {
      setMessage('Для создания объявления необходимо сначала создать компанию.');
      setMessageType('error');
      return;
    }

    // Получаем категории, если пользователь аутентифицирован
    if (user) {
      fetchCategoriesData();
    }
  }, [user, loading]);

  const fetchCategoriesData = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      setMessage('Ошибка при загрузке категорий');
      setMessageType('error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const expirationDate = calculateExpirationDate(publicationPeriod);

    const listingData = {
      title,
      content,
      deliveryDate,
      purchaseDate,
      expirationDate,
      categoryId: selectedCategoryId,
      purchaseMethod,
      paymentTerms,
      type,
    };

    try {
      await createListing(listingData, token);
      setMessage('Объявление успешно добавлено!');
      setMessageType('success');
      resetForm();
    } catch (error) {
      setMessage(error.message || 'Произошла ошибка при добавлении объявления.');
      setMessageType('error');
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setDeliveryDate('');
    setPurchaseDate('');
    setPublicationPeriod('1d');
    setSelectedCategoryId('');
    setPurchaseMethod('');
    setPaymentTerms('');
    setType('product');
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
      <div className="">
        <form className='grid lg:grid-cols-12 gap-4' onSubmit={handleSubmit}>
          <div className='lg:col-span-8 card bg-base-200 p-5'>
            <Input label="Заголовок" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Textarea
              id="content"
              placeholder="Содержимое:"
              value={content}
              onChange={setContent}
              required
            />
          </div>
          <div className='lg:col-span-4 card bg-base-200 p-5'>
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
              label="Метод закупки"
              value={purchaseMethod}
              onChange={(e) => setPurchaseMethod(e.target.value)}
              options={[ 
                { value: '', label: 'Выберите метод' },
                { value: 'price-reduction', label: 'Понижение цены' },
                { value: 'price-quote', label: 'Запрос ценового предложения' }
              ]}
              required
            />
            <Input
              label="Условия оплаты"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              placeholder="Например, 50% предоплата"
            />
            <FormSelect
              label="Тип объявления"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={[
                { value: 'product', label: 'Товар' },
                { value: 'service', label: 'Услуга' },
              ]}
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
      </div>
    </Layout>
  );
};

export default CreateListing;
