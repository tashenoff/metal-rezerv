import { useState } from 'react';
import ResponseCounts from './ResponseCounts';
import Modal from './Modal'; // Импортируем компонент модального окна
import StatusDisplay from './StatusDisplay'; // Импортируем StatusDisplay
import DateDisplay from './DateDisplay'; // Импортируем компонент даты
import Link from 'next/link'; // Импортируем компонент ссылки

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
        <div className='card bg-base-100 p-5'>
            <div className='flex items-center  border-b border-base-200 w-full py-5'>
                <Link className='card-title' href={`/listing/${listing.id}`}>{listing.title}</Link>
            </div>


            <p className='card-body px-0 py-2'>{listing.content}</p>



            <div className="grid lg:grid-cols-3 gap-4 py-5">
                <div className="py-2 px-2 text-center text-sm rounded-full bg-base-300 shadow">

                    <DateDisplay label="Опубликовано" date={listing.publishedAt} />

                </div>
                <div className="py-2 px-2 text-center text-sm rounded-full bg-base-300 shadow">

                    <DateDisplay label="Дата доставки" date={listing.deliveryDate} />
                </div>
            </div>

            <div className='flex items-center justify-between w-full py-5'>
                <span className='text-sm'>Статус публикации:</span>
                <StatusDisplay response={{ published: listing.published }} isPublicationStatus={true} />
            </div>

            {isExpired && (
                <p className="text-red-500 font-bold">
                    Объявление "{listing.title}" автора {listing.authorName} больше не активно.
                </p>
            )}



            {/* Отображение количества откликов */}
            <ResponseCounts
                listingId={listing.id}
                responseCountsByStatus={responseCountsByStatus}
            />

            <div className="card-actions">

                {!isExpired && (
                    <>
                        <button
                            onClick={() => handlePublish(listing.id)}
                            disabled={listing.published}
                            className={`btn ${listing.published ? 'btn-active' : 'btn-success'}`}
                        >
                            Опубликовать
                        </button>

                        <button
                            onClick={() => handleUnpublish(listing.id)}
                            disabled={!listing.published}
                            className={`btn ${!listing.published ? 'btn-active' : 'btn-warning'}`}
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
        </div>
    );
};

export default ListingItem;
