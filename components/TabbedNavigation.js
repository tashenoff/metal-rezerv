import React, { useState } from 'react';

const TabbedNavigation = ({ onTabChange, isSorted, responseCounts }) => {
    const [activeTab, setActiveTab] = useState('pending'); // Измените на 'approved'

    const handleTabClick = (status) => {
        if (isSorted) {
            setActiveTab(status);
            onTabChange(status); // Вызываем функцию для изменения вкладки
        }
    };

    return (
        <div className="mb-4">
            <ul className="flex space-x-4">
                <li onClick={() => handleTabClick('pending')} className="cursor-pointer">
                    Входящие ({responseCounts?.pending || 0})
                </li>
                <li onClick={() => handleTabClick('approved')} className="cursor-pointer"> {/* Измените на 'approved' */}
                    Принятые отклики ({responseCounts?.processed || 0}) {/* Если это всё ещё processed, измените на responseCounts?.approved */}
                </li>
                <li onClick={() => handleTabClick('rejected')} className="cursor-pointer">
                    Отклоненные ({responseCounts?.rejected || 0})
                </li>
            </ul>
        </div>
    );
};

export default TabbedNavigation;
