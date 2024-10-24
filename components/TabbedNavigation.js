import React, { useState } from 'react';

const TabbedNavigation = ({ onTabChange, isSorted, responseCounts }) => {
    const [activeTab, setActiveTab] = useState('pending'); 

    const handleTabClick = (status) => {
        if (isSorted) {
            setActiveTab(status);
            onTabChange(status); 
        }
    };

    return (
        <div className="tabs tabs-bordered mb-4" role="tablist">
            <a
                role="tab"
                className={`tab ${activeTab === 'pending' ? 'tab-active' : ''}`}
                onClick={() => handleTabClick('pending')}
            >
                Входящие ({responseCounts?.pending || 0})
            </a>
            <a
                role="tab"
                className={`tab ${activeTab === 'approved' ? 'tab-active' : ''}`}
                onClick={() => handleTabClick('approved')}
            >
                Принятые отклики ({responseCounts?.processed || 0})
            </a>
            <a
                role="tab"
                className={`tab ${activeTab === 'rejected' ? 'tab-active' : ''}`}
                onClick={() => handleTabClick('rejected')}
            >
                Отклоненные ({responseCounts?.rejected || 0})
            </a>
        </div>
    );
};

export default TabbedNavigation;
