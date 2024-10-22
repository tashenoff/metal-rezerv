// components/ResponseCounts.js
const ResponseCounts = ({ listingId, responseCountsByStatus }) => {
    const responseCounts = responseCountsByStatus[listingId] || { totalCount: 0, counts: { pending: 0, processed: 0, rejected: 0 } };

    
    return (
        <div className="mt-2">
            <p>Количество откликов: {responseCounts.totalCount || 0}</p>
            <div>
                <p>Ожидающие отклики: {responseCounts.counts.pending || 0}</p>
                <p>Обработанные отклики: {responseCounts.counts.processed || 0}</p>
                <p>Отклоненные отклики: {responseCounts.counts.rejected || 0}</p>
            </div>
        </div>
    );
};

export default ResponseCounts;
