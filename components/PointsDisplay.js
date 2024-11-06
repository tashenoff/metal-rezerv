// components/PointsDisplay.js
import React from 'react';

const PointsDisplay = ({ points, role }) => {
    return (
        <div>
            {role === 'RESPONDER' && (
                <button className="btn">
                    Баланс
                    <div className="badge badge-secondary"> {points}</div>
                </button>
            )}
        </div>
    );
};

export default PointsDisplay;
