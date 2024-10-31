import React from 'react';

const ResponderInfo = ({ responderData }) => {
    if (!responderData) return null;

    return (
        <div className="mt-4 p-2 border-t border-gray-300">
            <h4 className="font-semibold">Информация о респонденте:</h4>
            <p><strong>Имя:</strong> {responderData.name}</p>
            <p><strong>Организация:</strong> {responderData.companyName}</p>
            <p><strong>Дата Регистрации:</strong> {new Date(responderData.registrationDate).toLocaleDateString()}</p>
            <p><strong>Контактный Email:</strong> {responderData.email}</p>
            <p><strong>Телефон для связи:</strong> {responderData.phoneNumber}</p>
        </div>
    );
};

export default ResponderInfo;
