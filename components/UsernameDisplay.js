// components/UsernameDisplay.js
import React from 'react';
import { useTranslation } from 'next-i18next';

const UsernameDisplay = ({ username }) => {
    const { t } = useTranslation('common'); // Подключаем переводы из файла common.json
    return (
        <span className="text-sm">
            {`${t('navbar.greeting')}, ${username}!`}
        </span>
    );
};

export default UsernameDisplay;
