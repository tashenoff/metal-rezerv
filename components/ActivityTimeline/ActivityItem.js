import React from 'react';
import StatusIcon from './StatusIcon';
import ListingLink from './ListingLink';
import ResponseDetails from './ResponseDetails';

const ActivityItem = ({ response }) => {
    return (
        <div key={response.id} className="card bg-base-200 my-5">

            <div className="card-body">
                <div className='flex items-center space-x-5 my-5'>
                    <StatusIcon status={response.status} />
                    <ListingLink listing={response.listing} />
                </div>
                {response && <ResponseDetails response={response} isPublicationStatus={false} />}

            </div>
        </div>
    );
};

export default ActivityItem;
