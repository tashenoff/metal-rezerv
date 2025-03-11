// components/TruncatedText.js
import React from 'react';

const TruncatedText = ({ text, maxLength }) => {
    // Функция для удаления HTML-тегов
    const stripHtmlTags = (html) => {
        if (!html || typeof html !== 'string') return '';
        return html.replace(/<\/?[^>]+(>|$)/g, '');
    };
    
    // Очищаем текст от HTML-тегов
    const cleanText = stripHtmlTags(text);
    
    // Обрезаем текст, если он длиннее maxLength
    const truncated = cleanText.length > maxLength 
        ? `${cleanText.slice(0, maxLength)}...` 
        : cleanText;
    
    // Обрабатываем переносы строк
    const renderText = () => {
        return truncated.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                {index < truncated.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
    };

    return <span className="whitespace-pre-wrap">{renderText()}</span>;
};

export default TruncatedText;
