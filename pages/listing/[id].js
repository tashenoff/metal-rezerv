import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import ListingInfo from '../../components/ListingInfo';
import PublisherControls from '../../components/PublisherControls';
import ClientControls from '../../components/ClientControls';
import ResponsesList from '../../components/ResponsesList';
import UserResponses from '../../components/UserResponses';
import { unpublishListing } from '../../utils/unpublishListing';
import publishListing from '../../utils/publishListing';
import Modal from '../../components/Modal';
import ResponseForm from '../../components/ResponseForm';


const ListingPage = () => {
    const [listing, setListing] = useState(null);
    const [responses, setResponses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null); // Идентификатор пользователя

    const router = useRouter();
    const { id } = router.query;
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (user) {
            setUserId(user.id); // Устанавливаем идентификатор пользователя, если user существует
        }
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            if (!router.isReady || !id) return; // Ждем, пока router станет готовым и id станет доступным

            setLoading(true);
            setError(null);
            try {
                // Загрузка объявления
                const listingResponse = await fetch(`/api/listings/${id}`);
                if (!listingResponse.ok) throw new Error(`Ошибка загрузки объявления: ${listingResponse.statusText}`);

                // Проверка на тип содержимого
                const contentType = listingResponse.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    const text = await listingResponse.text();
                    throw new Error(`Ожидался JSON, но получен: ${text}`);
                }

                const listingData = await listingResponse.json();
                setListing(listingData);

                // Загрузка откликов
                const responsesResponse = await fetch(`/api/responses?id=${id}`);
                if (!responsesResponse.ok) throw new Error(`Ошибка загрузки откликов: ${responsesResponse.statusText}`);

                const responsesData = await responsesResponse.json();
                setResponses(responsesData);
            } catch (err) {
                setError(err.message);
                console.error("Ошибка:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, router.isReady]); // Зависимости для useEffect

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
    const onPublish = async (listingId) => {
        try {
            const updatedListing = await publishListing(listingId);
            setListing(updatedListing);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleOpenResponseForm = () => {
        if (!user) {
            setModalContent({
                type: 'error',
                message: 'Отклики доступны только для авторизованных пользователей.',
            });
        } else if (user.points <= 0) {
            setModalContent({
                type: 'error',
                message: 'У вас недостаточно баллов для отправки отклика.',
            });
        } else {
            setModalContent({
                type: 'form',
                message: 'Заполните форму для отклика:',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
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

    if (authLoading || loading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error}</p>;
    if (!listing) return <p>Объявление не найдено.</p>;

    const isExpired = new Date(listing?.expirationDate) < new Date();
    const hasResponded = responses.some((response) => response.responderId === user?.id);

    return (
        <Layout>
            <div className='grid lg:grid-cols-12 gap-4 py-10'>
                <div className='lg:col-span-8 '>
                    <ListingInfo listing={listing} />
                    {user?.role !== 'PUBLISHER' && hasResponded && <UserResponses responses={responses} userId={user.id} />}
                    {user?.role === 'PUBLISHER' && listing.authorId === user.id && responses.length > 0 && (
                        <ResponsesList
                            responses={responses}
                            onAccept={handleAcceptResponse}
                            onDecline={handleDeclineResponse}
                            listingId={id}
                        />
                    )}
                </div>

                <div className='lg:col-span-4'>
                    {user?.role === 'PUBLISHER' && listing.authorId === user.id ? (
                        <PublisherControls
                            listing={listing}
                            isExpired={isExpired}
                            listingId={listing.id}
                            onUnpublish={onUnpublish}
                            onPublish={onPublish}
                        />
                    ) : (
                        <ClientControls
                            user={user}
                            listing={listing}
                            responses={responses}
                            onOpenResponseForm={handleOpenResponseForm}
                            hasResponded={hasResponded}
                            isExpired={isExpired}
                        />
                    )}
                </div>
            </div>

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
                        </div>
                    )
                ) : null}
            </Modal>
        </Layout>
    );
};

export default ListingPage;
