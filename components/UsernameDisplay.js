// components/UsernameDisplay.js
import React from 'react';


const UsernameDisplay = ({ username, avatarUrl }) => {

    return (
        <div className="flex items-center space-x-2">
            {/* Аватар */}
            {avatarUrl && (
                <img
                    src={avatarUrl}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                />
            )}
            {/* Имя пользователя */}
            <span className="text-sm">
                {username}
            </span>
        </div>
    );
};

export default UsernameDisplay;