// components/PointsDisplay.js
import React from 'react';
import { useTranslation } from 'next-i18next';

const PointsDisplay = ({ points, role }) => {
    
  const { t } = useTranslation('common'); // Подключаем переводы из файла common.json

    return (
        <div>
            {role === 'RESPONDER' && (
                <button className="btn">
                      {t('navbar.my_points')}
                    <div className="badge badge-secondary"> {points}</div>
                </button>
            )}
        </div>
    );
};

export default PointsDisplay;
