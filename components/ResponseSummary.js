// components/ResponseSummary.js
import React from 'react';

const ResponseSummary = ({ responses }) => {
    const totalResponses = responses.length; // Общее количество откликов
    const acceptedResponses = responses.filter(response => response.accepted === true).length; // Количество принятых откликов
    const rejectedResponses = responses.filter(response => response.accepted === false).length; // Количество отклоненных откликов
    const pendingResponses = responses.filter(response => response.accepted === null).length; // Количество на рассмотрении

    return (
        <div className="py-4">
           
            <ul className=" flex">
                <li className='rounded-full py-2 px-5 text-sm items-center bg-base-100 mx-2 space-x-3 flex'><span>Общее количество откликов:</span> <strong className='text-secondary'>{totalResponses}</strong></li>
                <li className='rounded-full py-2 px-5 text-sm items-center bg-base-100 mx-2 space-x-3 flex'><span>Принятые отклики: </span><strong className='text-secondary'>{acceptedResponses}</strong></li> {/* Добавлено */}
                <li className='rounded-full py-2 px-5 text-sm items-center bg-base-100 mx-2 space-x-3 flex'><span>Отклоненные отклики:</span> <strong className='text-secondary'>{rejectedResponses}</strong></li>
                <li className='rounded-full py-2 px-5 text-sm items-center bg-base-100 mx-2 space-x-3 flex'><span>На рассмотрении:</span> <strong className='text-secondary'>{pendingResponses}</strong></li>
            </ul>
        </div>
    );
};

export default ResponseSummary;
