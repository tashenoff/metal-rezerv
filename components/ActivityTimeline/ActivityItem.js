import React from 'react';
import StatusIcon from './StatusIcon';
import ListingLink from './ListingLink';
import ResponseDetails from './ResponseDetails';

const ActivityItem = ({ response }) => {
    return (
        <div key={response.id} className="mb-10 ml-6">
            
            <div className="p-6 bg-white rounded-lg border flex flex-col justify-center border-gray-300 shadow-sm">
            <StatusIcon status={response.status} />
                <ListingLink listing={response.listing} />
                <ResponseDetails status={response.status} createdAt={response.createdAt} />
            </div>
        </div>
    );
};

export default ActivityItem;
