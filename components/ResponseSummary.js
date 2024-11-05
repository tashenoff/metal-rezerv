// components/ResponseSummary.js
import React from 'react';
import { InboxIcon , CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

const ResponseSummary = ({ responses = [] }) => {
    const totalResponses = responses.length; // Общее количество откликов
    const acceptedResponses = responses.filter(response => response.accepted === true).length; // Количество принятых откликов
    const rejectedResponses = responses.filter(response => response.accepted === false).length; // Количество отклоненных откликов
    const pendingResponses = responses.filter(response => response.accepted === null).length; // Количество на рассмотрении

    return (
        <div className="stats shadow w-full my-5">
            <div className="stat">
                <div className="stat-figure text-secondary">
                    <InboxIcon  className="h-8 w-8" />
                </div>
                <div className="stat-title">Общее количество откликов</div>
                <div className="stat-value">{totalResponses}</div>
               
            </div>

            <div className="stat">
                <div className="stat-figure text-secondary">
                    <CheckCircleIcon className="h-8 w-8" />
                </div>
                <div className="stat-title">Принятые отклики</div>
                <div className="stat-value">{acceptedResponses}</div>
                
            </div>

            <div className="stat">
                <div className="stat-figure text-secondary">
                    <XCircleIcon className="h-8 w-8" />
                </div>
                <div className="stat-title">Отклоненные отклики</div>
                <div className="stat-value">{rejectedResponses}</div>
               
            </div>

            <div className="stat">
                <div className="stat-figure text-secondary">
                    <ClockIcon className="h-8 w-8" />
                </div>
                <div className="stat-title">На рассмотрении</div>
                <div className="stat-value">{pendingResponses}</div>
               
            </div>
        </div>
    );
};

export default ResponseSummary;
