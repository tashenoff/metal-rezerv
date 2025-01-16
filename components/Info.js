// components/Info.js
import React from 'react';

const Info = ({ title, message, icon = 'ℹ️' }) => {
  return (
    <div className="flex items-start p-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="mr-4 text-2xl">
        {icon}
      </div>
      <div>
        {title && <strong className="block font-semibold text-blue-600">{title}</strong>}
        <p className="text-blue-600">{message}</p>
      </div>
    </div>
  );
};

export default Info;
