import React from 'react';

const StatCard = ({ icon: Icon, title, value, iconColor = 'text-secondary' }) => {
    return (
        <div className="stat">
            <div className={`stat-figure ${iconColor}`}>
                <Icon className="h-8 w-8" />
            </div>
            <div className="stat-title">{title}</div>
            <div className="stat-value">{value}</div>
        </div>
    );
};

export default StatCard;
