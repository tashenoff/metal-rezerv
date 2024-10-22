import React from 'react';
import Link from 'next/link';

const ListingLink = ({ listing }) => {
    return (
        <h3 className="text-lg font-semibold">
            <Link href={`/listing/${listing.id}`} className="text-blue-600 hover:underline">
                Отклик на объявление "{listing.title}"
            </Link>
        </h3>
    );
};

export default ListingLink;
