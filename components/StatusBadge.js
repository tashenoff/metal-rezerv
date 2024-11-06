// components/StatusBadge.js
const StatusBadge = ({ status, color }) => {
    let dotColorClass;

    switch (color) {
        case 'accepted':
            dotColorClass = 'bg-green-500';
            break;
        case 'rejected':
            dotColorClass = 'bg-red-500';
            break;
        case 'pending':
            dotColorClass = 'bg-yellow-500';
            break;
        default:
            dotColorClass = 'bg-gray-300';
            break;
    }

    return (
        <div className="flex items-center">
            <span className={`inline-block h-2 w-2 rounded-full ${dotColorClass} mr-2`} />
            <span className="text-sm">{status}</span>
        </div>
    );
};

export default StatusBadge;
