import React, { useState } from 'react';

const TabbedNavigation = ({ onTabChange, isSorted, responseCounts }) => {
    const [activeTab, setActiveTab] = useState('pending');
    const tabs = [
        { status: 'pending', label: `Входящие (${responseCounts?.pending || 0})` },
        { status: 'approved', label: `Принятые отклики (${responseCounts?.processed || 0})` },
        { status: 'rejected', label: `Отклоненные (${responseCounts?.rejected || 0})` },
    ];

    const handleTabClick = (status) => {
        if (isSorted) {
            setActiveTab(status);
            onTabChange(status);
        }
    };

    const handleArrowClick = (direction) => {
        const currentIndex = tabs.findIndex(tab => tab.status === activeTab);
        const nextIndex = direction === 'left'
            ? (currentIndex > 0 ? currentIndex - 1 : tabs.length - 1)
            : (currentIndex < tabs.length - 1 ? currentIndex + 1 : 0);
        const nextTab = tabs[nextIndex];
        setActiveTab(nextTab.status);
        onTabChange(nextTab.status);
    };

    return (
        <div className="my-5 py-5">
            <div className='grid grid-cols-12 items-center justify-center gap-5'>
                <button
                    className="bg-base-100 col-span-2 rounded-full p-2"
                    onClick={() => handleArrowClick('left')}
                    aria-label="Scroll left"
                >
                    &#8592; {/* Стрелка влево */}
                </button>

                <select
                    className="select select-bordered w-full col-span-8"
                    value={activeTab}
                    onChange={(e) => handleTabClick(e.target.value)}
                >
                    {tabs.map(tab => (
                        <option key={tab.status} value={tab.status}>
                            {tab.label}
                        </option>
                    ))}
                </select>

                <button
                    className="bg-base-100 rounded-full p-2 col-span-2"
                    onClick={() => handleArrowClick('right')}
                    aria-label="Scroll right"
                >
                    &#8594; {/* Стрелка вправо */}
                </button>
            </div>
        </div>
    );
};

export default TabbedNavigation;
