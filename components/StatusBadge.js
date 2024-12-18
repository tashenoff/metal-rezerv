// components/StatusBadge.js
const StatusBadge = ({ status, color }) => {
    let badgeColorClass;

    switch (color) {
        case 'accepted':
            badgeColorClass = 'bg-green-500 text-sm text-black';
            break;
        case 'rejected':
            badgeColorClass = 'bg-red-500 text-sm text-black';
            break;
        case 'pending':
            badgeColorClass = 'bg-yellow-500 text-sm text-black';
            break;
        default:
            badgeColorClass = 'bg-gray-300 text-sm text-gray-700';
            break;
    }

    return (
        <span className={`inline-block px-2 py-1 rounded ${badgeColorClass}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
