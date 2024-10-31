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
        <div className="p-4 card bg-base-200">
            <h3 className="text-lg font-semibold">Эффективность</h3>
            <p className="mt-2">Вы находитесь на уровне: <strong>{getEffectivenessLevel()}</strong></p>
            {/* <p>Общее количество откликов: <strong>{totalResponses}</strong></p> */}
        </div>
    );
};

export default EffectivenessDisplay;
