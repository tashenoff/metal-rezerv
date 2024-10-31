// components/ResponseSummary.js
import React from 'react';

const ResponseSummary = ({ responses }) => {
    const totalResponses = responses.length; // Общее количество откликов
    const acceptedResponses = responses.filter(response => response.accepted === true).length; // Количество принятых откликов
    const rejectedResponses = responses.filter(response => response.accepted === false).length; // Количество отклоненных откликов
    const pendingResponses = responses.filter(response => response.accepted === null).length; // Количество на рассмотрении

    return (
        <div className="p-4 card bg-base-100 mb-5">
            <h3 className="text-lg font-semibold">Статистика откликов</h3>
            <ul className="mt-2">
                <li>Общее количество откликов: <strong>{totalResponses}</strong></li>
                <li>Принятые отклики: <strong>{acceptedResponses}</strong></li> {/* Добавлено */}
                <li>Отклоненные отклики: <strong>{rejectedResponses}</strong></li>
                <li>На рассмотрении: <strong>{pendingResponses}</strong></li>
            </ul>
        </div>
    );
};

export default ResponseSummary;
