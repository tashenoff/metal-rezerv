import React from 'react';
import DateDisplay from '../DateDisplay';
import StatusDisplay from '../StatusDisplay'; // Импортируем StatusDisplay

const ResponseDetails = ({ response, isPublicationStatus }) => {
    return (
        <div className='flex justify-between items-center'>
            {/* Добавляем компонент StatusDisplay */}
            <StatusDisplay response={response} isPublicationStatus={isPublicationStatus} />

            <div className="flex justify-between items-center mb-2">
                <time className="block text-sm text-gray-500">
                <DateDisplay date={response.createdAt} /> {/* Используем createdAt из response */}
                </time>
            </div>
        </div>
    );
};

export default ResponseDetails;
