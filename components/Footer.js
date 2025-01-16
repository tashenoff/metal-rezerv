// components/Form.js
import React from 'react';
import ThemeToggle from './ui/ThemeToggle';

const Footer = () => {
    return (
        <div className='container mx-auto'>
            <div className='flex items-center justify-between my-4 bg-base-200 p-4 rounded-md'>
                <span>Настройка темы</span>
                <ThemeToggle />
            </div>
            <div className='flex justify-between py-5 items-center'>
                <div className=''>2025 INEED. All rights reserved</div>
                <div className='flex justify-end space-x-6 py-5'>
                    <a href='#about' className='text-blue-600 hover:underline'>
                        О компании
                    </a>
                    <a href='#terms' className='text-blue-600 hover:underline'>
                        Условия пользования
                    </a>
                    <a href='#methodology' className='text-blue-600 hover:underline'>
                        Методология
                    </a>
                    <a href='#careers' className='text-blue-600 hover:underline'>
                        Вакансии
                    </a>
                </div>
            </div>

        </div>
    );
};

export default Footer;
