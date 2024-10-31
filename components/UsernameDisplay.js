// components/UsernameDisplay.js
import React from 'react';

const UsernameDisplay = ({ username }) => {
    return (
        <span className="text-sm">
            {`Привет, ${username}! `}
        </span>
    );
};

export default UsernameDisplay;
