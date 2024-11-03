// pages/listings/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext'; // Импортируем useAuth из AuthContext
import ResponsesList from '../../components/ResponsesList';
import ResponseForm from '../../components/ResponseForm';
import Modal from '../../components/Modal';
import UserResponses from '../../components/UserResponses';
import AuthorInfo from '../../components/AuthorInfo';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import DateDisplay from '../../components/DateDisplay';
import { unpublishListing } from '../../utils/unpublishListing';
import publishListing from '../../utils/publishListing';
import StatusDisplay from '../../components/StatusDisplay';

const ListingPage = (responseCountsByStatus) => {
    const [error, setError] = useState(null);
    const [listing, setListing] = useState(null);
    const [responses, setResponses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const router = useRouter();
    const { id } = router.query;
    const { user, loading } = useAuth(); // Используем данные пользователя и состояние загрузки из контекста

    useEffect(() => {
        if (id) {
            const fetchListing = async () => {
                try {
                    const response = await fetch(`/api/listings/${id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setListing(data);
                    } else {
                        setModalContent({
                            type: 'error',
                            message: 'Ошибка при загрузке объявления.',
                        });
                        setIsModalOpen(true);
                    }
                } catch (err) {
                    setModalContent({
                        type: 'error',
                        message: 'Ошибка при загрузке объявления: ' + err.message,
                    });
                    setIsModalOpen(true);
                }
            };

            fetchListing();

            const fetchResponses = async () => {
                const response = await fetch(`/api/responses?id=${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setResponses(data);
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
        try {
            const updatedListing = await unpublishListing(listingId);
            setListing(updatedListing);
        } catch (err) {
            setError(err.message);
        }
    };

    // Обработчик публикации
    const publish = async (listingId) => {
        try {
            const updatedListing = await publishListing(listingId);
            setListing(updatedListing);
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
        if (!user) {
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
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
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
            setIsModalOpen(true);
        }
    };

    const hasResponded = responses.some((response) => response.responderId === user?.id);

    const handleAcceptResponse = async (responseId) => {
        const response = await fetch(`/api/responses/acceptResponse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ responseId, userId: user?.id }),
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
            setIsModalOpen(true);
        }
    };

    const handleDeclineResponse = async (responseId) => {
        const response = await fetch(`/api/responses/declineResponse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
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
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
    };

    const handleOpenResponseForm = () => {
        if (user?.points <= 0) {
            setModalContent({
                type: 'error',
                message: 'У вас недостаточно кредов для отправки отклика.',
            });
        } else {
            setModalContent({
                type: 'form',
                message: 'Заполните форму для отклика:',
            });
        }
        setIsModalOpen(true);
    };

    if (loading) return <p>Загрузка...</p>; // Показать состояние загрузки пользователя
    if (!listing) return <p>Загрузка объявления...</p>;

    const isExpired = new Date(listing.expirationDate) < new Date();

    return (
        <>
            <Layout>

            <div className='grid grid-cols-12 gap-4 py-10'>
                <div className='col-span-8'>
                    <Card key={listing.id} title={listing.title} content={listing.content} link={`/listing/${listing.id}`}>
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

                    {user?.role !== 'PUBLISHER' && hasResponded && (
                        <UserResponses responses={responses} userId={user.id} />
                    )}

                    {user?.role === 'PUBLISHER' && listing.authorId === user.id && responses.length > 0 && (
                        <ResponsesList responses={responses} onAccept={handleAcceptResponse} onDecline={handleDeclineResponse} listingId={id} />
                    )}

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
                    <Card title={user?.role !== 'PUBLISHER' && (<span>Информация о клиенте</span>)}>
                        {user?.role === 'PUBLISHER' && listing.authorId === user.id && (
                            <>
                                <div className='flex items-center justify-between'>
                                    <span>Статус публикации</span>
                                    <StatusDisplay response={{ published: listing.published }} isPublicationStatus={true} />
                                </div>

                                {listing.published ? (
                                    <button className='btn btn-warning mt-5' onClick={() => onUnpublish(listing.id)}>Снять с публикации</button>
                                ) : (
                                    <>
                                        {isExpired ? (
                                            <button className='btn btn-primary mt-5' onClick={() => onRepublish(listing.id)}>Возобновить</button>
                                        ) : (
                                            <button className='btn btn-success mt-5' onClick={() => publish(listing.id)}>Опубликовать</button>
                                        )}
                                    </>
                                )}
                            </>
                        )}

                        {user?.role !== 'PUBLISHER' && (
                            <AuthorInfo author={listing.author} responses={responses.find(response => response.responderId === user?.id) || {}} expirationDate={listing.expirationDate} />
                        )}

                        {!isExpired && user?.role !== 'PUBLISHER' && !hasResponded && (
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
