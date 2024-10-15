// components/ResponsesList.js
import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import SkeletonLoader from './SkeletonLoader'; // Импортируем SkeletonLoader

const ResponsesList = ({ responses, onAccept, onDecline }) => {
    const [visibleResponses, setVisibleResponses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [selectedResponder, setSelectedResponder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [responseToAccept, setResponseToAccept] = useState(null);
    const [acceptedResponses, setAcceptedResponses] = useState(new Set());
    const [acceptedResponseData, setAcceptedResponseData] = useState({});

    useEffect(() => {
        const storedAcceptedResponses = JSON.parse(localStorage.getItem('acceptedResponses')) || [];
        setAcceptedResponses(new Set(storedAcceptedResponses));

        const storedResponseData = JSON.parse(localStorage.getItem('acceptedResponseData')) || {};
        setAcceptedResponseData(storedResponseData);

        // Загружаем первые 5 откликов
        setVisibleResponses(responses.slice(0, 5));
    }, [responses]);

    useEffect(() => {
        const handleScroll = () => {
            const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;
            // Проверяем, дошли ли до конца страницы и есть ли еще отклики для загрузки
            if (bottom && !isLoading && visibleResponses.length < responses.length) {
                loadMoreResponses();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [visibleResponses, isLoading, responses]);

    const loadMoreResponses = () => {
        setIsLoading(true);
        setTimeout(() => {
            const nextResponses = responses.slice(visibleResponses.length, visibleResponses.length + 5);
            // Проверяем, есть ли еще отклики для загрузки
            if (nextResponses.length > 0) {
                setVisibleResponses((prev) => [...prev, ...nextResponses]);
            }
            setIsLoading(false);
        }, 1000);
    };

    const handleResponderClick = (responder) => {
        setSelectedResponder(responder);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedResponder(null);
    };

    const openConfirmation = (responseId, responder) => {
        setResponseToAccept(responseId);
        setSelectedResponder(responder);
        setIsConfirmationOpen(true);
    };

    const closeConfirmation = () => {
        setIsConfirmationOpen(false);
        setResponseToAccept(null);
        setSelectedResponder(null);
    };

    const confirmAcceptance = () => {
        if (responseToAccept) {
            onAccept(responseToAccept);
            const updatedAcceptedResponses = new Set(acceptedResponses).add(responseToAccept);
            setAcceptedResponses(updatedAcceptedResponses);
            localStorage.setItem('acceptedResponses', JSON.stringify(Array.from(updatedAcceptedResponses)));

            setAcceptedResponseData((prev) => {
                const updatedResponseData = {
                    ...prev,
                    [responseToAccept]: selectedResponder
                };
                localStorage.setItem('acceptedResponseData', JSON.stringify(updatedResponseData));
                return updatedResponseData;
            });
        }
        closeConfirmation();
    };

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Отклики:</h2>
            <ul className="space-y-4">
                {visibleResponses.map((response) => (
                    <li key={response.id} className="p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
                        {response.accepted && <span className="p-1 px-3 bg-green-600 rounded-full text-white text-sm font-semibold "> Принят</span>}
                        <p className="font-semibold mt-2">
                        <p className='py-2'>{response.createdAt}</p>
                            <strong>Сообщение:</strong> {response.message}
                        </p>
                        <div className='flex'>
                            <p className="text-sm text-gray-600">
                                <strong>Пользователь: {response.responder ? response.responder.name : 'Неизвестный'}</strong>
                            </p>
                        </div>
                        <span
                            className="cursor-pointer text-blue-500 underline my-5"
                            onClick={() => handleResponderClick(response.responder)}
                        >
                            посмотреть профиль пользователя
                        </span>

                        <div className="mt-2 flex space-x-2">
                            <button
                                onClick={() => openConfirmation(response.id, response.responder)}
                                className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 ${acceptedResponses.has(response.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={acceptedResponses.has(response.id)}
                            >
                                Принять
                            </button>
                            <button
                                onClick={() => onDecline(response.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                            >
                                Отклонить
                            </button>
                        </div>

                        {acceptedResponseData[response.id] && (
                            <div className="mt-4 p-2 border-t border-gray-300">
                                <h4 className="font-semibold">Информация о респонденте:</h4>
                                <p><strong>Имя:</strong> {acceptedResponseData[response.id].name}</p>
                                <p><strong>Организация:</strong> {acceptedResponseData[response.id].companyName}</p>
                                <p><strong>Дата Регистрации:</strong> {new Date(acceptedResponseData[response.id].registrationDate).toLocaleDateString()}</p>
                                <p><strong>Контактный Email:</strong> {acceptedResponseData[response.id].email}</p>
                                <p><strong>Телефон для связи:</strong> {acceptedResponseData[response.id].phoneNumber}</p>
                            </div>
                        )}
                    </li>
                ))}

                {/* Отображение индикатора загрузки только при загрузке новых откликов */}
                {isLoading && (
                    <li className="p-4">
                        <SkeletonLoader />
                    </li>
                )}
            </ul>

            {/* Используем компонент модального окна для отображения профиля респондента */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {selectedResponder && (
                    <div>
                        <h3 className="text-lg font-bold mb-2">Информация о пользователе</h3>
                        <p><strong>Имя:</strong> {selectedResponder.name}</p>
                        <p><strong>Организация:</strong> {selectedResponder.companyName}</p>
                        <p><strong>Дата Регистрации:</strong> {new Date(selectedResponder.registrationDate).toLocaleDateString()}</p>
                    </div>
                )}
            </Modal>

            {/* Используем компонент модального окна для подтверждения */}
            <Modal isOpen={isConfirmationOpen} onClose={closeConfirmation}>
                {selectedResponder && (
                    <div>
                        <h3 className="text-lg font-bold mb-2">Подтверждение</h3>
                        <p>
                            После принятия отклика, потенциальный исполнитель увидит ваши контактные данные. <br />
                            Вы уверены, что хотите предоставить свои данные для связи с <strong>{selectedResponder.name}</strong>?
                        </p>
                        <div className="mt-4 flex space-x-2">
                            <button
                                onClick={confirmAcceptance}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Да, согласен
                            </button>
                            <button
                                onClick={closeConfirmation}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Нет, отменить
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ResponsesList;
