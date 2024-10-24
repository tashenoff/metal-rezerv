import { useEffect, useState } from 'react';
import ListingItem from '../components/ListingItem'; // Импортируем новый компонент
import Modal from '../components/Modal'; // Импортируем модальное окно
import { getResponseCounts } from '../utils/getResponseCounts'; // Импортируем утилиту
import Layout from '../components/Layout';

const PublisherPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('published');
  const [responseCountsByStatus, setResponseCountsByStatus] = useState({});

  // Состояние для модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/user', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const user = await response.json();
            setUserId(user.id);
            await fetchListings(user.id);
          } else {
            setError('Ошибка при загрузке данных пользователя.');
          }
        } catch (err) {
          setError('Ошибка при загрузке данных пользователя.');
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    } else {
      setError('Вы должны быть авторизованы для доступа к объявлениям.');
      setLoading(false);
    }
  }, []);

  const fetchListings = async (userId) => {
    try {
      const response = await fetch('/api/publisher/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setListings(data);
        await fetchResponseCountsByStatus(data);
      } else {
        setError('Ошибка при загрузке объявлений.');
      }
    } catch (err) {
      setError('Ошибка при загрузке объявлений.');
    }
  };

  const fetchResponseCountsByStatus = async (listings) => {
    const counts = await getResponseCounts(listings); // Используем утилиту
    setResponseCountsByStatus(counts);
};

  // Функция для повторной публикации объявления
  const handleRepublish = async (listingId, newExpirationDate) => {
    try {
      const response = await fetch('/api/publisher/republishListing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingId, newExpirationDate }),
      });

      if (response.ok) {
        const updatedListing = await response.json();
        setListings((prevListings) =>
          prevListings.map((listing) =>
            listing.id === updatedListing.id ? updatedListing : listing
          )
        );
      } else {
        setError('Ошибка при повторной публикации объявления.');
      }
    } catch (err) {
      setError('Ошибка при повторной публикации объявления.');
    }
  };

  // Обработчик открытия модального окна для подтверждения
  const handleOpenModal = (content, action) => {
    setModalContent(content);
    setConfirmAction(() => action);
    setIsModalOpen(true);
  };

  const handlePublish = async (listingId) => {
    try {
      const response = await fetch('/api/publisher/publishListing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingId }),
      });

      if (response.ok) {
        const updatedListing = await response.json();
        setListings((prevListings) =>
          prevListings.map((listing) =>
            listing.id === updatedListing.id ? updatedListing : listing
          )
        );
      } else {
        setError('Ошибка при публикации объявления.');
      }
    } catch (err) {
      setError('Ошибка при публикации объявления.');
    }
  };

  const handleUnpublish = async (listingId) => {
    try {
      const response = await fetch('/api/publisher/unpublishListing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingId }),
      });

      if (response.ok) {
        const updatedListing = await response.json();
        setListings((prevListings) =>
          prevListings.map((listing) =>
            listing.id === updatedListing.id ? updatedListing : listing
          )
        );
      } else {
        setError('Ошибка при снятии объявления с публикации.');
      }
    } catch (err) {
      setError('Ошибка при снятии объявления с публикации.');
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  const filteredListings = listings.filter((listing) =>
    activeTab === 'published' ? listing.published : !listing.published
  );


  return (
    <Layout>
    <div className=''>
      <div className="container mx-auto">
        <div className="flex items-center my-4 justify-between">
          <h1>Ваши объявления</h1>
          <div>
            <button
              onClick={() => setActiveTab('published')}
              className={`px-4 py-2 rounded-md ${activeTab === 'published' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Опубликованные
            </button>
            <button
              onClick={() => setActiveTab('unpublished')}
              className={`px-4 py-2 rounded-md ${activeTab === 'unpublished' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Не опубликованные
            </button>
          </div>
        </div>
      </div>

      {filteredListings.length === 0 ? (
        <p>У вас нет объявлений.</p>
      ) : (
        <div className="container mx-auto">
          <ul className="space-y-4">
            {filteredListings.map((listing) => {
              const isExpired = new Date() > new Date(listing.expirationDate); // Проверяем, истек ли срок

              return (
                  <ListingItem
                    key={listing.id}
                    listing={listing}
                    responseCountsByStatus={responseCountsByStatus}
                    isExpired={isExpired}
                    handlePublish={() =>
                      handleOpenModal('Вы уверены, что хотите опубликовать это объявление?', () => handlePublish(listing.id))
                    }
                    handleUnpublish={() =>
                      handleOpenModal('Вы уверены, что хотите снять это объявление с публикации?', () => handleUnpublish(listing.id))
                    }
                    handleRepublish={(newExpirationDate) =>
                      handleOpenModal('Вы уверены, что хотите продлить публикацию этого объявления?', () =>
                        handleRepublish(listing.id, newExpirationDate)
                      )
                    } // Передаем функцию handleRepublish
                  />
              );
            })}
          </ul>
        </div>
      )}

      {/* Модальное окно */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <p>{modalContent}</p>
        <div className="flex justify-end mt-4">
          <button className="mr-2 px-4 py-2 bg-gray-200 rounded-md" onClick={() => setIsModalOpen(false)}>
            Отмена
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={() => {
            confirmAction(); // Выполняем подтвержденное действие
            setIsModalOpen(false);
          }}>
            Подтвердить
          </button>
        </div>
      </Modal>
    </div>
    </Layout>
  );
};

export default PublisherPage;
