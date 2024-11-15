// components/ListingInfo.js
import DateDisplay from './DateDisplay';
import Link from 'next/link';

const ListingInfo = ({ listing }) => {
    return (
        <Link href={`/listings/${listing.id}`}>
            <div className='card rounded-lg bg-base-100 p-5' key={listing.id}>
                <div className='flex items-center justify-between'>
                    <div className='card-title'>{listing.title} </div>

                    <div className="py-2 px-4 text-center text-sm">
                        <span className="font-semibold">Цена за отклик:</span> {listing.responseCost || 'Не указан'} поинтов
                    </div>
                </div>


                <div className='card-body'>{listing.content}</div>

                <DateDisplay label="Дата публикации" date={listing.publishedAt} />
                <div className="grid lg:grid-cols-3 gap-4 py-5">
                    <div className="py-2 px-2 text-center text-sm rounded-full bg-base-300 shadow">
                        <DateDisplay label="Дата доставки" date={listing.deliveryDate} />
                    </div>
                    <div className="py-2 px-2 text-center text-sm rounded-full bg-base-300 shadow">
                        <DateDisplay label="Дата закупки" date={listing.purchaseDate} />
                    </div>
                    <div className="py-2 px-2 text-center text-sm rounded-full bg-base-300 shadow">
                        <DateDisplay label="Актуально до" date={listing.expirationDate} isExpirationDate />
                    </div>
                </div>


                {/* Добавляем отображение новых полей */}

                <div className="py-2 px-2 text-center text-sm rounded-full bg-base-300 shadow mb-2">
                    <span className="font-semibold">Метод закупки:</span> {listing.purchaseMethod || 'Не указан'}
                </div>
                <div className="py-2 px-2 text-center text-sm rounded-full bg-base-300 shadow mb-2">
                    <span className="font-semibold">Условия оплаты:</span> {listing.paymentTerms || 'Не указаны'}
                </div>
                <div className="py-2 px-2 text-center text-sm rounded-full bg-base-300 shadow">
                    <span className="font-semibold">Тип объявления:</span> {listing.type || 'Не указан'}
                </div>
            </div>
        </Link>
    );
};

export default ListingInfo;
