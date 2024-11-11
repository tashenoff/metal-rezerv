// components/ListingInfo.js
import Card from './Card';
import DateDisplay from './DateDisplay';

const ListingInfo = ({ listing }) => {
    return (
        <Card key={listing.id} title={listing.title} content={listing.content} link={`/listing/${listing.id}`}>
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
        </Card>
    );
};

export default ListingInfo;
