import React, { useState } from 'react';
import ResponderInfo from './ResponderInfo'; // Импортируем ResponderInfo
import Modal from './Modal'; // Импортируем модальное окно
import Card from './Card'; // Импортируем Card
import StatusDisplay from './StatusDisplay'; // Импортируем компонент StatusDisplay
import DateDisplay from './DateDisplay'; // Импортируем компонент даты

const ResponseItem = ({
    response,
    acceptedResponses,
    onAccept,
    onDecline,
    onResponderClick,
    acceptedResponseData,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для управления открытием модального окна

    const handleShowContacts = () => {
        setIsModalOpen(true); // Открываем модальное окно
    };

    const closeModal = () => {
        setIsModalOpen(false); // Закрываем модальное окно
    };

    console.log('acceptedResponses:', Array.from(acceptedResponses));
    console.log('response:', response);

    return (
        <Card title={response.responder ? response.responder.name : 'Неизвестный'}
        content= {response.message}
        
        >
            <div className={`flex flex-col py-4 rounded-lg shadow-sm`}>
                <div className="flex flex-col items-start">

                    <span className="py-2">
                        {/* Используем компонент DateDisplay для отображения даты */}
                        <DateDisplay label="Дата отклика" date={response.createdAt} />
                    </span>

                 
                </div>



                <div className={`mt-2 flex space-x-2`}>
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
            </div>

            {/* Модальное окно для отображения информации о респонденте */}
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <ResponderInfo responderData={acceptedResponseData[response.id]} />
                </Modal>
            )}
        </Card>
    );
};

export default ResponseItem;
