// components/ListingsDisplay.js
import Card from './Card';
import DateDisplay from './DateDisplay';
import TruncatedText from '../components/TruncatedText';
import { ArrowRightCircleIcon } from '@heroicons/react/24/solid'

const ListingsDisplay = ({ listings, onListingClick }) => {
    return (
        <ul>
            {listings.map((listing) => (
                <Card
                    key={listing.id}
                    title={listing.title}

                    link={`/listing/${listing.id}`}
                    onClick={() => onListingClick(listing)}
                >
                    <p className='py-5'>
                        <TruncatedText text={listing.content} maxLength={200} />
                    </p>
                    <div className="flex items-center justify-between w-full py-2">
                        <div className='flex space-x-5'>
                            <div className="bg-base-100 px-5 py-2 rounded-full">
                                <DateDisplay label="Дата публикации" date={listing.publishedAt} />
                            </div>
                            <div className="bg-base-100 px-5 py-2 rounded-full">
                                <DateDisplay label="Дата доставки" date={listing.deliveryDate} />
                            </div>
                        </div>
                        <div className='flex'>
                            <span className='mr-2 text-sm underline'>Подробнее</span>
                            <ArrowRightCircleIcon className='w-5' />
                        </div>
                    </div>


                </Card>
            ))}
        </ul>
    );
};

export default ListingsDisplay;
