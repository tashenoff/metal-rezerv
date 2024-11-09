import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaLinkedin, FaFacebook, FaTwitter } from 'react-icons/fa';
import ThemeToggle from '../components/ThemeToggle';  // Убедитесь, что путь правильный

const Footer = () => {
  return (
    <footer className="bg-base-200 py-10">
      <div className="container mx-auto text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Блок с информацией о компании */}
          <div>
            <h2 className="text-xl font-bold mb-4">О компании</h2>
            <p className="text-gray-600">
              Мы предоставляем лучшие решения для бизнеса, помогая вам развивать свои проекты и увеличивать прибыль.
            </p>
          </div>

          {/* Полезные ссылки */}
          <div>
            <h2 className="text-xl font-bold mb-4">Полезные ссылки</h2>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary">О нас</a></li>
              <li><a href="#" className="hover:text-primary">Услуги</a></li>
              <li><a href="#" className="hover:text-primary">Портфолио</a></li>
              <li><a href="#" className="hover:text-primary">Клиенты</a></li>
              <li><a href="#" className="hover:text-primary">Вакансии</a></li>
            </ul>
          </div>

          {/* Контактная информация */}
          <div>
            <h2 className="text-xl font-bold mb-4">Контакты</h2>
            <ul className="space-y-2">
              <li className="flex items-center justify-center md:justify-start">
                <FaPhoneAlt size={20} className="mr-2" />
                <a href="tel:+1234567890" className="text-gray-600 hover:text-primary">+1 (234) 567-890</a>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <FaEnvelope size={20} className="mr-2" />
                <a href="mailto:info@company.com" className="text-gray-600 hover:text-primary">info@company.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Социальные сети и переключатель темы */}
        <div className="mt-8 flex justify-between items-center">
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-primary">
              <FaFacebook size={24} />
            </a>
            <a href="#" className="text-gray-600 hover:text-primary">
              <FaTwitter size={24} />
            </a>
            <a href="#" className="text-gray-600 hover:text-primary">
              <FaLinkedin size={24} />
            </a>
          </div>

          <div>
            
            <ThemeToggle />
          </div>
        </div>

        {/* Нижний блок */}
        <div className="mt-10 border-t pt-5 text-center text-gray-600">
          <p>© 2024 Ваша B2B Платформа. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
