// components/EffectivenessDisplay.js
import React from 'react';

const EffectivenessDisplay = ({ level }) => {
    return (
        <div className="flex py-2 px-5 rounded-full items-center bg-base-100">
            <div>
                <span className='mr-2'>Ваш уровень:</span>
                <strong className='text-secondary'>{level}</strong>
            </div>
        </div>
    );
};

export default EffectivenessDisplay;
