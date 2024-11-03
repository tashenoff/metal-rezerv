import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import SkeletonLoader from './SkeletonLoader'; // Импортируем SkeletonLoader
import ResponseItem from './ResponseItem'; // Импортируем ResponseItem
import TabbedNavigation from './TabbedNavigation'; // Импортируем TabbedNavigation
import { getResponseCounts } from '../utils/getResponseCounts';

const ResponsesList = ({ responses, onAccept, onDecline, listingId }) => {
    const [visibleResponses, setVisibleResponses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedResponder, setSelectedResponder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [responseToAccept, setResponseToAccept] = useState(null);
    const [acceptedResponses, setAcceptedResponses] = useState(new Set());
    const [acceptedResponseData, setAcceptedResponseData] = useState({});
    const [expandedMessages, setExpandedMessages] = useState(new Set()); // Для отслеживания длинных сообщений
    const [currentStatus, setCurrentStatus] = useState('pending'); // Текущий статус
    const [isSorted, setIsSorted] = useState(false); // Добавляем новое состояние
    const [responseCounts, setResponseCounts] = useState({});


    useEffect(() => {
        const storedAcceptedResponses = JSON.parse(localStorage.getItem('acceptedResponses')) || [];
        setAcceptedResponses(new Set(storedAcceptedResponses));

        const storedResponseData = JSON.parse(localStorage.getItem('acceptedResponseData')) || {};
        setAcceptedResponseData(storedResponseData);

        // Загружаем отклики по текущему статусу
        loadResponsesByStatus(currentStatus);
        console.log('listingId:', listingId); // Проверьте значение здесь

        const fetchCounts = async () => {
            const counts = await getResponseCounts([{ id: listingId }]);
            setResponseCounts(counts[listingId] || {});
        };

        fetchCounts();

        console.log('Текущий статус:', currentStatus);


    }, [responses, listingId]);



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

    const loadResponsesByStatus = (status) => {
        setIsLoading(true);

        const filteredResponses = responses.filter(response => {
            const responseStatus = response.status === 'processed' ? 'approved' : response.status; // Изменяем статус при фильтрации
            return responseStatus === status;
        });

        console.log('Отфильтрованные отклики:', filteredResponses);
        setVisibleResponses(filteredResponses.slice(0, 5));
        setIsLoading(false);
        setIsSorted(true);
    };


    const loadMoreResponses = () => {
        setIsLoading(true);
        setTimeout(() => {
            const nextResponses = responses.filter(response => response.status === currentStatus)
                .slice(visibleResponses.length, visibleResponses.length + 5);
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

            <TabbedNavigation
                onTabChange={(status) => {
                    setCurrentStatus(status);
                    loadResponsesByStatus(status); // Загружаем отклики при смене вкладки
                }}
                responseCounts={responseCounts.counts} // Передаем количество откликов
                isSorted={isSorted} // Передаем статус сортировки
            />

            <ul className="space-y-4">
                {visibleResponses.map((response) => (
                    <ResponseItem
                        key={response.id}
                        response={response}
                        acceptedResponses={acceptedResponses}
                        onAccept={openConfirmation}
                        onDecline={onDecline}
                        onResponderClick={handleResponderClick}
                        expandedMessages={expandedMessages}
                        toggleMessageExpansion={toggleMessageExpansion}
                        acceptedResponseData={acceptedResponseData}
                    />
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
