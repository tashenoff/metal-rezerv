// components/ListingsDisplay.js
import Card from './Card';
import DateDisplay from './DateDisplay';
import TruncatedText from '../components/TruncatedText';
import { ArrowRightCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

const ListingsDisplay = ({ listings, onListingClick }) => {
    return (
        <ul className="space-y-4"> {/* Добавим отступы между элементами списка */}
            {listings.map((listing) => (
                <li key={listing.id}> {/* Оборачиваем в li для лучшей семантики */}
                    <Card
                        title={listing.title}
                        link={`/listings/${listing.id}`}
                        onClick={() => onListingClick(listing)}
                    >
                        <p className='py-5'>
                            <TruncatedText text={listing.content} maxLength={200} />
                        </p>
                        <div className="flex lg:flex-row flex-col items-center justify-between w-full py-2">
                            <div className='flex lg:flex-row flex-col lg:space-x-5'>
                                <div className="bg-base-300 px-5 py-2 rounded-full">
                                    <DateDisplay label="Дата публикации" date={listing.publishedAt} />
                                </div>
                                <div className="bg-base-300 px-5 py-2 mt-3 lg:mt-0 rounded-full">
                                    <DateDisplay label="Дата доставки" date={listing.deliveryDate} />
                                </div>
                            </div>
                            <Link className='mt-5 lg:w-auto w-full flex' href={`/listing/${listing.id}`}>
                                <button className="btn btn-outline btn-primary justify-between lg:w-auto w-full">
                                    Подробнее
                                    <ArrowRightCircleIcon className='w-5 h-5' /> {/* Добавим высоту для иконки */}
                                </button>
                            </Link>



                        </div>
                    </Card>
                </li>
            ))}
        </ul>
    );
};

export default ListingsDisplay;
