import React from 'react';

const ResponderInfo = ({ responderData }) => {
    if (!responderData) return null;

    // Извлекаем данные компании, если они есть
    const companyName = responderData.company?.name || 'Не указано';
    const companyBinOrIin = responderData.company?.binOrIin || 'Не указано';
    const companyRegion = responderData.company?.region || 'Не указано';

    return (
        <div className="mt-4 p-2 border-t border-gray-300">
            <h4 className="font-semibold">Информация о респонденте:</h4>
            <p><strong>Имя:</strong> {responderData.name}</p>
            <p><strong>Организация:</strong> {companyName}</p>
            <p><strong>BIN/IIN организации:</strong> {companyBinOrIin}</p>
            <p><strong>Регион организации:</strong> {companyRegion}</p>
            <p><strong>Дата Регистрации:</strong> {new Date(responderData.registrationDate).toLocaleDateString()}</p>
            <p><strong>Контактный Email:</strong> {responderData.email}</p>
            <p><strong>Телефон для связи:</strong> {responderData.phoneNumber}</p>
            <p><strong>Уровень:</strong> {responderData.level}</p>
        </div>
    );
};

export default ResponderInfo;
