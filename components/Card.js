// components/Card.js
import React from 'react';
import Link from 'next/link';

const Card = ({ title, content, link, children }) => {
    // Функция для очистки HTML-тегов
    const stripHtmlTags = (html) => {
        if (!html) return '';
        return html.replace(/<\/?[^>]+(>|$)/g, '');
    };
    
    // Очищаем контент от HTML-тегов
    const cleanContent = stripHtmlTags(content || '');
    
    // Разбиваем по строкам для сохранения переносов
    const renderContent = () => {
        return cleanContent.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                {index < cleanContent.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
    };
    
    return (
        <div className="card mb-5 bg-white dark:bg-base-100 w-full shadow-sm rounded-lg p-5">
            {link ? ( // Проверяем наличие ссылки
                <Link href={link}>
                    <h1 className="card-title text-2xl font-bold mb-4">{stripHtmlTags(title)}</h1>
                    <p className="mb-2 whitespace-pre-wrap">{renderContent()}</p>
                </Link>
            ) : (
                <>
                    <h1 className="card-title text-2xl font-bold mb-4">{stripHtmlTags(title)}</h1>
                    <p className="mb-2 whitespace-pre-wrap">{renderContent()}</p>
                </>
            )}

            {children}
        </div>
    );
};

export default Card;
