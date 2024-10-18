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
    const [expandedMessages, setExpandedMessages] = useState(new Set()); // Для отслеживания длинных сообщений

    const MESSAGE_LIMIT = 100; // Лимит символов для краткого отображения

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

    // Функция для переключения состояния "Показать больше/меньше"
    const toggleMessageExpansion = (id) => {
        setExpandedMessages((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Отклики:</h2>
            <ul className="space-y-4">
                {visibleResponses.map((response) => (
                    <li
                        key={response.id}
                        className={`flex flex-col p-4 max-w-xl ${acceptedResponses.has(response.id) ? 'self-end bg-green-100' : 'bg-blue-100'} rounded-lg shadow-sm`}
                    >
                        <div className={`${acceptedResponses.has(response.id) ? 'text-left' : 'text-left'}`}>
                            {response.accepted && <span className="p-1 px-3 bg-green-600 rounded-full text-white text-sm font-semibold">Принят</span>}
                            <p className="font-semibold mt-2">
                                <p className='flex items-center'>
                                    <strong className='underline cursor-pointer' onClick={() => handleResponderClick(response.responder)}>{response.responder ? response.responder.name : 'Неизвестный'}</strong>
                                    <p className="py-2 ml-2">{response.createdAt}</p>
                                </p>
                                <strong>Сообщение:</strong> 
                                {expandedMessages.has(response.id) ? (
                                    <>
                                        {response.message}
                                        <button className="text-blue-500 ml-2" onClick={() => toggleMessageExpansion(response.id)}>Скрыть</button>
                                    </>
                                ) : (
                                    <>
                                        {response.message.length > MESSAGE_LIMIT ? (
                                            <>
                                                {response.message.slice(0, MESSAGE_LIMIT)}...
                                                <button className="text-blue-500 ml-2" onClick={() => toggleMessageExpansion(response.id)}>Показать больше</button>
                                            </>
                                        ) : (
                                            response.message
                                        )}
                                    </>
                                )}
                            </p>
                        </div>

                        <div className={`mt-2 flex space-x-2 ${acceptedResponses.has(response.id) ? 'justify-start' : 'justify-start'}`}>
                            {!acceptedResponses.has(response.id) && (
                                <>
                                    <button
                                        onClick={() => openConfirmation(response.id, response.responder)}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                                    >
                                        Принять
                                    </button>
                                    <button
                                        onClick={() => onDecline(response.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                                    >
                                        Отклонить
                                    </button>
                                </>
                            )}
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

                {isLoading && (
                    <li className="p-4">
                        <SkeletonLoader />
                    </li>
                )}
            </ul>

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
                                Нет, закрыть
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ResponsesList;
