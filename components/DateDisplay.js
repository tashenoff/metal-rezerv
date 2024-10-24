// components/DateDisplay.js
import React from 'react';

const DateDisplay = ({ date, label }) => {
    return (
        <p className='flex w-full'>
            <div>{label}</div>: {new Date(date).toLocaleDateString()}
        </p>
    );
};

export default DateDisplay;
