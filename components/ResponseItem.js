import React, { useState } from 'react';
import ResponderInfo from './ResponderInfo'; // Импортируем ResponderInfo
import Modal from './Modal'; // Импортируем модальное окно

const ResponseItem = ({
    response,
    acceptedResponses,
    onAccept,
    onDecline,
    onResponderClick,
    expandedMessages,
    toggleMessageExpansion,
    acceptedResponseData,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для управления открытием модального окна
    const MESSAGE_LIMIT = 100;

    const handleShowContacts = () => {
        setIsModalOpen(true); // Открываем модальное окно
    };

    const closeModal = () => {
        setIsModalOpen(false); // Закрываем модальное окно
    };

    // Определяем цвет фона в зависимости от статуса отклика
    const getBackgroundColor = () => {
        if (response.accepted) {
            return 'bg-green-100'; // Принятый
        } else if (response.declined) {
            return 'bg-red-100'; // Отклоненный
        }
        return 'bg-blue-100'; // Обычный
    };

    console.log('acceptedResponses:', Array.from(acceptedResponses));
    console.log('response:', response);

    return (
        <li
            key={response.id}
            className={`flex flex-col p-4 max-w-xl ${getBackgroundColor()} rounded-lg shadow-sm`}
        >
            <div className={`${acceptedResponses.has(response.id) ? 'text-left' : 'text-left'}`}>
                {response.accepted && <span className="p-1 px-3 bg-green-600 rounded-full text-white text-sm font-semibold">Принят</span>}
                {response.declined && <span className="p-1 px-3 bg-red-600 rounded-full text-white text-sm font-semibold">Отклонен</span>}
                <p className="font-semibold mt-2">
                    <span className='flex items-center'>
                        <strong className='underline cursor-pointer' onClick={() => onResponderClick(response.responder)}>
                            {response.responder ? response.responder.name : 'Неизвестный'}
                        </strong>
                        <span className="py-2 ml-2">{response.createdAt}</span>
                    </span>
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

                {!response.accepted && !response.declined && (
                    <>
                        <button
                            onClick={() => onAccept(response.id, response.responder)}
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


                {/* Кнопка "Показать контакты" */}
                {response.accepted && acceptedResponseData[response.id] && (
                    <button
                        onClick={handleShowContacts} // Открытие модального окна
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Показать контакты
                    </button>
                )}

            </div>

            {/* Модальное окно для отображения информации о респонденте */}
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <ResponderInfo responderData={acceptedResponseData[response.id]} />
                </Modal>
            )}
        </li>
    );
};

export default ResponseItem;
