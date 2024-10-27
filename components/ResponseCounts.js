// components/ResponseCounts.js
const ResponseCounts = ({ listingId, responseCountsByStatus }) => {
    const responseCounts = responseCountsByStatus[listingId] || { totalCount: 0, counts: { pending: 0, processed: 0, rejected: 0 } };

    return (
        <div className="stats shadow p-4 my-10">
            <div className="stat place-items-center">
                <div className="stat-title">Количество откликов</div>
                <div className="stat-value">{responseCounts.totalCount || 0}</div>
                <div className="stat-desc">Всего откликов</div>
            </div>

            <div className="stat place-items-center">
                <div className="stat-title">Ожидающие отклики</div>
                <div className="stat-value text-yellow-500">{responseCounts.counts.pending || 0}</div>
                <div className="stat-desc">Ожидающие обработки</div>
            </div>

            <div className="stat place-items-center">
                <div className="stat-title">Обработанные отклики</div>
                <div className="stat-value text-green-500">{responseCounts.counts.processed || 0}</div>
                <div className="stat-desc">Обработанные успешно</div>
            </div>

            <div className="stat place-items-center">
                <div className="stat-title">Отклоненные отклики</div>
                <div className="stat-value text-red-500">{responseCounts.counts.rejected || 0}</div>
                <div className="stat-desc">Отклоненные</div>
            </div>
        </div>
    );
};

export default ResponseCounts;
