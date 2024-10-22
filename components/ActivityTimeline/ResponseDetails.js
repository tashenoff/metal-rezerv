import React from 'react';

const ResponseDetails = ({ status, createdAt }) => {
    return (
        <div className='flex justify-between py-2'>
            <p className="text-gray-600">Статус отклика: {status}</p>

            <div className="flex justify-between items-center mb-2">
                <time className="block text-sm text-gray-500">
                    {new Date(createdAt).toLocaleDateString()}
                </time>
            </div>
            
        </div>
    );
};

export default ResponseDetails;
