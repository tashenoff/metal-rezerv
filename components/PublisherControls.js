import StatusDisplay from './StatusDisplay';

const PublisherControls = ({ listing, isExpired, listingId, onPublish, onUnpublish }) => {
    return (
        <div className="card bg-base-200 p-5 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <span className="card-title">Статус публикации:</span>
                <StatusDisplay response={{ published: listing.published }} isPublicationStatus />
            </div>

            {listing.published ? (
                <button
                    className="btn btn-warning mt-5 w-full"
                    onClick={() => onUnpublish(listingId)} // Обернем в стрелочную функцию
                >
                    Снять с публикации
                </button>
            ) : (
                <>
                    {isExpired ? (
                        <button
                            className="btn btn-primary mt-5 w-full"
                            onClick={() => onPublish(listingId)} // Обернем в стрелочную функцию
                        >
                            Возобновить
                        </button>
                    ) : (
                        <button
                            className="btn btn-success mt-5 w-full"
                            onClick={() => onPublish(listingId)} // Обернем в стрелочную функцию
                        >
                            Опубликовать
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default PublisherControls;
