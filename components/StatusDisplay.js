// components/StatusDisplay.js
import StatusBadge from './StatusBadge';

const StatusDisplay = ({ response, isPublicationStatus }) => {
    // Функция для получения статуса отклика
    const getResponseStatus = (response) => {
        if (response.accepted === true) return 'Принят';
        if (response.accepted === false) return 'Отклонён';
        return 'На рассмотрении';
    };

    // Получаем статус в зависимости от того, является ли это публикацией или откликом
    const status = isPublicationStatus 
        ? (response.published ? 'Опубликовано' : 'Не опубликовано') 
        : getResponseStatus(response);

    // Определяем цвет статуса на основе значения
    let color;
    if (isPublicationStatus) {
        color = response.published ? 'accepted' : 'rejected';
    } else {
        if (response.accepted === true) color = 'accepted';
        else if (response.accepted === false) color = 'rejected';
        else color = 'pending';
    }

    return (
        <div>
            <StatusBadge status={status} color={color} />
        </div>
    );
};

export default StatusDisplay;
