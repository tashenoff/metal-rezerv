import React from 'react';
import { InboxIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import StatCard from './ui/StatCard';
import { useTranslation } from 'next-i18next';

const ResponseSummary = ({ responses = [] }) => {
    const { t } = useTranslation('common'); // Подключаем переводы из файла common.json
    const totalResponses = responses.length; // Общее количество откликов
    const acceptedResponses = responses.filter(response => response.accepted === true).length; // Количество принятых откликов
    const rejectedResponses = responses.filter(response => response.accepted === false).length; // Количество отклоненных откликов
    const pendingResponses = responses.filter(response => response.accepted === null).length; // Количество на рассмотрении

    return (
        <div className="stats shadow w-full my-5">
            <StatCard
                icon={InboxIcon}
                title={t('activity.total_responses')}
                value={totalResponses}
            />
            <StatCard
                icon={CheckCircleIcon}
                title={t('activity.Accepted_feedback')}
                value={acceptedResponses}
                iconColor="text-green-500"
            />
            <StatCard
                icon={XCircleIcon}
                title={t('activity.Rejected_responses')}
                value={rejectedResponses}
                iconColor="text-red-500"
            />
            <StatCard
                icon={ClockIcon}
                title={t('activity.Under_review')}
                value={pendingResponses}
                iconColor="text-yellow-500"
            />
        </div>
    );
};

export default ResponseSummary;


