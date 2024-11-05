import { useEffect, useState } from 'react';
import ListingItem from '../components/ListingItem'; // Импортируем новый компонент
import Modal from '../components/Modal'; // Импортируем модальное окно
import { getResponseCounts } from '../utils/getResponseCounts'; // Импортируем утилиту
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext'; // Импортируем useAuth

const PublisherPage = () => {
  const { user, loading: loadingUser } = useAuth(); // Получаем данные пользователя и статус загрузки
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('published');
  const [responseCountsByStatus, setResponseCountsByStatus] = useState({});

  // Состояние для модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    if (user) {
      fetchListings(user.id);
    }
  }, [user]);

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

  if (loadingUser) {
    return (
      <Layout>
        <div className='flex w-full flex-col items-center justify-center'>
          {/* Скелетон для загрузки */}
          <div className="flex w-full flex-col gap-4">
            <div className="skeleton bg-base-200 h-32 w-full"></div>
            <div className="skeleton bg-base-200 h-4 w-28"></div>
            <div className="skeleton bg-base-200 h-4 w-full"></div>
            <div className="skeleton bg-base-200 h-4 w-full"></div>
          </div>
          <div className="flex w-full flex-col gap-4 mt-10">
            <div className="skeleton bg-base-200 h-32 w-full"></div>
            <div className="skeleton bg-base-200 h-4 w-28"></div>
            <div className="skeleton bg-base-200 h-4 w-full"></div>
            <div className="skeleton bg-base-200 h-4 w-full"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <p>Вы должны быть авторизованы для доступа к этой странице.</p>;
  }

  if (error) return <p>Ошибка: {error}</p>;

  const filteredListings = listings.filter((listing) =>
    activeTab === 'published' ? listing.published : !listing.published
  );

  return (
    <Layout>
      <div className=''>

        <div className='grid lg:grid-cols-2 items-center justify-center p-5'>
          <div className='py-5'> <h1>Ваши объявления</h1></div>
          <div className="flex w-full lg:justify-end justify-center items-center space-x-4">


            <button
              onClick={() => setActiveTab('published')}
              className={`btn  ${activeTab === 'published' ? 'btn-active' : 'bg-base-200'}`}
            >
              Опубликованные
            </button>
            <button
              onClick={() => setActiveTab('unpublished')}
              className={`btn ${activeTab === 'unpublished' ? 'btn-active' : 'bg-base-200'}`}
            >
              Не опубликованные
            </button>

          </div>
        </div>

        {filteredListings.length === 0 ? (
          <p>У вас нет объявлений.</p>
        ) : (
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
                    ) // Передаем функцию handleRepublish
                  }
                />
              );
            })}
          </ul>
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
