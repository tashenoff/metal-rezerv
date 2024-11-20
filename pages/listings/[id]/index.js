// ListingPage.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../contexts/AuthContext';
import Info from './info';
import Responses from './responses';
import Layout from '../../../components/Layout';
import PublisherControls from '../../../components/PublisherControls';
import ClientControls from '../../../components/ClientControls';
import Modal from '../../../components/Modal';
import ResponseForm from '../../../components/ResponseForm';

import { onUnpublish, onPublish } from './listingHandlers'; // импортируем функции



const ListingPage = () => {
    const [listing, setListing] = useState(null);
    const [responses, setResponses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null); // Идентификатор пользователя
    const [loadingModal, setLoadingModal] = useState(false); // Индикатор загрузки в модальном окне
    


    const router = useRouter();
    const { id } = router.query;
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (user) {
            console.log('User loaded:', user);
            setUserId(user.id);
            console.log('User Company:', user.company); // Логируем компанию
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

                // Получаем companyId из данных о компании (author.company.id)
                const companyId = listingData.author?.company?.id;

          
                // Загрузка откликов
                const responsesResponse = await fetch(`/api/responses?id=${id}`);
                if (!responsesResponse.ok) throw new Error(`Ошибка загрузки откликов: ${responsesResponse.statusText}`);

                const responsesData = await responsesResponse.json();
                // Add companyId to each response
                const responsesWithCompany = responsesData.map((response) => ({
                    ...response,
                    companyId: response.responder?.company?.id, // Add companyId from responder
                }));

                // Логируем companyId для каждого респондера
                responsesData.forEach((response) => {
                    const responderCompanyId = response.responder?.company?.id;
                    console.log("Responder Company ID:", responderCompanyId); // Выводим companyId респондера
                });

                


                // Сохраняем отклики с добавленным companyId
                setResponses(responsesWithCompany);

            } catch (err) {
                setError(err.message);
                console.error("Ошибка:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, router.isReady]); // Зависимости для useEffect




    const handleOpenResponseForm = () => {
        
        if (!user) {
            setModalContent({
                type: 'error',
                message: 'Отклики доступны только для авторизованных пользователей.',
            });
        } else if (!user.company && !user.companyId) {
            // Проверяем наличие компании по companyId, если объект company равен null
            setModalContent({
                type: 'error',
                message: 'Вы не можете откликаться, так как у вас нет привязанной компании.',
            });
        } else if (user.points <= 0) {
            setModalContent({
                type: 'error',
                message: 'У вас недостаточно баллов для отправки отклика.',
            });
        } else if (user.company?.moderationStatus !== 'APPROVED') {
            // Логируем модерацию компании перед проверкой
           
            setModalContent({
                type: 'error',
                message: 'Вы не можете откликаться, так как ваша компания еще не прошла модерацию.',
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
        setModalContent(null); // Очищаем модальное содержание при закрытии
        setLoadingModal(false); // Сброс состояния загрузки модального окна
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

        setLoadingModal(true); // Начинаем загрузку в модальном окне
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
            setLoadingModal(false); // Завершаем загрузку в модальном окне
            setIsModalOpen(true);
        }
    };

    const handleAcceptResponse = async (responseId) => {
        try {
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

                // Открываем модальное окно с уведомлением об успешном принятии
                setModalContent({
                    type: 'success',
                    message: 'Отклик успешно принят!',
                });
                setIsModalOpen(true);
            } else {
                const errorData = await response.json();
                setModalContent({
                    type: 'error',
                    message: `Ошибка при принятии отклика: ${errorData.message}`,
                });
                setIsModalOpen(true);
            }
        } catch (error) {
            setModalContent({
                type: 'error',
                message: `Ошибка сети: ${error.message}`,
            });
            setIsModalOpen(true);
        }
    };

    const handleDeclineResponse = async (responseId) => {
        try {
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
                setIsModalOpen(true);
            } else {
                const errorData = await response.json();
                setModalContent({
                    type: 'error',
                    message: `Ошибка при отклонении отклика: ${errorData.message}`,
                });
                setIsModalOpen(true);
            }
        } catch (error) {
            setModalContent({
                type: 'error',
                message: `Ошибка сети: ${error.message}`,
            });
            setIsModalOpen(true);
        }
    };

    if (authLoading || loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <span className="loading loading-bars loading-lg"></span>
                </div>
            </Layout>
        );
    }


    if (error) return <p>Ошибка: {error}</p>;
    if (!listing) return <p>Объявление не найдено.</p>;

    const isExpired = new Date(listing?.expirationDate) < new Date();
    const hasResponded = responses.some((response) => response.responderId === user?.id);

    return (
        <Layout>
            <div className='grid lg:grid-cols-12 gap-4 py-10'>
                <div className='lg:col-span-8'>
                    <Info listing={listing} />
                    <Responses
                        responses={responses}
                        user={user}
                        listing={listing}
                  
                        handleAcceptResponse={handleAcceptResponse}
                        handleDeclineResponse={handleDeclineResponse}


                    />
                </div>
                <div className='lg:col-span-4'>
                    {user?.role === 'PUBLISHER' && listing.authorId === user.id ? (
                        <PublisherControls
                            listing={listing}
                            isExpired={isExpired}
                            listingId={listing.id}
                            onUnpublish={(listingId) => onUnpublish(listingId, setListing, setError)}
                            onPublish={(listingId) => onPublish(listingId, setListing, setError)}
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
                            <div className="relative">
                                {loadingModal && (
                                    <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-10">
                                        <span className="loading loading-bars loading-lg"></span>
                                    </div>
                                )}
                                <ResponseForm onSubmit={handleResponseSubmit} />
                            </div>
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
