import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext'; // Импортируем контекст аутентификации
import Layout from '../../components/Layout';
import Notification from '../../components/ui/Notification';
import Input from '../../components/ui/Input';
import FormSelect from '../../components/ui/FormSelect';
import Textarea from '../../components/ui/Textarea';
import FileUploader from '../../components/FileUploader';
import AttachmentList from '../../components/AttachmentList';
import { fetchCategories, createListing } from '../../services/api'; // Импортируем API функции
import { useSession } from 'next-auth/react';

const CreateListing = () => {
  const { user, loading } = useAuth(); // Получаем информацию о пользователе
  const { data: session } = useSession(); // Получаем сессию NextAuth
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
  const [createdListingId, setCreatedListingId] = useState(null); // ID созданного объявления
  const [attachments, setAttachments] = useState([]); // Прикрепленные файлы
  const [selectedFiles, setSelectedFiles] = useState([]); // Выбранные файлы для загрузки
  const [isUploading, setIsUploading] = useState(false); // Состояние загрузки файлов
  const [uploadError, setUploadError] = useState(''); // Ошибка загрузки файлов
  const fileInputRef = useRef(null); // Ref для доступа к input file
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

    // Получаем категории, если пользователь аутентифицирован и есть сессия NextAuth
    if (user && session) {
      fetchCategoriesData();
    }
  }, [user, loading, session]);

  const fetchCategoriesData = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      setMessage('Ошибка при загрузке категорий');
      setMessageType('error');
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setUploadError('');
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const uploadFiles = async (listingId) => {
    if (!selectedFiles.length) return;
    
    setIsUploading(true);
    setUploadError('');
    
    // Больше не используем token из localStorage
    const uploadPromises = selectedFiles.map(async (file) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('listingId', String(listingId));
        
        // Авторизация будет автоматически добавлена через куки сессии NextAuth
        const response = await fetch('/api/upload/simple', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Ошибка загрузки файла ${file.name}`);
        }
        
        const data = await response.json();
        return data.attachment;
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        throw error;
      }
    });
    
    try {
      const uploadedAttachments = await Promise.all(uploadPromises);
      setAttachments(uploadedAttachments);
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      setUploadError('Произошла ошибка при загрузке некоторых файлов');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Больше не используем token из localStorage
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
      setMessage('');
      setMessageType('');
      
      // Больше не передаем token в функцию createListing
      const result = await createListing(listingData);
      
      if (result && result.id) {
        setCreatedListingId(result.id);
        
        // Если есть выбранные файлы, загружаем их
        if (selectedFiles.length > 0) {
          try {
            await uploadFiles(result.id);
            setMessage('Объявление успешно добавлено с прикрепленными файлами!');
          } catch (error) {
            setMessage('Объявление добавлено, но возникла проблема с загрузкой файлов.');
          }
        } else {
          setMessage('Объявление успешно добавлено!');
        }
        
        setMessageType('success');
      } else {
        resetForm();
      }
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
    setCreatedListingId(null);
    setAttachments([]);
    setSelectedFiles([]);
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  // Обработчик добавления нового вложения
  const handleAttachmentUpload = (attachment) => {
    setAttachments((prev) => [...prev, attachment]);
  };
  
  // Обработчик удаления вложения
  const handleAttachmentDelete = (attachmentId) => {
    setAttachments((prev) => prev.filter((att) => att.id !== attachmentId));
  };
  
  // Функция перехода к объявлению
  const handleViewListing = () => {
    if (createdListingId) {
      router.push(`/listings/${createdListingId}`);
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

  // Функция для форматирования размера файла
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <Layout>
      {message && <Notification message={message} type={messageType} />}
      
      {createdListingId ? (
        // После создания объявления показываем результат и кнопки действий
        <div className="bg-white p-5 rounded-lg shadow-md">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Объявление успешно создано!</h2>
            <p className="text-gray-600">
              Ваше объявление успешно создано и{attachments.length > 0 ? ' файлы прикреплены.' : ' готово к публикации.'}
            </p>
          </div>
          
          {attachments.length > 0 && (
            <AttachmentList 
              attachments={attachments} 
              canDelete={true} 
              onDelete={handleAttachmentDelete} 
              token={localStorage.getItem('token')}
            />
          )}
          
          <div className="mt-6 flex justify-between">
            <button 
              onClick={resetForm} 
              className="btn btn-outline"
            >
              Создать новое объявление
            </button>
            
            <button 
              onClick={handleViewListing} 
              className="btn btn-primary"
            >
              Перейти к объявлению
            </button>
          </div>
        </div>
      ) : (
        // Форма создания объявления
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
              
              {/* Блок для загрузки файлов */}
              <div className="mt-6 p-4 bg-gray-50 rounded border">
                <h3 className="text-lg font-semibold mb-2">Прикрепить файлы</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Вы можете прикрепить документы и изображения к объявлению (PDF, DOC, DOCX, JPG, PNG и др.)
                </p>
                
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                
                {uploadError && (
                  <div className="mt-2 p-2 bg-red-50 text-red-700 rounded">
                    {uploadError}
                  </div>
                )}
                
                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Выбранные файлы:</h4>
                    <ul className="space-y-1">
                      {selectedFiles.map((file, index) => (
                        <li key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">
                              {file.type.startsWith('image/') ? '🖼️' : 
                               file.type.includes('pdf') ? '📄' : 
                               file.type.includes('word') ? '📝' : 
                               file.type.includes('excel') ? '📊' : '📎'}
                            </span>
                            <span className="truncate" style={{ maxWidth: '200px' }}>{file.name}</span>
                            <span className="ml-2 text-xs text-gray-500">({formatBytes(file.size)})</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => removeSelectedFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
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
              <button 
                type="submit" 
                className="btn btn-primary w-full mt-4"
                disabled={isUploading}
              >
                {isUploading ? 'Загрузка файлов...' : 'Создать объявление'}
              </button>
              
              {selectedFiles.length > 0 && (
                <p className="text-center text-sm mt-2 text-gray-600">
                  Будет загружено файлов: {selectedFiles.length}
                </p>
              )}
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
};

// Проверка авторизации на сервере
export async function getServerSideProps(context) {
  const { getServerSession } = await import('next-auth/next');
  const { authOptions } = await import('../../pages/api/auth/[...nextauth]');
  
  const session = await getServerSession(context.req, context.res, authOptions);
  
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  
  // Sanitize the session to ensure all undefined values are replaced with null
  const sanitizedSession = JSON.parse(JSON.stringify(session || {}));
  
  return {
    props: {
      session: sanitizedSession,
    },
  };
}

export default CreateListing;
