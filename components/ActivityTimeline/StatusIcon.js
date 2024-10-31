import React from 'react';

const StatusIcon = ({ status }) => {
    return (
        <span className={`flex h-4 w-4 items-center justify-center rounded-full ring-8 ring-base-100 
            ${status === 'rejected' ? 'bg-red-200' :
                status === 'pending' ? 'bg-orange-200' : 'bg-green-200'}`}>
            {status === 'rejected' ? (
               <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
               <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zM10 18.25C5.35 18.25 1.75 14.65 1.75 10S5.35 1.75 10 1.75 18.25 5.35 18.25 10 14.65 18.25 10 18.25z"></path>
               <path d="M9.125 14.875L5.375 11.125l1.375-1.375L9.125 12l5.125-5.125L15.625 8.5z"></path>
           </svg>
            ) : status === 'pending' ? (
                <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zM10 18.25C5.35 18.25 1.75 14.65 1.75 10S5.35 1.75 10 1.75 18.25 5.35 18.25 10 14.65 18.25 10 18.25z"></path>
                    <path d="M9.125 14.875L5.375 11.125l1.375-1.375L9.125 12l5.125-5.125L15.625 8.5z"></path>
                </svg>
            ) : (
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zM10 18.25C5.35 18.25 1.75 14.65 1.75 10S5.35 1.75 10 1.75 18.25 5.35 18.25 10 14.65 18.25 10 18.25z"></path>
                    <path d="M9.125 14.875L5.375 11.125l1.375-1.375L9.125 12l5.125-5.125L15.625 8.5z"></path>
                </svg>
            )}
        </span>
    );
};

export default StatusIcon;
