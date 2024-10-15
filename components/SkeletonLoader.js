// components/SkeletonLoader.js
import React from 'react';

const SkeletonLoader = () => {
    return (
        <div className="animate-pulse flex space-x-4">
            <div className="flex-1 bg-gray-300 h-6 rounded"></div>
            <div className="flex-1 bg-gray-300 h-6 rounded"></div>
            <div className="flex-1 bg-gray-300 h-6 rounded"></div>
        </div>
    );
};

export default SkeletonLoader;
