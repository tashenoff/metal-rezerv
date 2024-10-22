// components/PointsDisplay.js
import React from 'react';

const PointsDisplay = ({ points, role }) => {
    return (
        <span className="text-sm">
            {role === 'RESPONDER' && `Баланс: ${points} коинов`}
        </span>
    );
};

export default PointsDisplay;
