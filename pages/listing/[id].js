// pages/listings/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import ResponsesList from '../../components/ResponsesList';
import ResponseForm from '../../components/ResponseForm'; // Импортируем ResponseForm
import Modal from '../../components/Modal'; // Импортируем Modal

const ListingPage = () => {
    const [listing, setListing] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [role, setRole] = useState(null); // Роль пользователя
    const [userId, setUserId] = useState(null); // Идентификатор пользователя
    const [responses, setResponses] = useState([]);
    const [userPoints, setUserPoints] = useState(0); // Баллы пользователя
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние модального окна
    const [modalMessage, setModalMessage] = useState(''); // Сообщение модального окна
    const [feedbackType, setFeedbackType] = useState(''); // 'success' или 'error'

    const router = useRouter();
    const { id } = router.query; // Используйте id

    useEffect(() => {
        if (id) {
            const fetchListing = async () => {
                const response = await fetch(`/api/listings/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setListing(data);
                } else {
                    setFeedback('Ошибка при загрузке объявления.');
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
                const response = await fetch(`/api/responses?id=${id}`); // Изменено на id
                if (response.ok) {
                    const data = await response.json();
                    setResponses(data); // Устанавливаем отклики
                } else {
                    setFeedback('Ошибка при загрузке откликов.');
                }
            };

            fetchResponses();
        }
    }, [id]);

    const getResponseStatus = (response) => {
        if (response.accepted === true) return 'Принят';
        if (response.accepted === false) return 'Отклонён';
        if (response.accepted === null || response.accepted === undefined) return 'На рассмотрении';
    };

    const handleResponseSubmit = async (message) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setFeedbackType('error');
            setFeedback('Вы должны быть авторизованы для отправки отклика.');
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
    
            const responseText = await response.text();
    
            if (response.ok) {
                const newResponse = JSON.parse(responseText);
                setResponses((prevResponses) => [...prevResponses, newResponse]);
                setFeedbackType('success');
                setFeedback('Отклик успешно отправлен!');
            } else {
                try {
                    const errorData = JSON.parse(responseText); // Преобразуем ответ в JSON
                    setFeedbackType('error');
                    setFeedback(errorData.message);
                } catch {
                    // Если не удалось распарсить JSON, выводим сам ответ как текст
                    setFeedbackType('error');
                    setFeedback(`Ошибка при отправке отклика: ${responseText}`);
                }
            }
        } catch (error) {
            setFeedbackType('error');
            setFeedback(`Ошибка сети: ${error.message}`);
        } finally {
            setIsModalOpen(true);
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
            setFeedback('Отклик принят!');
        } else {
            const errorData = await response.json();
            setFeedback(`Ошибка при принятии отклика: ${errorData.message}`);
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
            setFeedback('Отклик отклонён!');
            setResponses((prevResponses) =>
                prevResponses.map((resp) =>
                    resp.id === responseId ? { ...resp, accepted: false } : resp
                )
            );
        } else {
            const errorData = await response.json();
            setFeedback(`Ошибка при отклонении отклика: ${errorData.message}`);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if (!listing) {
        return <p>Загрузка...</p>;
    }

    return (
        <>
            <Header />
            <div className="container mx-auto">
                <div className="w-1/2 py-10">
                    {listing.author && listing.author.isCompanyVerified !== undefined ? (
                        listing.author.isCompanyVerified ? (
                            <div className='flex items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mr-1 text-blue-500">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745  0 0 1 21 12Z" />
                                </svg>
                                <p className="text-blue-500">Компания верифицирована</p>
                            </div>
                        ) : (
                            <p className="text-gray-500">Компания не верифицирована</p>
                        )
                    ) : (
                        <p className="text-gray-500">(Нет информации о верификации)</p>
                    )}

                    <p className="text-gray-600">Автор: {listing.author.name}</p>
                    <h1 className="text-2xl font-bold mb-4">{listing.title}</h1>
                    <p className="mb-2">{listing.content}</p>

                    <p className="text-gray-600">Дата публикации: {new Date(listing.publishedAt).toLocaleDateString()}</p>
                    <p className="text-gray-600">Срок поставки: {new Date(listing.deliveryDate).toLocaleDateString()}</p>
                    <p className="text-gray-600">Срок закупки: {new Date(listing.purchaseDate).toLocaleDateString()}</p>
                </div>

                {role !== 'PUBLISHER' && hasResponded && (
                    <div className="mt-4 border p-3 rounded shadow">
                        <h3 className="text-lg font-semibold">Ваш отклик:</h3>
                        {responses
                            .filter((response) => response.responderId === userId)
                            .map((response) => (
                                <div key={response.id} className="mt-2">
                                    <p><strong>Сообщение:</strong> {response.message}</p>
                                    <p><strong>Дата отклика:</strong> {new Date(response.createdAt).toLocaleDateString()}</p>
                                    <p><strong>Статус:</strong> {getResponseStatus(response)}</p>
                                </div>
                            ))}
                    </div>
                )}

                {role !== 'PUBLISHER' && !hasResponded && (
                    <ResponseForm onSubmit={handleResponseSubmit} />
                )}

                {role === 'PUBLISHER' && listing.authorId === userId && responses.length > 0 && (
                    <>
                        
                        <ResponsesList
                            responses={responses}
                            onAccept={handleAcceptResponse}
                            onDecline={handleDeclineResponse}
                        />
                    </>
                )}

                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <p className={`mt-2 ${feedbackType === 'success' ? 'text-blue-500' : 'text-red-500'}`}>
                        {feedback}
                    </p>

                    {/* Если есть ошибка, показать кнопку "Купить баллы" */}
                    {feedbackType === 'error' && (
                        <button
                            className="mt-4 bg-green-500 text-white p-2 rounded"
                            onClick={() => window.location.href = '/buy-credits'}
                        >Купить баллы
                        </button>
                    )}
                </Modal>

            </div>
        </>
    );
};

export default ListingPage;
