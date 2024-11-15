// components/Form.js
import React from 'react';
import ThemeToggle from './ThemeToggle';

const Footer = () => {
    return (
        <>
           <div className='flex items-center justify-between my-4 bg-base-200 p-4 rounded-md'>
                    <span>Настройка темы</span>
                    <ThemeToggle />
                </div>
        </>
    );
};

export default Footer;
