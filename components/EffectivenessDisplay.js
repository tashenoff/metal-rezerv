// components/EffectivenessDisplay.js
import React from 'react';

const EffectivenessDisplay = ({ responses }) => {
    const totalResponses = responses.length;

    // Функция для определения уровня эффективности
    const getEffectivenessLevel = () => {
        if (totalResponses < 5) {
            return 'Новичок';
        } else if (totalResponses <= 15) {
            return 'Опытный';
        } else {
            return 'Эксперт';
        }
    };

    return (
        <div className="flex py-2 px-5 rounded-full  items-center bg-base-100">
            <div className=""><span className='mr-2'>Ваш уровень:</span> <strong className='text-secondary'>{getEffectivenessLevel()}</strong></div>
            {/* <p>Общее количество откликов: <strong>{totalResponses}</strong></p> */}
        </div>
    );
};

export default EffectivenessDisplay;
