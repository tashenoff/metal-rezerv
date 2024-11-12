// components/EffectivenessDisplay.js
import React from 'react';

const EffectivenessDisplay = ({ level }) => {
    // Функция для определения класса цвета на основе уровня
    const getLevelColor = (level) => {
        switch (level) {
            case 'NOVICE':
                return 'text-green-500'; // Зеленый
            case 'EXPERIENCED':
                return 'text-purple-500'; // Фиолетовый
            case 'EXPERT':
                return 'text-yellow-500'; // Золотой
            default:
                return 'text-gray-500'; // Серый для неопределенных уровней
        }
    };

    return (
       
            <div className='flex justify-between py-2 px-5 rounded-lg items-center bg-base-100'>
                <span className='mr-2'>Ваш уровень:</span>
                <strong className={getLevelColor(level)}>{level}</strong> {/* Применяем цвет к уровню */}
            </div>
       
    );
};

export default EffectivenessDisplay;
