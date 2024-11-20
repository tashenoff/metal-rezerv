import React from 'react';

const ResponderInfo = ({ responderData }) => {
    if (!responderData) return null;

    // Логируем данные для проверки
    // console.log('Responder data:', responderData);

    // Извлекаем данные компании, если они есть
    const companyBinOrIin = responderData.company?.binOrIin || 'Не указано';
    const companyRegion = responderData.company?.region || 'Не указано';
    
    // Формируем ссылку для WhatsApp, если номер телефона доступен
    const whatsappLink = responderData.phoneNumber ? `https://wa.me/${responderData.phoneNumber.replace(/[^0-9]/g, '')}` : null;
    
    // Формируем ссылку для звонка, если номер телефона доступен
    const phoneLink = responderData.phoneNumber ? `tel:${responderData.phoneNumber}` : null;

    return (
        <div className="mt-4 p-2 border-t border-gray-300">
            <h4 className="font-semibold">Контактное лицо:</h4>
            <p><strong>Имя:</strong> {responderData.name}</p>
            <p><strong>Контактный Email:</strong> {responderData.email}</p>
            <p><strong>Телефон для связи:</strong> {responderData.phoneNumber}</p>
            <strong>Компания:</strong> {responderData.company ? responderData.company.name : 'Не указана'}
            <p><strong>BIN/IIN организации:</strong> {companyBinOrIin}</p>
            <p><strong>Регион организации:</strong> {companyRegion}</p>
            
            {/* Если есть ссылка на WhatsApp, показываем кнопку */}
            {whatsappLink && (
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center mt-5 inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                >
                    Написать в WhatsApp
                </a>
            )}

            {/* Если есть ссылка для звонка, показываем кнопку */}
            {phoneLink && (
                <a
                    href={phoneLink}
                    className="w-full text-center mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Позвонить
                </a>
            )}
        </div>
    );
};

export default ResponderInfo;
