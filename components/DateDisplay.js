// components/DateDisplay.js
import React from 'react';

const DateDisplay = ({ date, label }) => {
    // Опции для форматирования даты
    const options = { 
        weekday: 'short', // сокращённое название дня недели
        day: 'numeric',    // день месяца
        month: 'short',    // сокращённое название месяца
        year: 'numeric'    // год
    };
    
    // Получаем дату с нужными параметрами
    const formattedDate = new Date(date).toLocaleDateString('ru-RU', options);

    return (
        <div>{label} {formattedDate}</div>
    );
};

export default DateDisplay;
