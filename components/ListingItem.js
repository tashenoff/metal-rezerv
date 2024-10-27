import { useState } from 'react';
import ResponseCounts from './ResponseCounts';
import Link from 'next/link';
import Modal from './Modal'; // Импортируем компонент модального окна
import StatusDisplay from './StatusDisplay'; // Импортируем StatusDisplay
import Card from './Card';

const ListingItem = ({ listing, responseCountsByStatus, isExpired, handlePublish, handleUnpublish, handleRepublish }) => {
    const [showModal, setShowModal] = useState(false); // Состояние для открытия/закрытия модального окна
    const [selectedPeriod, setSelectedPeriod] = useState(7); // Период для продления (по умолчанию 7 дней)

    // Открытие модального окна
    const handleOpenModal = () => {
        setShowModal(true);
    };

    // Закрытие модального окна
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Подтверждение продления публикации
    const handleSubmitRepublish = () => {
        const newExpirationDate = new Date();
        newExpirationDate.setDate(newExpirationDate.getDate() + selectedPeriod); // Устанавливаем новую дату окончания

        // Вызываем функцию повторной публикации с передачей новой даты
        handleRepublish(newExpirationDate);
        handleCloseModal(); // Закрываем модальное окно
    };

    return (
        <Card title={<Link href={`/listing/${listing.id}`}>
            <h2 className="text-xl font-bold">{listing.title}</h2>
        </Link>} key={listing.id} className="card dark:bg-base-200 rounded-lg p-4 shadow-md "
        
        content={ <p className="text-gray-700">{listing.content}</p>}
                >

           
            <p className="text-sm text-gray-500">
                Опубликовано: {new Date(listing.publishedAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
                Дата доставки: {new Date(listing.deliveryDate).toLocaleDateString()}
            </p>

            {isExpired && (
                <p className="text-red-500 font-bold">
                    Объявление "{listing.title}" автора {listing.authorName} больше не активно.
                </p>
            )}

            {/* Используем компонент StatusDisplay для отображения статуса публикации */}
            <StatusDisplay response={{ published: listing.published }} isPublicationStatus={true} />

            {/* Отображение количества откликов */}
            <ResponseCounts
                listingId={listing.id}
                responseCountsByStatus={responseCountsByStatus}
            />

            <div className="flex space-x-2 mt-2">

                {!isExpired && (
                    <>
                        <button
                            onClick={() => handlePublish(listing.id)}
                            disabled={listing.published}
                            className={`px-4 py-2 text-white rounded-md ${listing.published ? 'bg-gray-400' : 'bg-green-500'}`}
                        >
                            Опубликовать
                        </button>

                        <button
                            onClick={() => handleUnpublish(listing.id)}
                            disabled={!listing.published}
                            className={`px-4 py-2 text-white rounded-md ${!listing.published ? 'bg-gray-400' : 'bg-red-500'}`}
                        >
                            Снять с публикации
                        </button>
                    </>
                )}

                {/* Кнопка Возобновить, если объявление истекло */}
                {isExpired && (
                    <button
                        onClick={handleOpenModal}
                        className="px-4 py-2 text-white rounded-md bg-blue-500"
                    >
                        Возобновить
                    </button>
                )}
            </div>

            {/* Используем компонент Modal */}
            <Modal isOpen={showModal} onClose={handleCloseModal} modalMessage={<h3 className="text-xl font-bold">Выберите период возобновления</h3>}>
                <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                    className="mt-2 border p-2 rounded-md"
                >
                    <option value={7}>7 дней</option>
                    <option value={14}>14 дней</option>
                    <option value={30}>30 дней</option>
                </select>

                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={handleSubmitRepublish}
                        className="px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                        Подтвердить
                    </button>
                    <button
                        onClick={handleCloseModal}
                        className="px-4 py-2 bg-gray-300 rounded-md"
                    >
                        Отмена
                    </button>
                </div>
            </Modal>
        </Card>
    );
};

export default ListingItem;
