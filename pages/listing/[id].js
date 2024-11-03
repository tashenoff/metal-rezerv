// pages/listings/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ResponsesList from '../../components/ResponsesList';
import ResponseForm from '../../components/ResponseForm'; 
import Modal from '../../components/Modal'; // Импортируем Modal
import UserResponses from '../../components/UserResponses';
import AuthorInfo from '../../components/AuthorInfo';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import DateDisplay from '../../components/DateDisplay'; // Импортируем компонент даты
import { unpublishListing } from '../../utils/unpublishListing';
import publishListing from '../../utils/publishListing';
import StatusDisplay from '../../components/StatusDisplay'; // Импортируйте ваш компонент

const ListingPage = (responseCountsByStatus) => {
    const [error, setError] = useState(null); // Добавляем состояние для ошибок
    const [listing, setListing] = useState(null);

    const [role, setRole] = useState(null); // Роль пользователя
    const [userId, setUserId] = useState(null); // Идентификатор пользователя
    const [responses, setResponses] = useState([]);
    const [userPoints, setUserPoints] = useState(0); // Баллы пользователя
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние модального окна
    const [modalContent, setModalContent] = useState(null); // Состояние для содержимого модального окна

    const router = useRouter();
    const { id } = router.query; // Используйте id

    useEffect(() => {
        if (id) {
            const fetchListing = async () => {
                try {
                    const response = await fetch(`/api/listings/${id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setListing(data);
                    } else {
                        // Если произошла ошибка при загрузке объявления
                        setModalContent({
                            type: 'error',
                            message: 'Ошибка при загрузке объявления.',
                        });
                        setIsModalOpen(true);
                    }
                } catch (err) {
                    // Если произошла ошибка в процессе выполнения запроса
                    setModalContent({
                        type: 'error',
                        message: 'Ошибка при загрузке объявления: ' + err.message,
                    });
                    setIsModalOpen(true);
                }
            };


            fetchListing();

            const token = localStorage.getItem('token');
            if (token) {
                const fetchUserData = async () => {
                    const response = await fetch('/api/user', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (response.ok) {
                        const user = await response.json();
                        setRole(user.role); // Сохраняем роль пользователя
                        setUserId(user.id); // Сохраняем идентификатор пользователя
                        setUserPoints(user.points); // Сохраняем баллы пользователя
                    }
                };
                fetchUserData();
            }

            const fetchResponses = async () => {
                const response = await fetch(`/api/responses?id=${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setResponses(data); // Устанавливаем отклики
                } else {
                    setModalContent({
                        type: 'error',
                        message: 'Ошибка при загрузке откликов.',
                    });
                    setIsModalOpen(true);
                }
            };

            fetchResponses();
        }
    }, [id]);

    // Обработчик снятия с публикации
    const onUnpublish = async (listingId) => {
        console.log('Снимаем с публикации объявление с ID:', listingId); // Логирование
        try {
            const updatedListing = await unpublishListing(listingId); // Удаляем параметр setListings
            setListing(updatedListing); // Обновляем состояние listing
        } catch (err) {
            setError(err.message);
        }
    };



    // Обработчик публикации
    const publish = async (listingId) => {
        console.log('Публикуем объявление с ID:', listingId); // Логирование
        try {
            const updatedListing = await publishListing(listingId); // Получаем обновленное объявление
            setListing(updatedListing); // Обновляем состояние listing
        } catch (err) {
            setError(err.message);
        }
    };


    const getResponseStatus = (response) => {
        if (response.accepted === true) return 'Принят';
        if (response.accepted === false) return 'Отклонён';
        return 'На рассмотрении';
    };

    const handleResponseSubmit = async (message) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setModalContent({
                type: 'error',
                message: 'Вы должны быть авторизованы для отправки отклика.',
            });
            setIsModalOpen(true);
            return;
        }

        try {
            const response = await fetch('/api/responses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    listingId: id,
                    message: message,
                }),
            });

            if (response.ok) {
                const newResponse = await response.json();
                setResponses((prevResponses) => [...prevResponses, newResponse]);
                setModalContent({
                    type: 'success',
                    message: 'Отклик успешно отправлен!',
                });
            } else {
                const errorData = await response.json();
                setModalContent({
                    type: 'error',
                    message: errorData.message,
                });
            }
        } catch (error) {
            setModalContent({
                type: 'error',
                message: `Ошибка сети: ${error.message}`,
            });
        } finally {
            setIsModalOpen(true); // Открываем модальное окно
        }
    };

    const hasResponded = responses.some((response) => response.responderId === userId);

    const handleAcceptResponse = async (responseId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/responses/acceptResponse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ responseId, userId }),
        });

        if (response.ok) {
            setResponses((prevResponses) =>
                prevResponses.map((resp) =>
                    resp.id === responseId ? { ...resp, accepted: true } : resp
                )
            );
        } else {
            const errorData = await response.json();
            setModalContent({
                type: 'error',
                message: `Ошибка при принятии отклика: ${errorData.message}`,
            });
            setIsModalOpen(true); // Открываем модальное окно для ошибки
        }
    };


    const handleDeclineResponse = async (responseId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/responses/declineResponse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ responseId }),
        });

        if (response.ok) {
            setResponses((prevResponses) =>
                prevResponses.map((resp) =>
                    resp.id === responseId ? { ...resp, accepted: false } : resp
                )
            );
            setModalContent({
                type: 'success',
                message: 'Отклик отклонён!',
            });
        } else {
            const errorData = await response.json();
            setModalContent({
                type: 'error',
                message: `Ошибка при отклонении отклика: ${errorData.message}`,
            });
        }
        setIsModalOpen(true); // Открываем модальное окно
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalContent(null); // Сбрасываем содержимое модального окна
    };

    const handleOpenResponseForm = () => {
        // Проверка на недостаток баллов
        if (userPoints <= 0) {
            setModalContent({
                type: 'error',
                message: 'У вас недостаточно кред для отправки отклика.',
            });
        } else {
            setModalContent({
                type: 'form',
                message: 'Заполните форму для отклика:',
            });
        }
        setIsModalOpen(true); // Открываем модальное окно
    };

    if (!listing) {
        return <p>Загрузка...</p>;
    }

    const isExpired = new Date(listing.expirationDate) < new Date();

    return (
        <>
            <Layout>

                <div className='grid grid-cols-12 gap-4 py-10 '>
                    <div className='col-span-8 '>

                        <Card
                            key={listing.id}
                            title={listing.title}
                            content={listing.content}
                            link={`/listing/${listing.id}`}

                        >
                            <DateDisplay label="Дата публикации" date={listing.publishedAt} />
                            <div className="grid grid-cols-3 gap-4 py-5">

                                <div className="py-2 px-2 text-center text-sm rounded-full bg-base-100 shadow">
                                    <DateDisplay label="Дата доставки" date={listing.deliveryDate} />
                                </div>
                                <div className="py-2 px-2 text-center text-sm rounded-full bg-base-100 shadow">
                                    <DateDisplay label="Дата закупки" date={listing.purchaseDate} />
                                </div>
                                <div className="py-2 px-2 text-center text-sm rounded-full bg-base-100 shadow">
                                    <DateDisplay date={listing.expirationDate} label="Актуально до" isExpirationDate={true} />
                                </div>
                            </div>


                        </Card>

                        {role !== 'PUBLISHER' && hasResponded && (
                            <UserResponses responses={responses} userId={userId} />


                        )}



                        {role === 'PUBLISHER' && listing.authorId === userId && responses.length > 0 && (
                            <ResponsesList
                                responses={responses}
                                onAccept={handleAcceptResponse}
                                onDecline={handleDeclineResponse}
                                listingId={id}
                            />
                        )}

                        {/* Модальное окно для отображения формы или сообщений */}
                        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                            {modalContent ? (
                                modalContent.type === 'form' ? (
                                    <>
                                        <p>{modalContent.message}</p>
                                        <ResponseForm onSubmit={handleResponseSubmit} />
                                    </>
                                ) : (
                                    <div>
                                        <p className={`mt-2 ${modalContent.type === 'success' ? 'text-blue-500' : 'text-red-500'}`}>
                                            {modalContent.message}
                                        </p>
                                        {/* Кнопка для покупки баллов при ошибке */}
                                        {modalContent.type === 'error' && (
                                            <button
                                                className="mt-4 bg-green-500 text-white p-2 rounded"
                                                onClick={() => window.location.href = '/buy-credits'}
                                            >
                                                Купить баллы
                                            </button>
                                        )}
                                    </div>
                                )
                            ) : null}
                        </Modal>

                    </div>

                    <div className='col-span-4'>
                        <Card title={role !== 'PUBLISHER' && (<span>Информация о клиенте</span>)}>
                            {role === 'PUBLISHER' && listing.authorId === userId && (

                                <>
                                    <div className='flex items-center justify-between'>
                                        <span>Статус публикации</span>
                                        <StatusDisplay response={{ published: listing.published }} isPublicationStatus={true} />
                                    </div>
                                    <div className='flex items-center justify-between mt-5'>

                                        {/* <DateDisplay label='Cрок публикации' date={listing.expirationDate} /> */}
                                    </div>

                                    {listing.published ? (
                                        <>
                                            {/* Если объявление опубликовано, показываем кнопку для снятия с публикации */}
                                            <button className='btn btn-warning mt-5' onClick={() => onUnpublish(listing.id)}>Снять с публикации</button>
                                        </>
                                    ) : (
                                        <>
                                            {isExpired ? (
                                                // Если срок истек, показываем кнопку для возобновления
                                                <button className='btn btn-primary mt-5' onClick={() => onRepublish(listing.id)}>Возобновить</button>
                                            ) : (
                                                // Если объявление не опубликовано и срок не истек, показываем кнопку для публикации
                                                <button className='btn btn-success mt-5' onClick={() => publish(listing.id)}>Опубликовать</button>
                                            )}
                                        </>
                                    )}

                                </>

                            )}


                            {role !== 'PUBLISHER' && (
                                <>
                                    <AuthorInfo
                                        author={listing.author}
                                        responses={responses.find(response => response.responderId === userId) || {}} // Находим отклик текущего пользователя
                                        expirationDate={listing.expirationDate}
                                    />



                                </>
                            )}

                            {/* Кнопка для открытия формы отклика, если срок не истек */}
                            {!isExpired && role !== 'PUBLISHER' && !hasResponded && (
                                <button
                                    className="btn btn-primary mt-5 w-full text-white p-2 rounded"
                                    onClick={handleOpenResponseForm}
                                >
                                    Откликнуться
                                </button>
                            )}

                        </Card>



                    </div>
                </div>
            </Layout>
        </>
    );
};

export default ListingPage;
