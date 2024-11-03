// components/ListingInfo.js
import Card from './Card';
import DateDisplay from './DateDisplay';

const ListingInfo = ({ listing }) => {
    return (
        <Card key={listing.id} title={listing.title} content={listing.content} link={`/listing/${listing.id}`}>
            <DateDisplay label="Дата публикации" date={listing.publishedAt} />
            <div className="grid grid-cols-3 gap-4 py-5">
                <div className="py-2 px-2 text-center text-sm rounded-full bg-base-100 shadow">
                    <DateDisplay label="Дата доставки" date={listing.deliveryDate} />
                </div>
                <div className="py-2 px-2 text-center text-sm rounded-full bg-base-100 shadow">
                    <DateDisplay label="Дата закупки" date={listing.purchaseDate} />
                </div>
                <div className="py-2 px-2 text-center text-sm rounded-full bg-base-100 shadow">
                    <DateDisplay label="Актуально до" date={listing.expirationDate} isExpirationDate />
                </div>
            </div>
        </Card>
    );
};

export default ListingInfo;