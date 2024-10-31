// components/TruncatedText.js
import React from 'react';

const TruncatedText = ({ text, maxLength }) => {
    // Проверяем, что text - это строка
    const truncated = typeof text === 'string' && text.length > maxLength 
        ? `${text.slice(0, maxLength)}...` 
        : text;

    return <span>{truncated}</span>;
};

export default TruncatedText;
